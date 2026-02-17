import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { signOut } from '../lib/supabaseClient'
import './Navigation.css'

export default function Navigation() {
  const { user, setUser, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.removeItem('acroyoga_session')
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const isGuest = user?.id.startsWith('guest-')

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <h1 onClick={() => navigate('/')}>🤸‍♀️ Acroyoga</h1>
        </div>

        <div className="nav-links">
          {isAdmin && location.pathname !== '/admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="nav-button"
            >
              ⚙️ Admin
            </button>
          )}

          <div className="nav-user-info">
            {!isGuest && <span className="user-email">{user?.email}</span>}
            {isGuest && <span className="user-email">👤 Invitado</span>}
          </div>

          <button
            onClick={handleLogout}
            className="nav-button logout"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
