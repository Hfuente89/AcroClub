import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { initSupabaseClient } from './lib/supabaseClient'
import { AuthContext } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import WorkshopsPage from './pages/WorkshopsPage'
import AdminPanel from './pages/AdminPanel'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Inicializar Supabase
    initSupabaseClient()
    
    // Comprobar sesión guardada
    const savedSession = localStorage.getItem('acroyoga_session')
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession)
        setUser(sessionData)
        setIsAdmin(sessionData.role === 'admin')
      } catch (e) {
        console.error('Error al restaurar sesión:', e)
        localStorage.removeItem('acroyoga_session')
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>
      <Router>
        {user && <Navigation />}
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<WorkshopsPage />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
