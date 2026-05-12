import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Trash, Edit, List, Settings, Save, X, Eye, EyeOff, Book, Search, ArrowUp, Code, Clock, Cpu, AlertCircle } from 'lucide-react'

function Admin() {
  const [problems, setProblems] = useState([])
  const [view, setView] = useState('list') // 'list' or 'form'
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  
  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimit, setTimeLimit] = useState(1.0)
  const [memoryLimit, setMemoryLimit] = useState(256)
  const [difficulty, setDifficulty] = useState('Easy')
  const [explanation, setExplanation] = useState('')
  const [testCases, setTestCases] = useState([{ input_data: '', expected_output: '', is_hidden: 0 }])

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      const res = await api.get('/problems/')
      setProblems(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const addTestCase = () => {
    setTestCases([...testCases, { input_data: '', expected_output: '', is_hidden: 1 }])
  }

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTimeLimit(1.0)
    setMemoryLimit(256)
    setDifficulty('Easy')
    setExplanation('')
    setTestCases([{ input_data: '', expected_output: '', is_hidden: 0 }])
    setEditingId(null)
  }

  const handleEdit = async (id) => {
    try {
      const res = await api.get(`/problems/${id}`)
      const p = res.data
      setTitle(p.title)
      setDescription(p.description)
      setTimeLimit(p.time_limit)
      setMemoryLimit(p.memory_limit)
      setDifficulty(p.difficulty)
      setExplanation(p.explanation || '')
      setTestCases(p.test_cases || [{ input_data: '', expected_output: '', is_hidden: 0 }])
      setEditingId(id)
      setView('form')
    } catch (e) {
      alert('Error fetching problem: ' + e.message)
    }
  }

  const handleSave = async () => {
    try {
      const data = {
        title,
        description,
        time_limit: parseFloat(timeLimit),
        memory_limit: parseInt(memoryLimit),
        difficulty,
        explanation,
        test_cases: testCases
      }

      if (editingId) {
        await api.put(`/problems/${editingId}`, data)
        alert('Problem updated successfully!')
      } else {
        await api.post('/problems/', data)
        alert('Problem created successfully!')
      }
      
      setView('list')
      fetchProblems()
      resetForm()
    } catch (e) {
      alert('Error: ' + (e.response?.data?.detail || e.message))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem?')) return
    try {
      await api.delete(`/problems/${id}`)
      fetchProblems()
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedAndFilteredProblems = problems
    .filter(p => 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.difficulty?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' }
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' }
      case 'hard': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' }
      default: return { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: 'rgba(255,255,255,0.1)' }
    }
  }

  return (
    <div className="animate-fade" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '2.5rem',
        background: 'var(--bg-accent)',
        padding: '2rem',
        borderRadius: '1.5rem',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Problem Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {view === 'list' ? `${problems.length} challenges total` : (editingId ? `Editing Challenge #${editingId}` : 'Create New Challenge')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {view === 'form' ? (
            <button 
              className="btn" 
              onClick={() => { setView('list'); resetForm(); }} 
              style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem'
              }}
            >
              <X size={18} /> Cancel
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={() => { setView('form'); resetForm(); }}
              style={{
                background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Plus size={18} /> New Problem
            </button>
          )}
        </div>
      </div>

      {view === 'list' ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.5 }} />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.75rem',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
                    <th 
                      style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
                      onClick={() => handleSort('id')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ID <ArrowUp size={14} />
                      </div>
                    </th>
                    <th 
                      style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
                      onClick={() => handleSort('title')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Title <ArrowUp size={14} />
                      </div>
                    </th>
                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Difficulty
                    </th>
                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Constraints
                    </th>
                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredProblems.map((p, index) => (
                    <tr 
                      key={p.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ 
                          color: 'var(--text-muted)', 
                          fontSize: '0.85rem',
                          fontFamily: 'monospace',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem'
                        }}>
                          #{p.id}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '0.75rem',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                          }}>
                            <Code size={16} color="var(--primary)" />
                          </div>
                          <span>{p.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.4rem 1rem',
                          borderRadius: '2rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: getDifficultyColor(p.difficulty).bg,
                          color: getDifficultyColor(p.difficulty).color,
                          border: `1px solid ${getDifficultyColor(p.difficulty).border}`
                        }}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={14} />
                            <span>{p.time_limit}s</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Cpu size={14} />
                            <span>{p.memory_limit}MB</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => handleEdit(p.id)}
                            style={{ 
                              background: 'rgba(139, 92, 246, 0.15)', 
                              color: 'var(--primary)',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                              padding: '0.6rem',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.25)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.15)'}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.15)', 
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '0.6rem',
                              borderRadius: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.25)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.15)'}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
        }}>
          <div style={{ 
            marginBottom: '2.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {editingId ? `Editing Problem #${editingId}` : 'Create New Challenge'}
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Problem Title
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter problem title..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.background = 'rgba(255,255,255,0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Description
                </label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  style={{ 
                    height: '350px',
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.75rem',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Problem statement, input format, output format, constraints..."
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.background = 'rgba(255,255,255,0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.75rem', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Difficulty Level
                  </label>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '0.75rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Easy" style={{ background: '#1a1a2e', color: '#10b981' }}>🟢 Easy</option>
                    <option value="Medium" style={{ background: '#1a1a2e', color: '#f59e0b' }}>🟡 Medium</option>
                    <option value="Hard" style={{ background: '#1a1a2e', color: '#ef4444' }}>🔴 Hard</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.75rem', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Clock size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Time Limit (seconds)
                  </label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={timeLimit} 
                    onChange={(e) => setTimeLimit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '0.75rem',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.75rem', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Cpu size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Memory Limit (MB)
                  </label>
                  <input 
                    type="number" 
                    value={memoryLimit} 
                    onChange={(e) => setMemoryLimit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '0.75rem',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                padding: '1.25rem',
                borderRadius: '1rem',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <AlertCircle size={16} />
                  <span>Tip</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                  Add clear test cases to help users understand the expected behavior.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem' 
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Test Cases ({testCases.length})</h3>
              <button 
                onClick={addTestCase}
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.25)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.15)'}
              >
                <Plus size={16} /> Add Test Case
              </button>
            </div>

            {testCases.map((tc, index) => (
              <div 
                key={index} 
                style={{ 
                  background: 'rgba(0,0,0,0.25)', 
                  padding: '1.5rem', 
                  borderRadius: '1rem', 
                  marginBottom: '1rem', 
                  border: tc.is_hidden ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: '1.5rem', 
                  right: '1.5rem', 
                  display: 'flex', 
                  gap: '0.5rem' 
                }}>
                  <button 
                    onClick={() => {
                      const newTC = [...testCases]
                      newTC[index].is_hidden = newTC[index].is_hidden === 1 ? 0 : 1
                      setTestCases(newTC)
                    }}
                    style={{ 
                      background: tc.is_hidden ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
                      color: tc.is_hidden ? '#ef4444' : '#10b981',
                      border: `1px solid ${tc.is_hidden ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                      padding: '0.5rem 1rem', 
                      borderRadius: '0.75rem', 
                      cursor: 'pointer', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tc.is_hidden ? <EyeOff size={14} /> : <Eye size={14} />} 
                    {tc.is_hidden ? 'HIDDEN' : 'VISIBLE'}
                  </button>
                  {testCases.length > 1 && (
                    <button 
                      onClick={() => removeTestCase(index)}
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.15)', 
                        border: '1px solid rgba(239, 68, 68, 0.3)', 
                        color: '#ef4444', 
                        cursor: 'pointer', 
                        padding: '0.5rem', 
                        borderRadius: '0.75rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  marginBottom: '1.5rem' 
                }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)'
                  }}>
                    Test Case #{index + 1}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Input Data
                    </label>
                    <textarea 
                      value={tc.input_data} 
                      onChange={(e) => {
                        const newTC = [...testCases]
                        newTC[index].input_data = e.target.value
                        setTestCases(newTC)
                      }}
                      style={{ 
                        height: '120px', 
                        fontFamily: 'monospace',
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '0.75rem',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Expected Output
                    </label>
                    <textarea 
                      value={tc.expected_output} 
                      onChange={(e) => {
                        const newTC = [...testCases]
                        newTC[index].expected_output = e.target.value
                        setTestCases(newTC)
                      }}
                      style={{ 
                        height: '120px', 
                        fontFamily: 'monospace',
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '0.75rem',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 700, 
              marginBottom: '1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <Book size={20} color="var(--primary)" /> Final Explanation
            </h3>
            <textarea 
              value={explanation} 
              onChange={(e) => setExplanation(e.target.value)} 
              placeholder="Provide detailed explanation, solution approach, and complexity analysis..."
              style={{ 
                height: '150px',
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)'
                e.target.style.background = 'rgba(255,255,255,0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                e.target.style.background = 'rgba(255,255,255,0.05)'
              }}
            />
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <button 
              style={{ 
                flex: 1, 
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onClick={handleSave}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Save size={18} /> {editingId ? 'Update Problem' : 'Create Problem'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin