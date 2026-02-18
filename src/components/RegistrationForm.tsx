import { useState } from 'react'
import './RegistrationForm.css'

interface FormQuestion {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'radio'
  required: boolean
  options?: string[]
}

interface RegistrationFormProps {
  item: any
  formQuestions: FormQuestion[]
  onSubmit: (data: any) => void
  onClose: () => void
}

export default function RegistrationForm({
  item,
  formQuestions,
  onSubmit,
  onClose
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (questionId: string, value: any) => {
    setFormData({
      ...formData,
      [questionId]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registro al Taller</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3>{item.title || 'Entrenamiento'}</h3>
            <p className="workshop-info">
              📅 {new Date(item.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="questions-container">
            {formQuestions.map(question => (
              <div key={question.id} className="form-group">
                <label htmlFor={`q_${question.id}`}>
                  {question.label}
                  {question.required && <span className="required">*</span>}
                </label>

                {question.type === 'text' && (
                  <input
                    id={`q_${question.id}`}
                    type="text"
                    value={formData[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required={question.required}
                  />
                )}

                {question.type === 'email' && (
                  <input
                    id={`q_${question.id}`}
                    type="email"
                    value={formData[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required={question.required}
                  />
                )}

                {question.type === 'tel' && (
                  <input
                    id={`q_${question.id}`}
                    type="tel"
                    value={formData[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required={question.required}
                  />
                )}

                {question.type === 'select' && (
                  <select
                    id={`q_${question.id}`}
                    value={formData[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required={question.required}
                  >
                    <option value="">Selecciona una opción</option>
                    {question.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {question.type === 'radio' && (
                  <div className="radio-group">
                    {question.options?.map(opt => (
                      <label key={opt} className="radio-label">
                        <input
                          type="radio"
                          name={`q_${question.id}`}
                          value={opt}
                          checked={formData[question.id] === opt}
                          onChange={(e) => handleChange(question.id, e.target.value)}
                          required={question.required}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
