import { useState, useEffect, useMemo } from 'react'
import { Pencil, Trash2, Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { getWorkshops, getTrainings, createWorkshop, deleteWorkshop, updateWorkshop, createTraining, deleteTraining, updateTraining, getFormQuestions, updateFormQuestion, getAllUserProfiles, updateUserRole } from '../lib/supabaseClient'
import DateTimePicker from '../components/DateTimePicker'
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
    date: '',
    instagram: ''
  })

  // Training form
  const [trainingForm, setTrainingForm] = useState({
    date: ''
  })

  // Editing workshops
  const [editingWorkshopId, setEditingWorkshopId] = useState<string | null>(null)
  const [editWorkshopForm, setEditWorkshopForm] = useState({ title: '', description: '', date: '', instagram: '' })

  // Editing trainings
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null)
  const [editTrainingForm, setEditTrainingForm] = useState({ date: '' })

  const calendarEvents = useMemo(() => [
    ...workshops.map(w => ({ date: w.date, label: w.title || 'Taller', type: 'workshop' as const })),
    ...trainings.map(t => ({ date: t.date, label: 'Entreno libre', type: 'training' as const }))
  ], [workshops, trainings])

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

      await loadData()
      setWorkshopForm({ title: '', description: '', date: '', instagram: '' })
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

      await loadData()
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

  const startEditWorkshop = (workshop: any) => {
    setEditingWorkshopId(workshop.id)
    const d = new Date(workshop.date)
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setEditWorkshopForm({
      title: workshop.title || '',
      description: workshop.description || '',
      date: localDate,
      instagram: workshop.instagram || ''
    })
  }

  const handleSaveWorkshop = async () => {
    if (!editingWorkshopId) return
    try {
      const result = await updateWorkshop(editingWorkshopId, {
        title: editWorkshopForm.title,
        description: editWorkshopForm.description,
        date: editWorkshopForm.date,
        instagram: editWorkshopForm.instagram
      })
      if (result.error) throw result.error
      setWorkshops(workshops.map(w =>
        w.id === editingWorkshopId ? { ...w, ...editWorkshopForm } : w
      ))
      setEditingWorkshopId(null)
    } catch (error) {
      console.error('Error updating workshop:', error)
    }
  }

  const startEditTraining = (training: any) => {
    setEditingTrainingId(training.id)
    const d = new Date(training.date)
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setEditTrainingForm({ date: localDate })
  }

  const handleSaveTraining = async () => {
    if (!editingTrainingId) return
    try {
      const result = await updateTraining(editingTrainingId, { date: editTrainingForm.date })
      if (result.error) throw result.error
      setTrainings(trainings.map(t =>
        t.id === editingTrainingId ? { ...t, date: editTrainingForm.date } : t
      ))
      setEditingTrainingId(null)
    } catch (error) {
      console.error('Error updating training:', error)
    }
  }

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState('')
  const [editingType, setEditingType] = useState('')
  const [editingOptions, setEditingOptions] = useState<string[]>([])
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)

  const startEditQuestion = (question: any) => {
    setEditingQuestionId(question.id)
    setEditingLabel(question.label || '')
    setEditingType(question.type || 'text')
    setEditingOptions(question.options ? [...question.options] : [])
  }

  const cancelEditQuestion = () => {
    setEditingQuestionId(null)
    setEditingLabel('')
    setEditingType('')
    setEditingOptions([])
  }

  const saveEditQuestion = async (id: string) => {
    try {
      const updates: any = { label: editingLabel, type: editingType }
      if (editingType === 'select' || editingType === 'radio') {
        updates.options = editingOptions.filter(o => o.trim() !== '')
      } else {
        updates.options = null
      }
      const result = await updateFormQuestion(id, updates)
      if (result.error) throw result.error

      setFormQuestions(formQuestions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      ))
      setEditingQuestionId(null)
    } catch (error) {
      console.error('Error updating question:', error)
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
              <DateTimePicker
                value={workshopForm.date}
                onChange={(val) => setWorkshopForm({ ...workshopForm, date: val })}
                events={calendarEvents}
              />
              <input
                type="text"
                placeholder="Instagram (ej: @usuario1, @usuario2)"
                value={workshopForm.instagram}
                onChange={(e) => setWorkshopForm({ ...workshopForm, instagram: e.target.value })}
              />
              <button type="submit" className="btn-primary">Crear Taller</button>
            </form>

            <h2 style={{ marginTop: '2rem' }}>Talleres Existentes</h2>
            <div className="items-list">
              {workshops.map(workshop => (
                <div key={workshop.id} className="item-card">
                  {editingWorkshopId === workshop.id ? (
                    <div className="item-edit-form">
                      <input
                        type="text"
                        value={editWorkshopForm.title}
                        onChange={(e) => setEditWorkshopForm({ ...editWorkshopForm, title: e.target.value })}
                        placeholder="Título"
                      />
                      <textarea
                        value={editWorkshopForm.description}
                        onChange={(e) => setEditWorkshopForm({ ...editWorkshopForm, description: e.target.value })}
                        placeholder="Descripción"
                        rows={2}
                      />
                      <DateTimePicker
                        value={editWorkshopForm.date}
                        onChange={(val) => setEditWorkshopForm({ ...editWorkshopForm, date: val })}
                        events={calendarEvents}
                      />
                      <input
                        type="text"
                        value={editWorkshopForm.instagram}
                        onChange={(e) => setEditWorkshopForm({ ...editWorkshopForm, instagram: e.target.value })}
                        placeholder="Instagram"
                      />
                      <div className="item-edit-actions">
                        <button className="q-action-btn cancel" onClick={() => setEditingWorkshopId(null)}>
                          <X size={16} /> Cancelar
                        </button>
                        <button className="q-action-btn save" onClick={handleSaveWorkshop}>
                          <Check size={16} /> Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-card-info">
                        <h3>{workshop.title}</h3>
                        <p>{workshop.description}</p>
                        <small>{new Date(workshop.date).toLocaleDateString('es-ES')}</small>
                        {workshop.instagram && (
                          <small style={{ display: 'block', marginTop: '4px', color: '#E1306C' }}>
                            📸 {workshop.instagram}
                          </small>
                        )}
                      </div>
                      <div className="item-card-actions">
                        <button className="q-icon-btn edit" onClick={() => startEditWorkshop(workshop)} title="Editar">
                          <Pencil size={16} />
                        </button>
                        <button className="q-icon-btn delete" onClick={() => handleDeleteWorkshop(workshop.id)} title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'trainings' && (
          <section className="admin-section">
            <h2>Crear Nuevo Entrenamiento</h2>
            <form onSubmit={handleCreateTraining} className="admin-form">
              <DateTimePicker
                value={trainingForm.date}
                onChange={(val) => setTrainingForm({ date: val })}
                defaultHour="19"
                defaultMinute="30"
                events={calendarEvents}
              />
              <button type="submit" className="btn-primary">Crear Entrenamiento</button>
            </form>

            <h2 style={{ marginTop: '2rem' }}>Entrenamientos Existentes</h2>
            <div className="items-list">
              {trainings.map(training => (
                <div key={training.id} className="item-card">
                  {editingTrainingId === training.id ? (
                    <div className="item-edit-form">
                      <DateTimePicker
                        value={editTrainingForm.date}
                        onChange={(val) => setEditTrainingForm({ date: val })}
                        defaultHour="19"
                        defaultMinute="30"
                        events={calendarEvents}
                      />
                      <div className="item-edit-actions">
                        <button className="q-action-btn cancel" onClick={() => setEditingTrainingId(null)}>
                          <X size={16} /> Cancelar
                        </button>
                        <button className="q-action-btn save" onClick={handleSaveTraining}>
                          <Check size={16} /> Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-card-info">
                        <h3>Entreno libre</h3>
                        <small>{new Date(training.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' }).replace('.', '')}</small>
                      </div>
                      <div className="item-card-actions">
                        <button className="q-icon-btn edit" onClick={() => startEditTraining(training)} title="Editar">
                          <Pencil size={16} />
                        </button>
                        <button className="q-icon-btn delete" onClick={() => handleDeleteTraining(training.id)} title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'questions' && (
          <section className="admin-section">
            <h2>Preguntas del Formulario</h2>
            <div className="question-cards">
              {formQuestions.map(question => {
                const isEditing = editingQuestionId === question.id
                const isExpanded = expandedQuestionId === question.id
                const hasOptions = question.type === 'select' || question.type === 'radio'
                const typeLabels: Record<string, string> = {
                  text: 'Texto', email: 'Email', tel: 'Teléfono',
                  select: 'Selección', radio: 'Opción Múltiple'
                }

                return (
                  <div key={question.id} className={`question-card ${isEditing ? 'editing' : ''}`}>
                    {!isEditing ? (
                      <>
                        <div className="question-card-header" onClick={() => setExpandedQuestionId(isExpanded ? null : question.id)}>
                          <div className="question-card-info">
                            <span className="question-label">{question.label}</span>
                            <span className="question-type-badge">{typeLabels[question.type] || question.type}</span>
                          </div>
                          <div className="question-card-actions">
                            <button
                              className="q-icon-btn edit"
                              onClick={(e) => { e.stopPropagation(); startEditQuestion(question) }}
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            {hasOptions && (
                              <button className="q-icon-btn expand" onClick={(e) => { e.stopPropagation(); setExpandedQuestionId(isExpanded ? null : question.id) }}>
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            )}
                          </div>
                        </div>
                        {isExpanded && hasOptions && question.options && (
                          <div className="question-options-preview">
                            <span className="options-title">Opciones:</span>
                            {question.options.map((opt: string, i: number) => (
                              <span key={i} className="option-chip">{opt}</span>
                            ))}
                            {(!question.options || question.options.length === 0) && (
                              <span className="no-options">Sin opciones definidas</span>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="question-edit-form">
                        <div className="edit-field">
                          <label>Pregunta</label>
                          <textarea
                            value={editingLabel}
                            onChange={(e) => setEditingLabel(e.target.value)}
                            rows={2}
                            placeholder="Escribe la pregunta..."
                          />
                        </div>
                        <div className="edit-field">
                          <label>Tipo</label>
                          <select
                            value={editingType}
                            onChange={(e) => setEditingType(e.target.value)}
                          >
                            <option value="text">Texto</option>
                            <option value="email">Email</option>
                            <option value="tel">Teléfono</option>
                            <option value="select">Selección</option>
                            <option value="radio">Opción Múltiple</option>
                          </select>
                        </div>

                        {(editingType === 'select' || editingType === 'radio') && (
                          <div className="edit-field">
                            <label>Opciones de respuesta</label>
                            <div className="edit-options-list">
                              {editingOptions.map((opt, i) => (
                                <div key={i} className="edit-option-row">
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const updated = [...editingOptions]
                                      updated[i] = e.target.value
                                      setEditingOptions(updated)
                                    }}
                                    placeholder={`Opción ${i + 1}`}
                                  />
                                  <button
                                    type="button"
                                    className="q-icon-btn delete"
                                    onClick={() => setEditingOptions(editingOptions.filter((_, idx) => idx !== i))}
                                    title="Eliminar opción"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="add-option-btn"
                                onClick={() => setEditingOptions([...editingOptions, ''])}
                              >
                                <Plus size={14} /> Añadir opción
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="edit-actions">
                          <button className="q-action-btn cancel" onClick={cancelEditQuestion}>
                            <X size={16} /> Cancelar
                          </button>
                          <button className="q-action-btn save" onClick={() => saveEditQuestion(question.id)}>
                            <Check size={16} /> Guardar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section className="admin-section">
            <h2>Usuarios Registrados</h2>
            {users.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No hay usuarios registrados</p>
            ) : (
              <div className="user-cards">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-card-header">
                      <div className="user-card-avatar">
                        {(user.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="user-card-info">
                        <span className="user-card-email">{user.email}</span>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role === 'admin' && '👨‍💼 Admin'}
                          {user.role === 'socio' && '🏅 Socio'}
                          {user.role === 'guest' && 'Invitado'}
                        </span>
                      </div>
                    </div>
                    <div className="user-card-actions">
                      {user.role !== 'guest' && (
                        <button className="btn-role btn-role-guest" onClick={() => handleChangeUserRole(user.id, 'guest')}>
                          Invitado
                        </button>
                      )}
                      {user.role !== 'socio' && (
                        <button className="btn-role btn-role-socio" onClick={() => handleChangeUserRole(user.id, 'socio')}>
                          Socio
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button className="btn-role btn-role-admin" onClick={() => handleChangeUserRole(user.id, 'admin')}>
                          Admin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
