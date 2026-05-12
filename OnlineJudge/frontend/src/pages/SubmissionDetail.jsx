import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { ChevronLeft, Code, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

function SubmissionDetail() {
  const { id } = useParams()
  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    api.get(`/submissions/${id}`).then(res => setSubmission(res.data))
  }, [id])

  if (!submission) return <div className="loader">Loading...</div>

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return '#10b981'
      case 'Wrong Answer': return '#ef4444'
      case 'Pending': 
      case 'Running': return '#8b5cf6'
      default: return '#f59e0b'
    }
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/submissions" style={{ color: 'var(--text-muted)' }}><ChevronLeft /></Link>
        <h1>Submission #{id}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Code size={16} /> Source Code
            </div>
            <span style={{ fontSize: '0.8rem', background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{submission.language}</span>
          </div>
          <pre style={{ 
            margin: 0, 
            padding: '2rem', 
            background: '#1e1e1e', 
            color: '#d4d4d4', 
            fontSize: '14px', 
            fontFamily: '"Fira Code", monospace', 
            overflowX: 'auto',
            lineHeight: '1.6'
          }}>
            {submission.code}
          </pre>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Status Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Verdict</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: getStatusColor(submission.status), display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {submission.status}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Time</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{submission.execution_time ? `${submission.execution_time.toFixed(3)}s` : '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Memory</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{submission.memory_used || '-'} MB</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Problem Info</h3>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>Problem #{submission.problem_id}</div>
            <Link to={`/problems/${submission.problem_id}`} className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
              View Problem
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionDetail
