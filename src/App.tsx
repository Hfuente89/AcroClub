import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { initSupabaseClient } from './lib/supabaseClient'
import { AuthContext, User } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import WorkshopsPage from './pages/WorkshopsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPanel from './pages/AdminPanel'
import Navigation from './components/Navigation'
import NotificationPermissionRequest from './components/NotificationPermissionRequest'
import { useWorkshopNotifications } from './hooks/useWorkshopNotifications'
import './App.css'

function AppContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Initialize notifications
  useWorkshopNotifications()

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
      {user && <Navigation />}
      {user && <NotificationPermissionRequest />}
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<WorkshopsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <Router basename="/AcroClub">
      <AppContent />
    </Router>
  )
}

export default App
