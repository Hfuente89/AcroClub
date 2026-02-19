import { Check, Calendar, Info } from 'lucide-react'
import './WorkshopCard.css'

interface WorkshopCardProps {
  title: string
  description: string
  date: string
  isRegistered: boolean
  isGuest: boolean
  onRegister: () => void
  onViewDetails?: () => void
}

export default function WorkshopCard({
  title,
  description,
  date,
  isRegistered,
  isGuest,
  onRegister,
  onViewDetails
}: WorkshopCardProps) {
  return (
    <div className="workshop-card">
      <div className="card-header">
        <h3>{title}</h3>
        {isRegistered && <span className="badge-registered"><Check size={16} /> Registrado</span>}
      </div>

      <p className="card-description">{description}</p>

      <div className="card-footer">
        <div className="card-date"><Calendar size={16} /> {date}</div>

        <div className="card-buttons">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="card-button-secondary"
              title="Ver detalles"
            >
              <Info size={16} /> Detalles
            </button>
          )}

          <button
            onClick={onRegister}
            className={`card-button ${isRegistered ? 'registered' : ''}`}
            disabled={isRegistered}
          >
            {isRegistered ? 'Registrado' : 'Registrarse'}
          </button>
        </div>
      </div>
    </div>
  )
}
