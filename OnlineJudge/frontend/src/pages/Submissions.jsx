import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Filter, 
  FileCode, 
  Zap, 
  Calendar,
  ChevronRight,
  Code,
  Activity,
  BarChart
} from 'lucide-react'

function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'accepted', 'wrong', 'pending'
  const [hoveredRow, setHoveredRow] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/submissions/')
      setSubmissions(res.data)
      setLastUpdated(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
    const interval = setInterval(fetchSubmissions, 3000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircle size={18} color="#10b981" />
      case 'Wrong Answer': return <XCircle size={18} color="#ef4444" />
      case 'Pending': 
      case 'Running': return <RefreshCw size={18} color="#8b5cf6" className="animate-spin" />
      default: return <AlertCircle size={18} color="#f59e0b" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' }
      case 'Wrong Answer': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' }
      case 'Pending': 
      case 'Running': return { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)' }
      default: return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' }
    }
  }

  const getLanguageIcon = (language) => {
    const lang = language?.toLowerCase() || ''
    if (lang.includes('python')) return '🐍'
    if (lang.includes('javascript') || lang.includes('js')) return '💛'
    if (lang.includes('java')) return '☕'
    if (lang.includes('cpp') || lang.includes('c++')) return '⚡'
    return '📝'
  }

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true
    if (filter === 'accepted') return s.status === 'Accepted'
    if (filter === 'wrong') return s.status === 'Wrong Answer'
    if (filter === 'pending') return s.status === 'Pending' || s.status === 'Running'
    return true
  })

  const stats = {
    total: Array.isArray(submissions) ? submissions.length : 0,
    accepted: Array.isArray(submissions) ? submissions.filter(s => s?.status === 'Accepted').length : 0,
    wrong: Array.isArray(submissions) ? submissions.filter(s => s?.status === 'Wrong Answer').length : 0,
    pending: Array.isArray(submissions) ? submissions.filter(s => s?.status === 'Pending' || s?.status === 'Running').length : 0,
    accuracy: (Array.isArray(submissions) && submissions.length > 0)
      ? ((submissions.filter(s => s?.status === 'Accepted').length / submissions.length) * 100).toFixed(1)
      : '0'
  }

  if (loading) {
    return (
      <div className="animate-fade" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '2rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid rgba(139, 92, 246, 0.2)',
          borderTop: '3px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1.5rem'
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '2.5rem',
        background: 'var(--bg-accent)',
        padding: '2rem',
        borderRadius: '1.5rem',
        border: '1px solid rgba(0,0,0,0.05)'
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
                <Activity size={20} color="var(--primary)" />
              </div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Submissions</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Real-time updates every 3 seconds • Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={fetchSubmissions}
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--primary)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(139, 92, 246, 0.25)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(139, 92, 246, 0.15)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <RefreshCw size={18} /> Refresh Now
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '1.25rem',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <BarChart size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</span>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            padding: '1.25rem',
            borderRadius: '1rem',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={16} color="#10b981" />
              <span style={{ fontSize: '0.8rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Accepted</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{stats.accepted}</span>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            padding: '1.25rem',
            borderRadius: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <XCircle size={16} color="#ef4444" />
              <span style={{ fontSize: '0.8rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Wrong</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{stats.wrong}</span>
          </div>
          <div style={{
            background: 'rgba(139, 92, 246, 0.05)',
            padding: '1.25rem',
            borderRadius: '1rem',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Activity size={16} color="#8b5cf6" />
              <span style={{ fontSize: '0.8rem', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Pending</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{stats.pending}</span>
          </div>
        </div>

        {/* Accuracy Bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accuracy Rate</span>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>{stats.accuracy}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${stats.accuracy}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #059669)',
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'All', icon: <FileCode size={16} /> },
          { key: 'accepted', label: 'Accepted', icon: <CheckCircle size={16} /> },
          { key: 'wrong', label: 'Wrong', icon: <XCircle size={16} /> },
          { key: 'pending', label: 'Pending', icon: <RefreshCw size={16} /> }
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.75rem',
              border: `1px solid ${filter === f.key ? 'var(--primary)' : 'rgba(0,0,0,0.1)'}`,
              background: filter === f.key ? 'rgba(70, 132, 50, 0.15)' : 'var(--bg-card)',
              color: filter === f.key ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (filter !== f.key) {
                e.target.style.background = 'rgba(255,255,255,0.06)'
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== f.key) {
                e.target.style.background = 'rgba(255,255,255,0.03)'
              }
            }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Filter size={16} />
          <span>{filteredSubmissions.length} results</span>
        </div>
      </div>

      {/* Submissions Table */}
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
              <tr style={{ 
                borderBottom: '2px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <th style={{ 
                  padding: '1.25rem 1.5rem', 
                  textAlign: 'left',
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  width: '100px'
                }}>
                  ID
                </th>
                <th style={{ 
                  padding: '1.25rem 1.5rem', 
                  textAlign: 'left',
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Status
                </th>
                <th style={{ 
                  padding: '1.25rem 1.5rem', 
                  textAlign: 'left',
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Problem
                </th>
                <th style={{ 
                  padding: '1.25rem 1.5rem', 
                  textAlign: 'center',
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Language
                </th>
                <th style={{ 
                  padding: '1.25rem 1.5rem', 
                  textAlign: 'center',
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Runtime
                </th>
                <th style={{ 
                  padding: '1.25rem 1.5rem', 
                  textAlign: 'right',
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map(s => {
                const statusStyle = getStatusColor(s.status)
                return (
                  <tr 
                    key={s.id}
                    onMouseEnter={() => setHoveredRow(s.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      transition: 'all 0.2s ease',
                      background: hoveredRow === s.id ? 'var(--bg-accent)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <Link 
                        to={`/submissions/${s.id}`} 
                        style={{ 
                          color: 'var(--primary)', 
                          fontWeight: 600, 
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.9rem',
                          fontFamily: 'monospace'
                        }}
                      >
                        <span style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem'
                        }}>
                          #{s.id}
                        </span>
                        <ChevronRight size={14} style={{ transition: 'opacity 0.2s', opacity: hoveredRow === s.id ? 1 : 0 }} />
                      </Link>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ 
                        display: 'inline-flex',
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.border}`,
                        color: statusStyle.color,
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}>
                        {getStatusIcon(s.status)}
                        {s.status}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <Link 
                        to={`/problems/${s.problem_id}`} 
                        style={{ 
                          color: 'inherit', 
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '0.5rem',
                          background: 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Code size={14} color="var(--text-muted)" />
                        </div>
                        <span>Problem #{s.problem_id}</span>
                      </Link>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      <span style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        padding: '0.35rem 0.75rem', 
                        borderRadius: '0.5rem', 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <span>{getLanguageIcon(s.language)}</span>
                        {s.language}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                      }}>
                        <Clock size={14} />
                        <span style={{ fontFamily: 'monospace' }}>
                          {s.execution_time ? `${s.execution_time.toFixed(3)}s` : '-'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem'
                      }}>
                        <Calendar size={14} />
                        <span>{new Date(s.created_at).toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredSubmissions.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <FileCode size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No submissions found</p>
                      <p style={{ fontSize: '0.9rem' }}>
                        {filter !== 'all' ? 'Try changing the filter or ' : ''}Start solving problems to see your submissions here!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Submissions