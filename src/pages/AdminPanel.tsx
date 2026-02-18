import { useState, useEffect } from 'react'
import { getWorkshops, getTrainings, createWorkshop, deleteWorkshop, createTraining, deleteTraining, getFormQuestions, updateFormQuestion, getAllUserProfiles, updateUserRole } from '../lib/supabaseClient'
import './AdminPanel.css'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('workshops')
  const [workshops, setWorkshops] = useState<any[]>([])
  const [trainings, setTrainings] = useState<any[]>([])
  const [formQuestions, setFormQuestions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Workshop form
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    date: ''
  })

  // Training form
  const [trainingForm, setTrainingForm] = useState({
    date: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [workshopsRes, trainingsRes, questionsRes, usersRes] = await Promise.all([
        getWorkshops(),
        getTrainings(),
        getFormQuestions(),
        getAllUserProfiles()
      ])

      if (workshopsRes.data) setWorkshops(workshopsRes.data)
      if (trainingsRes.data) setTrainings(trainingsRes.data)
      if (questionsRes.data) setFormQuestions(questionsRes.data)
      if (usersRes.data) setUsers(usersRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await createWorkshop({
        ...workshopForm,
        created_at: new Date().toISOString()
      })

      if (result.error) throw result.error

      setWorkshops([...workshops, result.data?.[0]])
      setWorkshopForm({ title: '', description: '', date: '' })
    } catch (error) {
      console.error('Error creating workshop:', error)
    }
  }

  const handleDeleteWorkshop = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este taller?')) {
      try {
        const result = await deleteWorkshop(id)
        if (result.error) throw result.error

        setWorkshops(workshops.filter(w => w.id !== id))
      } catch (error) {
        console.error('Error deleting workshop:', error)
      }
    }
  }

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await createTraining({
        ...trainingForm,
        created_at: new Date().toISOString()
      })

      if (result.error) throw result.error

      setTrainings([...trainings, result.data?.[0]])
      setTrainingForm({ date: '' })
    } catch (error) {
      console.error('Error creating training:', error)
    }
  }

  const handleDeleteTraining = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      try {
        const result = await deleteTraining(id)
        if (result.error) throw result.error

        setTrainings(trainings.filter(t => t.id !== id))
      } catch (error) {
        console.error('Error deleting training:', error)
      }
    }
  }

  const handleUpdateQuestion = async (id: string, field: string, value: any) => {
    try {
      const result = await updateFormQuestion(id, { [field]: value })
      if (result.error) throw result.error

      setFormQuestions(formQuestions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      ))
    } catch (error) {
      console.error('Error updating question:', error)
    }
  }

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    if (confirm(`¿Cambiar rol del usuario a "${newRole}"?`)) {
      try {
        const result = await updateUserRole(userId, newRole)
        if (result.error) throw result.error

        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ))
      } catch (error) {
        console.error('Error updating user role:', error)
      }
    }
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'workshops' ? 'active' : ''}`}
          onClick={() => setActiveTab('workshops')}
        >
          Gestionar Talleres
        </button>
        <button
          className={`admin-tab ${activeTab === 'trainings' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainings')}
        >
          Gestionar Entrenamientos
        </button>
        <button
          className={`admin-tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Gestionar Preguntas del Formulario
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gestionar Usuarios
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'workshops' && (
          <section className="admin-section">
            <h2>Crear Nuevo Taller</h2>
            <form onSubmit={handleCreateWorkshop} className="admin-form">
              <input
                type="text"
                placeholder="Título del taller"
                value={workshopForm.title}
                onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                value={workshopForm.description}
                onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
                required
              />
              <input
                type="datetime-local"
                value={workshopForm.date}
                onChange={(e) => setWorkshopForm({ ...workshopForm, date: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary">Crear Taller</button>
            </form>

            <h2 style={{ marginTop: '2rem' }}>Talleres Existentes</h2>
            <div className="items-list">
              {workshops.map(workshop => (
                <div key={workshop.id} className="item-row">
                  <div>
                    <h3>{workshop.title}</h3>
                    <p>{workshop.description}</p>
                    <small>{new Date(workshop.date).toLocaleDateString('es-ES')}</small>
                  </div>
                  <button
                    onClick={() => handleDeleteWorkshop(workshop.id)}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'trainings' && (
          <section className="admin-section">
            <h2>Crear Nuevo Entrenamiento</h2>
            <form onSubmit={handleCreateTraining} className="admin-form">
              <input
                type="datetime-local"
                value={trainingForm.date}
                onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary">Crear Entrenamiento</button>
            </form>

            <h2 style={{ marginTop: '2rem' }}>Entrenamientos Existentes</h2>
            <div className="items-list">
              {trainings.map(training => (
                <div key={training.id} className="item-row">
                  <div>
                    <small>{new Date(training.date).toLocaleDateString('es-ES')}</small>
                  </div>
                  <button
                    onClick={() => handleDeleteTraining(training.id)}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'questions' && (
          <section className="admin-section">
            <h2>Preguntas del Formulario de Registro</h2>
            <div className="questions-table-wrapper">
              <table className="questions-table">
                <thead>
                  <tr>
                    <th>Pregunta</th>
                    <th>Tipo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {formQuestions.map(question => (
                    <tr key={question.id}>
                      <td>
                        <input
                          type="text"
                          value={question.label}
                          onChange={(e) => handleUpdateQuestion(question.id, 'label', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={question.type}
                          onChange={(e) => handleUpdateQuestion(question.id, 'type', e.target.value)}
                        >
                          <option value="text">Texto</option>
                          <option value="email">Email</option>
                          <option value="tel">Teléfono</option>
                          <option value="select">Selección</option>
                          <option value="radio">Opción Múltiple</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-secondary">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section className="admin-section">
            <h2>Usuarios Registrados</h2>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Rol Actual</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role === 'admin' && '👨‍💼 Admin'}
                            {user.role === 'socio' && '🏅 Socio'}
                            {user.role === 'guest' && 'Invitado'}
                          </span>
                        </td>
                        <td>
                          <div className="role-actions">
                            {user.role !== 'guest' && (
                              <button
                                onClick={() => handleChangeUserRole(user.id, 'guest')}
                                className="btn-secondary btn-sm"
                              >
                                Invitado
                              </button>
                            )}
                            {user.role !== 'socio' && (
                              <button
                                onClick={() => handleChangeUserRole(user.id, 'socio')}
                                className="btn-secondary btn-sm"
                              >
                                Socio
                              </button>
                            )}
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleChangeUserRole(user.id, 'admin')}
                                className="btn-warning btn-sm"
                              >
                                Admin
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
