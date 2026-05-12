import { User, Settings, Search } from 'lucide-react'

function Navbar({ isLoggedIn }) {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '2rem',
      padding: '1rem 1.5rem',
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div className="search-bar" style={{ position: 'relative' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)',
              opacity: 0.5
            }} 
          />
          <input 
            type="text" 
            placeholder="Search problems..." 
            style={{ 
              width: '320px', 
              padding: '0.7rem 1rem 0.7rem 2.75rem', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.75rem',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)'
              e.target.style.borderColor = 'var(--primary)'
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.05)'
              e.target.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button 
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0.75rem', 
            padding: '0.6rem', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
        >
          <Bell size={18} style={{ color: 'var(--text-muted)' }} />
          <span style={{
            position: 'absolute',
            top: '0.4rem',
            right: '0.4rem',
            width: '6px',
            height: '6px',
            background: 'var(--primary)',
            borderRadius: '50%',
            border: '2px solid rgba(0,0,0,0.8)'
          }}></span>
        </button>
        
        <button 
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0.75rem', 
            padding: '0.6rem', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
        >
          <Settings size={18} style={{ color: 'var(--text-muted)' }} />
        </button>
        
        {isLoggedIn && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            background: 'rgba(255,255,255,0.05)', 
            padding: '0.4rem 1.2rem 0.4rem 0.4rem', 
            borderRadius: '2.5rem', 
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}>
              <User size={16} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>User</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.8 }}>Pro Member</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar