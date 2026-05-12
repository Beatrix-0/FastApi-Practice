import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Trash, Calendar, Clock, Save, List, Trophy } from 'lucide-react'

function AdminContest() {
  const [contests, setContests] = useState([])
  const [problems, setProblems] = useState([])
  const [view, setView] = useState('list')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedProblems, setSelectedProblems] = useState([])

  const fetchContests = () => api.get('/contests/').then(res => setContests(res.data))

  useEffect(() => {
    fetchContests()
    api.get('/problems/').then(res => setProblems(res.data)).catch(e => console.error(e))
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      const payload = {
        title, description,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        problem_ids: selectedProblems
      }

      if (editingId) {
        await api.put(`/contests/${editingId}`, payload)
        alert('Contest updated successfully!')
      } else {
        await api.post('/contests/', payload)
        alert('Contest created successfully!')
      }
      
      resetForm()
      fetchContests()
    } catch (e) {
      alert('Error: ' + (e.response?.data?.detail || e.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return
    try {
      await api.delete(`/contests/${id}`)
      fetchContests()
    } catch (e) {
      alert('Error: ' + (e.response?.data?.detail || e.message))
    }
  }

  const startEdit = (c) => {
    setEditingId(c.id)
    setTitle(c.title)
    setDescription(c.description)
    // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
    setStartTime(new Date(c.start_time).toISOString().slice(0, 16))
    setEndTime(new Date(c.end_time).toISOString().slice(0, 16))
    setSelectedProblems(c.problems?.map(p => p.id) || [])
    setView('form')
  }

  const resetForm = () => {
    setView('list')
    setEditingId(null)
    setTitle(''); setDescription(''); setStartTime(''); setEndTime(''); setSelectedProblems([])
  }

  const toggleProblem = (id) => {
    setSelectedProblems(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Contests</h1>
          <p style={{ color: 'var(--text-muted)' }}>Schedule and organize live competitions</p>
        </div>
        <button className="btn btn-primary" onClick={() => view === 'list' ? setView('form') : resetForm()}>
          {view === 'list' ? <><Plus size={18} /> Create Contest</> : <><List size={18} /> Back to List</>}
        </button>
      </div>

      {view === 'list' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Time Window</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Problems</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.length === 0 && (
                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No contests yet. Create one!</td></tr>
              )}
              {contests.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {c.id}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.9rem' }}>{new Date(c.start_time).toLocaleString()}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>to {new Date(c.end_time).toLocaleString()}</div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ background: 'var(--bg-accent)', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      {c.problems?.length || 0}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => startEdit(c)} className="btn" style={{ padding: '0.4rem', background: 'rgba(70, 132, 50, 0.1)', color: 'var(--primary)' }}>
                        <Save size={16} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="btn" style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Contest Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Weekly Contest #1"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell participants what this contest is about..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', height: '100px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Start Time</label>
                  <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>End Time</label>
                  <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Select Problems ({selectedProblems.length} selected)</label>
              <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '0.75rem', height: '300px', overflowY: 'auto', padding: '0.5rem' }}>
                {problems.map(p => (
                  <div key={p.id} onClick={() => toggleProblem(p.id)}
                    style={{
                      padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', borderRadius: '0.5rem', marginBottom: '0.25rem',
                      background: selectedProblems.includes(p.id) ? 'var(--bg-accent)' : 'transparent',
                      fontWeight: selectedProblems.includes(p.id) ? 600 : 400
                    }}>
                    <span>{p.title}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{p.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button className="btn" onClick={resetForm} style={{ background: 'rgba(0,0,0,0.05)' }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : (editingId ? 'Update Contest' : 'Save Contest')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContest
