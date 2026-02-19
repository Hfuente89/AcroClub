import { Phone, MessageCircle, Mail } from 'lucide-react'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contacto</h1>

        <div className="contact-card">
          <div className="contact-icon"><MessageCircle size={32} /></div>
          <h2>WhatsApp</h2>
          <p>Si quieres contactar con nosotros, puedes escribir a Marcin por WhatsApp:</p>
          <a
            href="https://wa.me/34608739232"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link whatsapp"
          >
            <Phone size={18} />
            +34 608 73 92 32
          </a>
        </div>

        <div className="contact-card">
          <div className="contact-icon"><Mail size={32} /></div>
          <h2>Redes sociales</h2>
          <p>Síguenos en Instagram para estar al día de talleres y actividades:</p>
          <a
            href="https://www.instagram.com/acroyoga_clubvalencia/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link instagram"
          >
            📸 @acroyoga_clubvalencia
          </a>
        </div>
      </div>
    </div>
  )
}
