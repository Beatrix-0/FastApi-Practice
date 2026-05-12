import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { Home, Code, History, Trophy, User, LogOut, Settings, Calendar, X } from 'lucide-react'
import Problems from './pages/Problems'
import Submissions from './pages/Submissions'
import SubmissionDetail from './pages/SubmissionDetail'
import ProblemDetail from './pages/ProblemDetail'
import Leaderboard from './pages/Leaderboard'
import Contests from './pages/Contests'
import ContestDetail from './pages/ContestDetail'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import AdminContest from './pages/AdminContest'
import api from './services/api'
import { useState, useEffect } from 'react'

function HomeDashboard() {
  const [stats, setStats] = useState({ solve_count: 0, rank: 0, total_users: 0, contests: 0 })

  useEffect(() => {
    api.get('/users/me/stats')
      .then(res => setStats(res.data))
      .catch(e => console.error(e))
  }, [])

  const rankPercentile = stats.total_users > 0 ? ((stats.total_users - stats.rank + 1) / stats.total_users * 100).toFixed(0) : 0

  return (
    <div className="animate-fade">
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--bg-accent) 100%)', padding: '3rem', borderRadius: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(70, 132, 50, 0.2)' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>Master Your Coding Skills</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', marginBottom: '2rem', color: 'rgba(255,255,255,0.9)' }}>
            Practice with thousands of problems, participate in real-time contests, and climb the leaderboard.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/problems" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>Explore Problems</Link>
            <Link to="/contests" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>Join Contest</Link>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '-50px', bottom: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solved</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.solve_count}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unique problems</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Rank</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>#{stats.rank || '-'}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Top {100 - rankPercentile}% of coders</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--warning)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contests</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.contests}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Participated</p>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState({ total_problems: 0, total_submissions: 0, total_users: 0, recent_activity: [] })

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(e => console.error(e))
  }, [])

  return (
    <div className="animate-fade">
      <div style={{ background: 'linear-gradient(135deg, var(--warning) 0%, var(--bg-dark) 100%)', padding: '3rem', borderRadius: '2rem', marginBottom: '2rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(255, 160, 46, 0.1)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Admin Center</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
          Monitor system health, manage problem statements, and review community submissions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Problems</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.total_problems}</div>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Submissions</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.total_submissions}</div>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Users</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.total_users}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Activity</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {stats.recent_activity.map((act, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-accent)', borderRadius: '0.75rem', opacity: 0.8 }}>
              <span style={{ fontWeight: 600 }}>{act.message}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(act.created_at).toLocaleTimeString()}</span>
            </div>
          ))}
          {stats.recent_activity.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recent activity.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setIsLoggedIn(false)
    navigate('/')
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<Auth onLogin={() => setIsLoggedIn(true)} />} />
      </Routes>
    )
  }

  const role = localStorage.getItem('role')

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: role === 'admin' ? 'row' : 'column',
      minHeight: '100vh'
    }}>
      <header className={role === 'admin' ? 'admin-sidebar' : 'top-nav'} style={role === 'admin' ? {
        width: '260px',
        height: '100vh',
        background: 'var(--bg-accent)',
        borderRight: '1px solid rgba(0,0,0,0.05)',
        padding: '2rem 1.5rem',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      } : {}}>
        <div style={{ 
          display: 'flex', 
          flexDirection: role === 'admin' ? 'column' : 'row',
          alignItems: role === 'admin' ? 'flex-start' : 'center', 
          gap: role === 'admin' ? '2rem' : '2.5rem', 
          width: '100%', 
          justifyContent: 'space-between' 
        }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: role === 'admin' ? '1rem' : 0 }}>
            SEUOJ
          </Link>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ 
              display: 'none', 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--primary)', 
              cursor: 'pointer' 
            }}
          >
            {isMenuOpen ? <X size={24} /> : <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></div>
              <div style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></div>
              <div style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></div>
            </div>}
          </button>

          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`} style={{ 
            display: 'flex', 
            flexDirection: role === 'admin' ? 'column' : 'row',
            gap: '0.5rem',
            width: role === 'admin' ? '100%' : 'auto'
          }}>
            <Link to="/" className="btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', background: 'transparent', justifyContent: 'flex-start' }}>
              <Home size={18} /> Home
            </Link>
            <Link to="/problems" className="btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', background: 'transparent', justifyContent: 'flex-start' }}>
              <Code size={18} /> Problems
            </Link>
            <Link to="/contests" className="btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', background: 'transparent', justifyContent: 'flex-start' }}>
              <Calendar size={18} /> Contests
            </Link>
            <Link to="/submissions" className="btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', background: 'transparent', justifyContent: 'flex-start' }}>
              <History size={18} /> Submissions
            </Link>
            <Link to="/leaderboard" className="btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', background: 'transparent', justifyContent: 'flex-start' }}>
              <Trophy size={18} /> Leaderboard
            </Link>
            {role === 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginLeft: '1rem', marginBottom: '0.5rem' }}>Admin Tools</span>
                <Link to="/admin" className="btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', background: 'transparent', justifyContent: 'flex-start' }}>
                  <Settings size={18} /> Update Problem
                </Link>
                <Link to="/admin/contests" className="btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', background: 'transparent', justifyContent: 'flex-start' }}>
                  <Trophy size={18} /> Update Contest
                </Link>
              </div>
            )}
            
            <div className="mobile-user-actions" style={{ display: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <User size={18} /> <span>{role === 'admin' ? 'Admin' : 'User'}</span>
                  <button onClick={handleLogout} className="btn" style={{ color: '#ef4444', marginLeft: 'auto' }}><LogOut size={18} /> Logout</button>
               </div>
            </div>
          </nav>

          <div className="desktop-user-actions" style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            marginTop: role === 'admin' ? 'auto' : 0,
            width: role === 'admin' ? '100%' : 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              background: 'var(--bg-card)', 
              padding: '0.4rem 1.2rem 0.4rem 0.4rem', 
              borderRadius: '2.5rem', 
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              width: role === 'admin' ? '100%' : 'auto'
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'var(--primary)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={16} color="white" />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, flex: 1 }}>{role === 'admin' ? 'Admin' : 'User'}</span>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={role === 'admin' ? <AdminDashboard /> : <HomeDashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:id" element={<ContestDetail />} />
          <Route path="/contests/:contestId/problems/:id" element={<ProblemDetail />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/submissions/:id" element={<SubmissionDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/contests" element={<AdminContest />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
