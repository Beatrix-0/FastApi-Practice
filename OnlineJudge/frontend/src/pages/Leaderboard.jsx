import { useState, useEffect } from 'react'
import api from '../services/api'
import { Trophy, Medal, User, Award, Sparkles, TrendingUp, Target, Zap, ChevronUp, BarChart } from 'lucide-react'

function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredRow, setHoveredRow] = useState(null)

  useEffect(() => {
    api.get('/leaderboard/')
      .then(res => setUsers(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const getRankIcon = (index) => {
    switch (index) {
      case 0: 
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '40px',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <Trophy size={28} color="#f59e0b" style={{ 
              filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))',
              position: 'relative',
              zIndex: 1
            }} />
          </div>
        )
      case 1: 
        return <Medal size={24} color="#94a3b8" style={{ filter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.4))' }} />
      case 2: 
        return <Medal size={24} color="#b45309" style={{ filter: 'drop-shadow(0 0 8px rgba(180, 83, 9, 0.4))' }} />
      default: 
        return (
          <span style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: 'var(--text-muted)',
            background: 'var(--bg-accent)',
            padding: '0.35rem 0.65rem',
            borderRadius: '0.5rem',
            minWidth: '35px',
            display: 'inline-block'
          }}>
            {index + 1}
          </span>
        )
    }
  }

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
    if (accuracy >= 50) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' }
    if (accuracy > 0) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
    return { color: 'var(--text-muted)', bg: 'var(--bg-accent)' }
  }

  const getTopPerformers = () => {
    if (!Array.isArray(users) || users.length === 0) return null
    const top3 = users.slice(0, 3)
    return top3
  }

  const topPerformers = getTopPerformers()

  if (loading) {
    return (
      <div className="animate-fade" style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid rgba(70, 132, 50, 0.2)',
          borderTop: '3px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1.5rem'
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        position: 'relative'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--bg-accent)',
            padding: '0.5rem 1.5rem',
            borderRadius: '2rem',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={18} color="#f59e0b" />
            <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>LIVE RANKINGS</span>
          </div>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 800, 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #f59e0b, var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2
          }}>
            Global Leaderboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Top coders ranked by unique problems solved. Push your limits and climb the ranks!
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topPerformers && topPerformers.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '3rem',
          padding: '0 1rem'
        }}>
          {/* 2nd Place */}
          {topPerformers[1] && (
            <div style={{ 
              textAlign: 'center',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(8px)',
              borderRadius: '1.5rem',
              padding: '2rem 1.5rem',
              border: '1px solid rgba(0,0,0,0.05)',
              width: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Medal size={40} color="#94a3b8" style={{ 
                filter: 'drop-shadow(0 4px 8px rgba(148, 163, 184, 0.4))',
                marginBottom: '0.75rem'
              }} />
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #94a3b8, #64748b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                boxShadow: '0 4px 12px rgba(148, 163, 184, 0.3)'
              }}>
                <User size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{topPerformers[1].username}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                <Trophy size={18} />
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{topPerformers[1].solve_count}</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topPerformers[0] && (
            <div style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(70, 132, 50, 0.1), rgba(154, 216, 114, 0.1))',
              backdropFilter: 'blur(12px)',
              borderRadius: '1.5rem',
              padding: '2.5rem 2rem',
              border: '2px solid var(--primary)',
              width: '220px',
              boxShadow: '0 12px 40px rgba(70, 132, 50, 0.15)',
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(0)'}
            >
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                <Trophy size={48} color="#f59e0b" style={{ 
                  filter: 'drop-shadow(0 6px 12px rgba(245, 158, 11, 0.6))',
                  position: 'relative',
                  zIndex: 1
                }} />
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                boxShadow: '0 6px 20px rgba(70, 132, 50, 0.3)',
                border: '3px solid rgba(255,255,255,0.2)'
              }}>
                <User size={28} color="white" />
              </div>
              <div style={{
                background: 'var(--primary)',
                padding: '0.35rem 1rem',
                borderRadius: '2rem',
                display: 'inline-block',
                marginBottom: '0.75rem'
              }}>
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>#1 Champion</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{topPerformers[0].username}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <Trophy size={20} />
                <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>{topPerformers[0].solve_count}</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topPerformers[2] && (
            <div style={{ 
              textAlign: 'center',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(8px)',
              borderRadius: '1.5rem',
              padding: '2rem 1.5rem',
              border: '1px solid rgba(0,0,0,0.05)',
              width: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Medal size={40} color="#b45309" style={{ 
                filter: 'drop-shadow(0 4px 8px rgba(180, 83, 9, 0.4))',
                marginBottom: '0.75rem'
              }} />
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #b45309, #92400e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)'
              }}>
                <User size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{topPerformers[2].username}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#b45309' }}>
                <Trophy size={18} />
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{topPerformers[2].solve_count}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Bar */}
      {users.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(8px)',
          borderRadius: '1rem',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <Target size={16} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coders</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{users.length}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <Zap size={16} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Solved</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
              {users.reduce((sum, u) => sum + (u.solve_count || 0), 0)}
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <TrendingUp size={16} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Accuracy</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
              {users.length > 0 
                ? (users.reduce((sum, u) => {
                    const acc = u.total_submissions > 0 ? (u.solve_count / u.total_submissions) * 100 : 0
                    return sum + acc
                  }, 0) / users.length).toFixed(1)
                : '0'}%
            </span>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div style={{ 
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                borderBottom: '2px solid rgba(0,0,0,0.05)',
                background: 'rgba(0,0,0,0.02)'
              }}>
                <th style={{ 
                  padding: '1.25rem 1.5rem', 
                  textAlign: 'center', 
                  width: '100px',
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Rank
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
                  Coder
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
                  Solved
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
                  Submissions
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
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => {
                const accuracy = u.total_submissions > 0 
                  ? ((u.solve_count / u.total_submissions) * 100).toFixed(1) 
                  : '0'
                const accuracyColor = getAccuracyColor(parseFloat(accuracy))
                
                return (
                  <tr 
                    key={index}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ 
                      borderBottom: '1px solid rgba(0,0,0,0.03)',
                      transition: 'all 0.3s ease',
                      background: hoveredRow === index 
                        ? 'var(--bg-accent)' 
                        : index < 3 
                          ? 'rgba(70, 132, 50, 0.05)' 
                          : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: index < 3 
                            ? `linear-gradient(135deg, ${index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : '#b45309'}, ${index === 0 ? '#d97706' : index === 1 ? '#64748b' : '#92400e'})`
                            : 'var(--bg-accent)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: index < 3 ? '2px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.05)',
                          boxShadow: index < 3 ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}>
                          <User size={18} color={index < 3 ? 'white' : 'var(--text-muted)'} />
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{u.username}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        fontWeight: 700, 
                        color: index === 0 ? '#f59e0b' : 'var(--primary)',
                        fontSize: '1.1rem'
                      }}>
                        <Award size={16} /> {u.solve_count}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {u.total_submissions}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: accuracyColor.color,
                        background: accuracyColor.bg
                      }}>
                        {parseFloat(accuracy) > 80 && (
                          <ChevronUp size={14} />
                        )}
                        {accuracy}%
                      </div>
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <Trophy size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No rankings yet</p>
                      <p style={{ fontSize: '0.9rem' }}>Be the first to solve a problem and claim your spot!</p>
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

export default Leaderboard