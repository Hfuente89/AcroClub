import { useState, useEffect, useContext } from 'react'
import { getWorkshops, getTrainings, registerToWorkshop, getUserRegistrations, getFormQuestions } from '../lib/supabaseClient'
import { AuthContext } from '../context/AuthContext'
import WorkshopCard from '../components/WorkshopCard'
import RegistrationForm from '../components/RegistrationForm'
import CalendarView from '../components/CalendarView'
import ActivityDetails from '../components/ActivityDetails'
import './WorkshopsPage.css'

export default function WorkshopsPage() {
  const { user } = useContext(AuthContext)
  const [workshops, setWorkshops] = useState<any[]>([])
  const [trainings, setTrainings] = useState<any[]>([])
  const [userRegistrations, setUserRegistrations] = useState<any[]>([])
  const [formQuestions, setFormQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('workshops')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [workshopsRes, trainingsRes, questionsRes] = await Promise.all([
        getWorkshops(),
        getTrainings(),
        getFormQuestions()
      ])

      if (workshopsRes.error) throw workshopsRes.error
      if (trainingsRes.error) throw trainingsRes.error
      if (questionsRes.error) throw questionsRes.error

      setWorkshops(workshopsRes.data || [])
      setTrainings(trainingsRes.data || [])
      setFormQuestions(questionsRes.data || [])

      if (user && user.id !== 'guest' && !user.id.startsWith('guest-')) {
        const regsRes = await getUserRegistrations(user.id)
        if (!regsRes.error) {
          setUserRegistrations(regsRes.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (registration: any) => {
    try {
      if (!user) return
      
      const result = await registerToWorkshop({
        ...registration,
        user_id: user.id,
        workshop_id: selectedItem.id,
        created_at: new Date().toISOString()
      })

      if (result.error) {
        alert('Error al registrarse: ' + result.error.message)
        throw result.error
      }

      if (result.data && result.data[0]) {
        setUserRegistrations([...userRegistrations, result.data[0]])
      }
      setShowRegistrationForm(false)
      setSelectedItem(null)
      alert('¡Te has registrado correctamente!')
    } catch (error) {
      console.error('Error registering:', error)
    }
  }

  const handleRegisterDirectly = async (item: any) => {
    try {
      if (!user) {
        alert('No estás logueado')
        return
      }
      
      console.log('Registrando usuario:', user.id, 'a taller:', item.id)
      
      // Registrar socio directamente sin formulario
      const result = await registerToWorkshop({
        user_id: user.id,
        workshop_id: item.id,
        full_name: user.email || 'Socio',
        phone: '000000000',
        email: user.email || '',
        created_at: new Date().toISOString()
      })

      console.log('Resultado de registro:', result)

      if (result.error) {
        console.error('Error de Supabase:', result.error)
        alert('Error al registrarse: ' + result.error.message)
        throw result.error
      }

      if (result.data && result.data[0]) {
        setUserRegistrations([...userRegistrations, result.data[0]])
        alert('¡Te has registrado correctamente!')
      }
    } catch (error) {
      console.error('Error registering:', error)
    }
  }

  const isRegistered = (itemId: string) => {
    return userRegistrations.some(reg => reg.workshop_id === itemId)
  }

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity)
  }

  const isGuest = user?.role === 'guest'

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="workshops-page">
      <div className="page-header">
        <h1>Talleres y Entrenamientos</h1>
        <p>Únete a nuestras actividades de Acroyoga</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'workshops' ? 'active' : ''}`}
          onClick={() => setActiveTab('workshops')}
        >
          📋 Talleres ({workshops.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'trainings' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainings')}
        >
          🏋️ Entrenamientos ({trainings.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendario
        </button>
      </div>

      <div className="content">
        {activeTab === 'workshops' && (
          <div className="items-grid">
            {workshops.length === 0 ? (
              <p className="empty-state">No hay talleres disponibles</p>
            ) : (
              workshops.map(workshop => (
                <WorkshopCard
                  key={workshop.id}
                  title={workshop.title}
                  description={workshop.description}
                  date={new Date(workshop.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  isRegistered={isRegistered(workshop.id)}
                  isGuest={isGuest}
                  onViewDetails={() => handleActivityClick(workshop)}
                  onRegister={() => {
                    if (!isRegistered(workshop.id)) {
                      // Si es socio o admin, registrar directamente sin formulario
                      if (user?.role === 'socio' || user?.role === 'admin') {
                        handleRegisterDirectly(workshop)
                      } else if (user?.role === 'guest') {
                        // Si es invitado, mostrar formulario
                        setSelectedItem(workshop)
                        setShowRegistrationForm(true)
                      }
                    }
                  }}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'trainings' && (
          <div className="items-grid">
            {trainings.length === 0 ? (
              <p className="empty-state">No hay entrenamientos disponibles</p>
            ) : (
              trainings.map(training => (
                <WorkshopCard
                  key={training.id}
                  title="Entrenamiento"
                  description="Sesión de entrenamiento grupal"
                  date={new Date(training.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  isRegistered={isRegistered(training.id)}
                  isGuest={isGuest}
                  onViewDetails={() => handleActivityClick(training)}
                  onRegister={() => {
                    if (!isRegistered(training.id)) {
                      // Si es socio o admin, registrar directamente sin formulario
                      if (user?.role === 'socio' || user?.role === 'admin') {
                        handleRegisterDirectly(training)
                      } else if (user?.role === 'guest') {
                        // Si es invitado, mostrar formulario
                        setSelectedItem(training)
                        setShowRegistrationForm(true)
                      }
                    }
                  }}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            workshops={workshops}
            trainings={trainings}
            onActivityClick={handleActivityClick}
          />
        )}
      </div>

      {showRegistrationForm && selectedItem && (
        <RegistrationForm
          item={selectedItem}
          formQuestions={formQuestions}
          onSubmit={handleRegister}
          onClose={() => {
            setShowRegistrationForm(false)
            setSelectedItem(null)
          }}
        />
      )}

      {selectedActivity && (
        <ActivityDetails
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  )
}
