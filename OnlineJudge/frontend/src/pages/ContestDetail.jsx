import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { Trophy, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'

function ContestDetail() {
  const { id } = useParams()
  const [contest, setContest] = useState(null)
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [userSubmissions, setUserSubmissions] = useState([])
  const [activeTab, setActiveTab] = useState('problems')
  const [timeLeft, setTimeLeft] = useState('')

  const role = localStorage.getItem('role')

  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/contests/${id}`)
      .then(res => { setContest(res.data); setLoading(false) })
      .catch(err => { 
        console.error(err); 
        setError(err.response?.data?.detail || err.message);
        setLoading(false);
      })
  }, [id])

  useEffect(() => {
    if (activeTab === 'standings') {
      api.get(`/contests/${id}/standings`).then(res => setStandings(res.data)).catch(() => {})
    } else if (activeTab === 'submissions') {
      api.get('/submissions/').then(res => {
        setUserSubmissions(res.data.filter(s => s.contest_id === parseInt(id)))
      })
    }
  }, [id, activeTab])

  useEffect(() => {
    if (!contest) return
    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(contest.end_time)
      const diff = end - now
      if (diff <= 0) { setTimeLeft('Ended'); clearInterval(timer) }
      else {
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setTimeLeft(`${h}h ${m}m ${s}s`)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [contest])

  if (loading) return <div className="loader">Loading...</div>
  if (error) return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚠️</div>
      <h2 style={{ marginBottom: '1rem', fontWeight: 800 }}>Oops! Something went wrong</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>{error}</p>
      <Link to="/contests" className="btn btn-primary">Back to Contests</Link>
    </div>
  )
  if (!contest) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Contest not found.</div>

  const isStarted = new Date() >= new Date(contest.start_time)
  const isAdmin = role === 'admin'

  return (
    <div className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '2.5rem',
        borderRadius: '2rem',
        marginBottom: '2rem',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Trophy color="var(--primary)" size={24} />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{contest.title}</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>{contest.description}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.05)', 
            padding: '1.5rem 2rem', 
            borderRadius: '1.5rem', 
            border: '1px solid rgba(239, 68, 68, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.8rem', fontFamily: '"Fira Code", monospace', marginBottom: '0.25rem' }}>
              {timeLeft}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Remaining</span>
          </div>
          
          {!isAdmin && contest.participant_ids && !contest.participant_ids.includes(parseInt(localStorage.getItem('userId'))) && (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem' }}
              onClick={async () => {
                try {
                  await api.post(`/contests/${id}/join`)
                  const res = await api.get(`/contests/${id}`)
                  setContest(res.data)
                  alert('Successfully joined the contest!')
                } catch (e) {
                  alert('Failed to join: ' + (e.response?.data?.detail || e.message))
                }
              }}
            >
              Register for Contest
            </button>
          )}
          
          {!isAdmin && contest.participant_ids && contest.participant_ids.includes(parseInt(localStorage.getItem('userId'))) && (
            <div style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} /> Registered Participant
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-accent)', padding: '0.4rem', borderRadius: '1rem', width: 'fit-content', opacity: 0.9 }}>
        {[['problems', 'Problems'], ['standings', 'Leaderboard'], ['submissions', 'Submission Status']].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-main)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeTab === tab ? '0 4px 12px rgba(70, 132, 50, 0.3)' : 'none'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Problems Tab */}
      {activeTab === 'problems' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {(!contest.problems || !Array.isArray(contest.problems) || contest.problems.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '2rem', color: 'var(--text-muted)' }}>
              No problems assigned to this contest yet.
            </div>
          ) : (
            contest.problems.map((p, idx) => (
              <Link key={p.id} to={`/contests/${id}/problems/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1.75rem 2.5rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{
                      width: '50px', height: '50px', background: 'var(--primary)',
                      borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem', fontWeight: 900, color: 'white',
                      boxShadow: '0 4px 10px rgba(70, 132, 50, 0.2)'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{p.title}</h4>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span className={`difficulty-tag ${p.difficulty?.toLowerCase()}`}>{p.difficulty}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {p.time_limit}s
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={24} color="var(--primary)" style={{ opacity: 0.5 }} />
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Standings Tab */}
      {activeTab === 'standings' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-accent)' }}>
                  <th style={{ padding: '1.25rem', textAlign: 'center', width: '60px', color: 'var(--text-main)', fontWeight: 800 }}>#</th>
                  <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-main)', fontWeight: 800, minWidth: '200px' }}>Competitor</th>
                  {contest.problems?.map((p, i) => (
                    <th key={p.id} style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-main)', fontWeight: 800 }}>
                      {String.fromCharCode(65 + i)}
                    </th>
                  ))}
                  <th style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-main)', fontWeight: 800 }}>Score</th>
                  <th style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-main)', fontWeight: 800 }}>Solved</th>
                  <th style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-main)', fontWeight: 800 }}>Penalty</th>
                </tr>
              </thead>
              <tbody>
                {standings.length === 0 ? (
                  <tr>
                    <td colSpan={5 + (contest.problems?.length || 0)} style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Trophy size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <p>No participants yet. Join and be the first!</p>
                    </td>
                  </tr>
                ) : standings.map((s, idx) => (
                  <tr key={s.user_id} style={{ 
                    borderTop: '1px solid rgba(0,0,0,0.05)', 
                    transition: 'background 0.2s',
                    background: s.user_id === parseInt(localStorage.getItem('userId')) ? 'rgba(70, 132, 50, 0.05)' : 'transparent'
                  }}>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <span style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 900,
                        color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--text-main)'
                      }}>
                        {idx + 1}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--bg-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                          {s.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{s.username}</div>
                          {idx === 0 && s.solved > 0 && <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>🔥 Leader</div>}
                        </div>
                      </div>
                    </td>
                    {contest.problems?.map(p => {
                      const res = s.problem_results[p.id]
                      return (
                        <td key={p.id} style={{ padding: '1.25rem', textAlign: 'center' }}>
                          {res ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <span style={{ 
                                color: res.solved ? 'var(--primary)' : '#ef4444', 
                                fontWeight: 800,
                                fontSize: '1.1rem'
                              }}>
                                {res.solved ? `+${res.attempts || ''}` : res.attempts > 0 ? `-${res.attempts}` : ''}
                              </span>
                              {res.solved && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.penalty}m</span>}
                            </div>
                          ) : '-'}
                        </td>
                      )
                    })}
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        {s.solved * 100}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(70, 132, 50, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '1.1rem' }}>
                        {s.solved}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>{s.penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'submissions' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-accent)' }}>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-main)', fontWeight: 800 }}>Time</th>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-main)', fontWeight: 800 }}>Problem</th>
                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-main)', fontWeight: 800 }}>Status</th>
                <th style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-main)', fontWeight: 800 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {userSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No submissions found for this contest.
                  </td>
                </tr>
              ) : userSubmissions.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(s.created_at).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '1.25rem', fontWeight: 600 }}>Problem #{s.problem_id}</td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem',
                      background: s.status === 'Accepted' ? 'rgba(16, 185, 129, 0.1)' : 
                                  s.status === 'Wrong Answer' ? 'rgba(239, 68, 68, 0.1)' :
                                  s.status === 'Pending' || s.status === 'Running' ? 'rgba(139, 92, 246, 0.1)' :
                                  'rgba(245, 158, 11, 0.1)',
                      color: s.status === 'Accepted' ? '#10b981' : 
                             s.status === 'Wrong Answer' ? '#ef4444' :
                             s.status === 'Pending' || s.status === 'Running' ? '#8b5cf6' :
                             '#f59e0b'
                    }}>
                      {s.status === 'Accepted' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'center', fontWeight: 800 }}>
                    {s.status === 'Accepted' ? '100' : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ContestDetail
