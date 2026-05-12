import { useState } from 'react'
import api from '../services/api'
import { User, Lock, Mail, ChevronRight } from 'lucide-react'

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('user')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        const res = await api.post('/auth/login', formData)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('role', res.data.role)
        onLogin()
      } else {
        await api.post('/auth/signup', { username, email, password, role })
        alert('Signup successful! Please login.')
        setIsLogin(true)
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-dark)',
      margin: '-3rem'
    }}>
      <div className="card animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', background: 'var(--bg-card)', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            SEUOJ
          </div>
          <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Welcome back! Please login.' : 'Create an account to start coding.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-accent)', padding: '0.4rem', borderRadius: '0.8rem', opacity: 0.8 }}>
            <button 
              type="button"
              onClick={() => setRole('user')}
              style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: role === 'user' ? 'var(--primary)' : 'transparent', color: role === 'user' ? 'white' : 'var(--text-main)', fontWeight: 600, transition: '0.2s' }}
            >
              User
            </button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: role === 'admin' ? 'var(--primary)' : 'transparent', color: role === 'admin' ? 'white' : 'var(--text-main)', fontWeight: 600, transition: '0.2s' }}
            >
              Admin
            </button>
          </div>

          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Username" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ paddingLeft: '3rem', width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} 
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '3rem', width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} 
              />
            </div>
          )}

          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '3rem', width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} 
            />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')} <ChevronRight size={18} style={{ marginLeft: '5px' }} />
          </button>

          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth
