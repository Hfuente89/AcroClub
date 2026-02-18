import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../lib/supabaseClient'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    if (!user) return
    try {
      const result = await getUserProfile(user.id)
      if (result.data) {
        setProfile({
          full_name: result.data.full_name || '',
          phone: result.data.phone || '',
          email: result.data.email || user.email
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const result = await updateUserProfile(user.id, {
        full_name: profile.full_name,
        phone: profile.phone
      })

      if (result.error) {
        alert('Error al guardar: ' + result.error.message)
      } else {
        alert('Perfil actualizado correctamente')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error al guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Cargando perfil...</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Mi Perfil</h1>

        <div className="profile-card">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Tu teléfono"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-outline"
          style={{ width: '100%', marginTop: '20px' }}
        >
          Volver a Talleres
        </button>
      </div>
    </div>
  )
}
