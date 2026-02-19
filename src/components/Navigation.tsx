import { useState, useContext, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Settings, User, LogOut, Menu, Info, Phone } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { signOut } from '../lib/supabaseClient'
import './Navigation.css'

export default function Navigation() {
  const { user, setUser, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

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

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <h1 onClick={() => navigate('/')}>Acroyoga Club</h1>
        </div>

        <div className="nav-right" ref={menuRef}>
          <button
            className="nav-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <Menu size={22} />
          </button>

          {menuOpen && (
            <div className="nav-dropdown">
              {isAdmin && location.pathname !== '/admin' && (
                <button className="nav-dropdown-item" onClick={() => navigate('/admin')}>
                  <Settings size={18} />
                  <span>Configuración</span>
                </button>
              )}
              <button className="nav-dropdown-item" onClick={() => navigate('/profile')}>
                <User size={18} />
                <span>Mi Perfil</span>
              </button>
              <button className="nav-dropdown-item" onClick={() => navigate('/sobre-nosotros')}>
                <Info size={18} />
                <span>Sobre Nosotros</span>
              </button>
              <button className="nav-dropdown-item" onClick={() => navigate('/contacto')}>
                <Phone size={18} />
                <span>Contacto</span>
              </button>
              <div className="nav-dropdown-divider" />
              <button className="nav-dropdown-item logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
