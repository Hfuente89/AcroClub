import { useEffect, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import './InstagramFeed.css'

const INSTAGRAM_USER = 'acroyoga_clubvalencia'
const PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_USER}/`

// Recent post URLs to embed (update these periodically or manage from admin)
const EMBED_POSTS = [
  `https://www.instagram.com/${INSTAGRAM_USER}/`,
]

export default function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)

    // Process embeds when script loads
    script.onload = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process()
      }
    }

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="ig-feed" ref={containerRef}>
      {/* Profile header card */}
      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="ig-profile-card"
      >
        <div className="ig-profile-avatar">
          <svg viewBox="0 0 24 24" fill="none" className="ig-icon">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <div className="ig-profile-info">
          <span className="ig-profile-name">@{INSTAGRAM_USER}</span>
          <span className="ig-profile-desc">Talleres, entrenamientos y noticias del club</span>
        </div>
        <ExternalLink size={18} className="ig-profile-arrow" />
      </a>

      {/* Embedded profile */}
      <div className="ig-embed-wrapper">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={PROFILE_URL}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: 0,
            borderRadius: '12px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '0 auto',
            maxWidth: '540px',
            minWidth: '280px',
            padding: 0,
            width: '100%'
          }}
        >
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <div className="ig-loading-spinner" />
            <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '12px' }}>
              Cargando Instagram...
            </p>
          </div>
        </blockquote>
      </div>

      {/* CTA button */}
      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="ig-follow-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
        </svg>
        Seguir en Instagram
      </a>
    </div>
  )
}
