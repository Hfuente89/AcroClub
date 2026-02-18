import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Settings, User, LogOut } from 'lucide-react'
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
          <h1 onClick={() => navigate('/')}>Acroyoga Club</h1>
        </div>

        <div className="nav-links">
          {isAdmin && location.pathname !== '/admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="nav-button"
              title="Panel Administrativo"
            >
              <Settings size={18} />
              <span>Admin</span>
            </button>
          )}

          <button
            onClick={() => navigate('/profile')}
            className="nav-button"
            title="Mi Perfil"
          >
            <User size={18} />
            <span>Perfil</span>
          </button>

          <div className="nav-user-info">
            {!isGuest && <span className="user-email">{user?.email}</span>}
            {isGuest && <span className="user-email"><User size={16} /> Invitado</span>}
          </div>

          <button
            onClick={handleLogout}
            className="nav-button logout"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
