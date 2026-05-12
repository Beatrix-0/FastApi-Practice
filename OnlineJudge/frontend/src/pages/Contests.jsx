import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Trophy, Clock, Calendar, Users, ChevronRight } from 'lucide-react'

function Contests() {
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/contests/')
      .then(res => setContests(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const getStatus = (start, end) => {
    const now = new Date()
    if (now < new Date(start)) return 'Upcoming'
    if (now > new Date(end)) return 'Past'
    return 'Active'
  }

  const activeContests = contests.filter(c => getStatus(c.start_time, c.end_time) === 'Active')
  const upcomingContests = contests.filter(c => getStatus(c.start_time, c.end_time) === 'Upcoming')
  const pastContests = contests.filter(c => getStatus(c.start_time, c.end_time) === 'Past')

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--bg-accent) 100%)',
        padding: '3rem',
        borderRadius: '2rem',
        marginBottom: '3rem',
        color: 'white',
        boxShadow: '0 20px 40px rgba(70, 132, 50, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
            ★ Competitive Arena
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Live Contests</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px' }}>
            Join our scheduled competitions, solve challenges in real-time, and see where you stand on the global scoreboard.
          </p>
        </div>
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1 }}>
          <Trophy size={300} />
        </div>
      </div>

      {/* Active */}
      {activeContests.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }}></div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Active Contests</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {activeContests.map(c => <ContestCard key={c.id} contest={c} status="Active" />)}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar color="var(--primary)" /> Upcoming Challenges
        </h2>
        {upcomingContests.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {upcomingContests.map(c => <ContestCard key={c.id} contest={c} status="Upcoming" />)}
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>
            No upcoming contests scheduled. Check back soon!
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock color="var(--text-muted)" /> Past Contests
        </h2>
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left' }}>Contest Name</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>Date</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>Participants</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pastContests.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{c.title}</td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {new Date(c.start_time).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      <Users size={14} /> —
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <Link to={`/contests/${c.id}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      View Standings
                    </Link>
                  </td>
                </tr>
              ))}
              {pastContests.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No past contests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function ContestCard({ contest, status }) {
  const isUpcoming = status === 'Upcoming'
  const durationHours = Math.round((new Date(contest.end_time) - new Date(contest.start_time)) / 3600000)

  return (
    <Link to={`/contests/${contest.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card" style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isUpcoming ? '1px solid rgba(0,0,0,0.05)' : '1px solid var(--primary)',
        background: isUpcoming ? 'var(--bg-card)' : 'rgba(70, 132, 50, 0.02)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {!isUpcoming && (
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: '#ef4444', color: 'white', padding: '0.2rem 0.75rem',
            borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase'
          }}>
            Live
          </div>
        )}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{contest.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
          {contest.description || 'Join this contest and solve challenging problems.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Calendar size={16} />
            <span>Starts: {new Date(contest.start_time).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Clock size={16} />
            <span>Duration: {durationHours} hour{durationHours !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
            {isUpcoming ? 'Register Now' : 'Enter Contest'} <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Contests
