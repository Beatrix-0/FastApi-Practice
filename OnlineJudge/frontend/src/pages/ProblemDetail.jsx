import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { ChevronLeft, Play, Send, Layout, MessageSquare, History, BookOpen } from 'lucide-react'

function ProblemDetail() {
  const { id, contestId } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('cpp')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    api.get(`/problems/${id}`).then(res => setProblem(res.data))
  }, [id])

  const handleSubmit = async () => {
    if (!code) return alert('Please enter code')
    setLoading(true)
    try {
      await api.post('/submissions/', { 
        problem_id: parseInt(id), 
        contest_id: contestId ? parseInt(contestId) : null,
        code, 
        language 
      })
      navigate(contestId ? `/contests/${contestId}` : '/submissions')
    } catch (e) {
      alert('Error submitting code: ' + (e.response?.data?.detail || e.message))
    } finally {
      setLoading(false)
    }
  }

  if (!problem) return <div className="loader">Loading...</div>

  return (
    <div className="workspace" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', margin: '-1rem' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'var(--bg-card)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/problems" style={{ color: 'var(--text-muted)' }}><ChevronLeft /></Link>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{problem.title}</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: 'var(--bg-accent)', fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <Play size={16} /> Run Code
          </button>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '0.9rem' }} 
            onClick={handleSubmit}
            disabled={loading}
          >
            <Send size={16} /> {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Description / Discussion */}
        <div style={{ flex: 1, borderRight: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--bg-accent)' }}>
            <button 
              onClick={() => setActiveTab('description')}
              style={{ padding: '1rem 1.5rem', background: activeTab === 'description' ? 'var(--bg-card)' : 'transparent', border: 'none', color: activeTab === 'description' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('discussion')}
              style={{ padding: '1rem 1.5rem', background: activeTab === 'discussion' ? 'var(--bg-card)' : 'transparent', border: 'none', color: activeTab === 'discussion' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
            >
              Discussion
            </button>
            <button 
              onClick={() => setActiveTab('solutions')}
              style={{ padding: '1rem 1.5rem', background: activeTab === 'solutions' ? 'var(--bg-card)' : 'transparent', border: 'none', color: activeTab === 'solutions' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
            >
              Submissions
            </button>
          </div>
          <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, background: 'var(--bg-card)' }}>
            <div className="problem-meta" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Difficulty</span>
                <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`} style={{ width: 'fit-content' }}>{problem.difficulty}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Time Limit</span>
                <span style={{ fontWeight: 600 }}>{problem.time_limit}s</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Memory Limit</span>
                <span style={{ fontWeight: 600 }}>{problem.memory_limit}MB</span>
              </div>
            </div>
            <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {problem.description}
            </div>
            
            {problem.test_cases && problem.test_cases.filter(tc => !tc.is_hidden).length > 0 && (
              <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layout size={20} color="var(--primary)" /> Sample Test Cases
                </h3>
                {problem.test_cases.filter(tc => !tc.is_hidden).map((tc, idx) => (
                  <div key={idx} style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Input</div>
                        <pre style={{ background: 'var(--bg-accent)', padding: '1rem', borderRadius: '0.75rem', fontFamily: 'monospace', border: '1px solid rgba(0,0,0,0.05)' }}>
                          {tc.input_data}
                        </pre>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Output</div>
                        <pre style={{ background: 'rgba(70, 132, 50, 0.1)', padding: '1rem', borderRadius: '0.75rem', fontFamily: 'monospace', border: '1px solid rgba(70, 132, 50, 0.2)', color: 'var(--primary)' }}>
                          {tc.expected_output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
          <div style={{ padding: '0.5rem 1rem', background: '#252526', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'transparent', color: '#d4d4d4', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              <option value="python">Python 3</option>
              <option value="cpp">C++ (G++)</option>
            </select>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            placeholder="// Write your code here..."
            style={{ 
              flex: 1, 
              width: '100%', 
              background: 'transparent', 
              color: '#d4d4d4', 
              padding: '1.5rem', 
              fontSize: '14px', 
              fontFamily: '"Fira Code", monospace', 
              border: 'none', 
              outline: 'none', 
              resize: 'none',
              lineHeight: '1.5'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail
