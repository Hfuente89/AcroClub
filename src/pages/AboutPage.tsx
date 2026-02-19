import { MapPin, Clock, Users } from 'lucide-react'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>Sobre Nosotros</h1>

        <div className="about-card">
          <div className="about-icon"><Users size={32} /></div>
          <h2>¿Quiénes somos?</h2>
          <p>
            Somos un club autogestionado de acroyoga en Valencia. Nos apasiona esta disciplina que combina
            acrobacia, yoga y masaje tailandés, y queremos compartirla con todo el mundo.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon"><Clock size={32} /></div>
          <h2>¿Cuándo entrenamos?</h2>
          <p>
            Nos reunimos cada miércoles de <strong>19:30 a 21:30</strong>.
            Consulta el calendario de la app para ver los próximos talleres y entrenos libres.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon"><MapPin size={32} /></div>
          <h2>¿Dónde estamos?</h2>
          <p>
            Entrenamos en{' '}
            <a
              href="https://maps.app.goo.gl/mGL7kKMcHq5uHNMB8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pina Submarina
            </a>
            , Valencia.
          </p>
        </div>
      </div>
    </div>
  )
}
