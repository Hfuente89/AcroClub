import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp, getUserProfile, createUserProfile } from '../lib/supabaseClient'
import { AuthContext } from '../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser, setIsAdmin } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password)
        
        if (!result.error && result.data?.user?.id) {
          // Crear perfil de usuario después del registro
          const userId = result.data.user.id
          await createUserProfile(userId, email, 'socio')
        }
      } else {
        result = await signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message || 'Error en la autenticación')
      } else {
        const userId = result.data?.user?.id || ''
        
        // Obtener el perfil del usuario para obtener su rol
        let userRole = 'socio'
        const profileResult = await getUserProfile(userId)
        if (!profileResult.error && profileResult.data) {
          userRole = profileResult.data.role || 'socio'
        }

        const userData = {
          id: userId,
          email: email,
          role: userRole as 'admin' | 'socio' | 'guest'
        }
        setUser(userData)
        setIsAdmin(userRole === 'admin')
        localStorage.setItem('acroyoga_session', JSON.stringify(userData))
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      email: 'guest@acroyoga.club',
      role: 'guest' as const
    }
    setUser(guestUser)
    localStorage.setItem('acroyoga_session', JSON.stringify(guestUser))
    navigate('/')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <h1>🤸‍♀️ Acroyoga Club</h1>
          <p>Talleres y Entrenamientos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Procesando...' : isSignUp ? 'Registrarse' : 'Entrar'}
          </button>

          <div className="toggle-auth">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="link-button"
            >
              {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </form>

        <div className="guest-section">
          <div className="divider">O</div>
          <button
            onClick={handleGuestLogin}
            className="btn-outline"
            style={{ width: '100%' }}
          >
            Continuar como Invitado
          </button>
          <p className="guest-info">
            Como invitado puedes ver talleres y entrenamientos, pero tendrás acceso limitado.
          </p>
        </div>
      </div>
    </div>
  )
}
