import { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Cpu, 
  Code,
  Book,
  Grid, 
  List,
  Layout
} from 'lucide-react'

function Problems() {
  const [problems, setProblems] = useState([])
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [hoveredProblem, setHoveredProblem] = useState(null)

  useEffect(() => {
    api.get('/problems/').then(res => setProblems(res.data))
  }, [])

  const filteredProblems = (problems || []).filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(search.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter
    return matchesSearch && matchesDifficulty
  })

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': 
        return { 
          bg: 'rgba(16, 185, 129, 0.15)', 
          color: '#10b981', 
          border: 'rgba(16, 185, 129, 0.3)',
          icon: '🟢'
        }
      case 'medium': 
        return { 
          bg: 'rgba(245, 158, 11, 0.15)', 
          color: '#f59e0b', 
          border: 'rgba(245, 158, 11, 0.3)',
          icon: '🟡'
        }
      case 'hard': 
        return { 
          bg: 'rgba(239, 68, 68, 0.15)', 
          color: '#ef4444', 
          border: 'rgba(239, 68, 68, 0.3)',
          icon: '🔴'
        }
      default: 
        return { 
          bg: 'rgba(255,255,255,0.05)', 
          color: 'var(--text-muted)', 
          border: 'rgba(255,255,255,0.1)',
          icon: '⚪'
        }
    }
  }

  const stats = {
    total: Array.isArray(problems) ? problems.length : 0,
    easy: Array.isArray(problems) ? problems.filter(p => p?.difficulty?.toLowerCase() === 'easy').length : 0,
    medium: Array.isArray(problems) ? problems.filter(p => p?.difficulty?.toLowerCase() === 'medium').length : 0,
    hard: Array.isArray(problems) ? problems.filter(p => p?.difficulty?.toLowerCase() === 'hard').length : 0
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
        padding: '2rem',
        borderRadius: '1.5rem',
        border: '1px solid rgba(139, 92, 246, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <Book size={20} color="var(--primary)" />
              </div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Problem Archive</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {stats.total} challenges awaiting your solution
                </p>
              </div>
            </div>
          </div>
          
          {/* View Toggle */}
          <div style={{ 
            display: 'flex',
            background: 'var(--bg-accent)',
            borderRadius: '0.75rem',
            padding: '0.25rem',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: viewMode === 'grid' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: viewMode === 'list' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '1rem',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Code size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stats.total}</span>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            padding: '1rem',
            borderRadius: '1rem',
            border: '1px solid rgba(16, 185, 129, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem' }}>🟢</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Easy</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>{stats.easy}</span>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.05)',
            padding: '1rem',
            borderRadius: '1rem',
            border: '1px solid rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem' }}>🟡</span>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Medium</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>{stats.medium}</span>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            padding: '1rem',
            borderRadius: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem' }}>🔴</span>
              <span style={{ fontSize: '0.75rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Hard</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>{stats.hard}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-muted)',
            opacity: 0.5
          }} />
          <input 
            type="text" 
            placeholder="Search problems by title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              background: 'var(--bg-card)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '0.75rem',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              transition: 'all 0.2s ease',
              outline: 'none'
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
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map(difficulty => {
            const isActive = difficultyFilter === difficulty
            const diffColor = getDifficultyColor(difficulty)
            
            return (
              <button
                key={difficulty}
                onClick={() => setDifficultyFilter(difficulty)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.75rem',
                  border: `1px solid ${isActive ? 'rgba(139, 92, 246, 0.4)' : diffColor.border}`,
                  background: isActive ? 'rgba(139, 92, 246, 0.15)' : diffColor.bg,
                  color: isActive ? 'var(--primary)' : diffColor.color,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(139, 92, 246, 0.1)'
                    e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = diffColor.bg
                    e.target.style.borderColor = diffColor.border
                  }
                }}
              >
                <Filter size={14} />
                <span>{difficulty}</span>
                {difficulty !== 'All' && (
                  <span style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '1rem',
                    fontSize: '0.75rem'
                  }}>
                    {problems.filter(p => p.difficulty === difficulty).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        
        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
          <span>{filteredProblems.length} problems found</span>
        </div>
      </div>

      {/* Problem Cards Grid */}
      {viewMode === 'grid' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredProblems.map(p => {
            const difficultyStyle = getDifficultyColor(p.difficulty)
            return (
              <Link 
                key={p.id} 
                to={`/problems/${p.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={() => setHoveredProblem(p.id)}
                onMouseLeave={() => setHoveredProblem(null)}
              >
                <div style={{ 
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '1.25rem',
                  border: `1px solid ${hoveredProblem === p.id ? 'var(--primary)' : 'rgba(0,0,0,0.05)'}`,
                  padding: '1.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredProblem === p.id ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredProblem === p.id 
                    ? '0 12px 40px rgba(0,0,0,0.1)' 
                    : '0 4px 12px rgba(0,0,0,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Card Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: '1.25rem' 
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: difficultyStyle.bg,
                      color: difficultyStyle.color,
                      border: `1px solid ${difficultyStyle.border}`
                    }}>
                      <span>{difficultyStyle.icon}</span>
                      {p.difficulty}
                    </span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text-muted)',
                      fontFamily: 'monospace',
                      background: 'var(--bg-accent)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '0.5rem'
                    }}>
                      #{p.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 700, 
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                    color: hoveredProblem === p.id ? 'var(--primary)' : 'var(--text-primary)',
                    transition: 'color 0.2s ease'
                  }}>
                    {p.title}
                  </h3>

                  {/* Description Preview */}
                  <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem', 
                    marginBottom: '1.5rem', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: 1.6,
                    flex: 1
                  }}>
                    {p.description}
                  </p>

                  {/* Card Footer */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid rgba(255,255,255,0.05)', 
                    paddingTop: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem'
                      }}>
                        <Clock size={14} />
                        <span style={{ fontFamily: 'monospace' }}>{p.time_limit}s</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem'
                      }}>
                        <Cpu size={14} />
                        <span style={{ fontFamily: 'monospace' }}>{p.memory_limit}MB</span>
                      </div>
                    </div>
                    <div style={{ 
                      color: 'var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      opacity: hoveredProblem === p.id ? 1 : 0.7,
                      transition: 'all 0.2s ease'
                    }}>
                      Solve 
                      <ChevronRight size={16} style={{ 
                        transition: 'transform 0.2s ease',
                        transform: hoveredProblem === p.id ? 'translateX(4px)' : 'translateX(0)'
                      }} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div style={{ 
          background: 'var(--bg-card)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Constraints</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map(p => {
                  const difficultyStyle = getDifficultyColor(p.difficulty)
                  return (
                    <tr 
                      key={p.id}
                      onMouseEnter={() => setHoveredProblem(p.id)}
                      onMouseLeave={() => setHoveredProblem(null)}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background 0.2s ease',
                        background: hoveredProblem === p.id ? 'var(--bg-accent)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ 
                          color: 'var(--text-muted)', 
                          fontFamily: 'monospace',
                          background: 'var(--bg-accent)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.85rem'
                        }}>
                          #{p.id}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <Link to={`/problems/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                            <div>
                              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.title}</span>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {p.description?.substring(0, 80)}...
                              </p>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '2rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: difficultyStyle.bg,
                          color: difficultyStyle.color,
                          border: `1px solid ${difficultyStyle.border}`
                        }}>
                          {difficultyStyle.icon} {p.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
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
                        <Link to={`/problems/${p.id}`} style={{ textDecoration: 'none' }}>
                          <button style={{
                            background: 'rgba(139, 92, 246, 0.15)',
                            color: 'var(--primary)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(139, 92, 246, 0.25)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(139, 92, 246, 0.15)'
                          }}
                          >
                            Solve <ChevronRight size={14} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredProblems.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: 'var(--text-muted)'
        }}>
          <Search size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No problems found</p>
          <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

export default Problems