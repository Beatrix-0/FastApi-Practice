import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await api.post('/auth/signup', { username, email, password })
        alert('Signup successful! Please login.')
        setIsSignup(false)
      } else {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        const res = await api.post('/auth/login', formData)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('userId', res.data.user_id)
        localStorage.setItem('username', res.data.username)
        onLogin()
        navigate('/')
      }
    } catch (e) {
      alert('Error: ' + (e.response?.data?.detail || e.message))
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>{isSignup ? 'Create Account' : 'Login'}</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', background: '#0f172a', color: 'white', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        {isSignup && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', background: '#0f172a', color: 'white', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        )}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', background: '#0f172a', color: 'white', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} onClick={handleAuth}>
          {isSignup ? 'Signup' : 'Login'}
        </button>
        <button 
          className="btn" 
          style={{ width: '100%', background: 'transparent', color: 'var(--primary)' }} 
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
        </button>
      </div>
    </div>
  )
}

export default Login
