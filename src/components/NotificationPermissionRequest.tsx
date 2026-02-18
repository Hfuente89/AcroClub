import { useEffect, useState } from 'react'

export default function NotificationPermissionRequest() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isGranted, setIsGranted] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('Notifications not supported')
      return
    }

    // Check current permission
    if (Notification.permission === 'granted') {
      setIsGranted(true)
    } else if (Notification.permission === 'default') {
      // Show prompt to request permission
      setShowPrompt(true)
    }
  }, [])

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setIsGranted(true)
        setShowPrompt(false)
      } else {
        setShowPrompt(false)
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  if (!showPrompt || isGranted) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: '#ec4899',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    }}>
      <span style={{ flex: 1, marginRight: '15px' }}>
        🔔 Recibe notificaciones de nuevos talleres
      </span>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={requestPermission}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#ec4899',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
          }}>
          Activar
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}>
          Más tarde
        </button>
      </div>
    </div>
  )
}
