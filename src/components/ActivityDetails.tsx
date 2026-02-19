import { useState, useEffect, useContext } from 'react'
import { Crown, Clock, FileText, MapPin, Users, Phone, AlertCircle, Instagram } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { getWorkshopRegistrations } from '../lib/supabaseClient'
import './ActivityDetails.css'

interface Activity {
  id: string
  title?: string
  description?: string
  date: string
  type: 'workshop' | 'training'
  location?: string
  instructor?: string
  instagram?: string
}

interface ActivityDetailsProps {
  activity: Activity
  onClose: () => void
}

export default function ActivityDetails({ activity, onClose }: ActivityDetailsProps) {
  const { user } = useContext(AuthContext)
  const [attendees, setAttendees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Determinar si el usuario puede ver los asistentes
  // Admin y socios pueden ver, invitados no
  const canViewAttendees = user?.role === 'admin' || user?.role === 'socio'

  useEffect(() => {
    if (canViewAttendees) {
      loadAttendees()
    } else {
      setLoading(false)
    }
  }, [activity.id])

  const loadAttendees = async () => {
    try {
      setLoading(true)
      const result = await getWorkshopRegistrations(activity.id)
      
      if (!result.error && result.data) {
        setAttendees(result.data)
      }
    } catch (error) {
      console.error('Error cargando asistentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const cleanPhoneForWhatsApp = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.length <= 9) cleaned = '34' + cleaned
    return cleaned
  }

  const parseInstagramHandles = (text: string): string[] => {
    return text.split(/[,;\n]+/)
      .map(h => h.trim().replace(/^@/, ''))
      .filter(h => h.length > 0)
  }

  return (
    <div className="activity-details-overlay" onClick={onClose}>
      <div className="activity-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✕</button>
        
        <div className={`activity-header ${activity.type}`}>
          <h2>{activity.title || 'Actividad'}</h2>
          <span className="activity-type-badge">
            {activity.type === 'workshop' ? 'Taller' : 'Entrenamiento'}
          </span>
        </div>

        <div className="activity-content">
          <div className="activity-info">
            <div className="info-item">
              <span className="info-label"><Clock size={18} /> Fecha y hora:</span>
              <span className="info-value">{formatDate(activity.date)}</span>
            </div>

            {activity.description && (
              <div className="info-item">
                <span className="info-label"><FileText size={18} /> Descripción:</span>
                <span className="info-value">{activity.description}</span>
              </div>
            )}

            {activity.location && (
              <div className="info-item">
                <span className="info-label"><MapPin size={18} /> Ubicación:</span>
                <span className="info-value">{activity.location}</span>
              </div>
            )}

            {activity.instructor && (
              <div className="info-item">
                <span className="info-label"><Crown size={18} /> Instructor:</span>
                <span className="info-value">{activity.instructor}</span>
              </div>
            )}

            {activity.instagram && (
              <div className="info-item">
                <span className="info-label"><Instagram size={18} /> Instagram:</span>
                <div className="info-value instagram-links">
                  {parseInstagramHandles(activity.instagram).map((handle, i) => (
                    <a
                      key={i}
                      href={`https://instagram.com/${handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="instagram-link"
                    >
                      @{handle}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {canViewAttendees && (
            <div className="attendees-section">
              <h3>
                <span><Users size={20} /> Asistentes</span>
                <span className="attendees-count">({attendees.length})</span>
              </h3>
              
              {loading ? (
                <div className="loading-attendees">Cargando asistentes...</div>
              ) : attendees.length === 0 ? (
                <p className="no-attendees">Aún no hay asistentes registrados</p>
              ) : (
                <div className="attendees-list">
                  {attendees.map((attendee, index) => (
                    <div key={attendee.id || index} className="attendee-card">
                      <div className="attendee-avatar">
                        {attendee.full_name ? attendee.full_name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="attendee-info">
                        {attendee.phone ? (
                          <a
                            href={`https://wa.me/${cleanPhoneForWhatsApp(attendee.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attendee-name whatsapp-link"
                          >
                            {attendee.full_name || 'Anónimo'}
                          </a>
                        ) : (
                          <div className="attendee-name">{attendee.full_name || 'Anónimo'}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!canViewAttendees && (
            <div className="guest-message">
              <p><AlertCircle size={20} /> Registrate como socio para ver la lista de asistentes</p>
            </div>
          )}
        </div>

        <div className="activity-footer">
          <button className="close-modal-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
