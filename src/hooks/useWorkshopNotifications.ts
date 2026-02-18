import { useEffect, useRef } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export const useWorkshopNotifications = () => {
  const unsubscribeRef = useRef<any>(null)

  useEffect(() => {
    // Initialize real-time listener for new workshops and trainings
    const subscribeToWorkshops = () => {
      const client = getSupabaseClient()

      // Subscribe to workshops changes
      const workshopsSubscription = client
        .channel('public:workshops')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'workshops',
          },
          (payload: any) => {
            handleNewWorkshop(payload.new)
          }
        )
        .subscribe()

      // Subscribe to trainings changes
      const trainingsSubscription = client
        .channel('public:trainings')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'trainings',
          },
          (payload: any) => {
            handleNewTraining(payload.new)
          }
        )
        .subscribe()

      // Store reference to unsubscribe later
      unsubscribeRef.current = async () => {
        await client.removeChannel(workshopsSubscription)
        await client.removeChannel(trainingsSubscription)
      }
    }

    subscribeToWorkshops()

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  const handleNewWorkshop = (workshop: any) => {
    sendNotification({
      title: workshop.title || 'Nuevo taller',
      body: `📋 Nuevo taller disponible: ${workshop.title}`,
      date: workshop.date,
      location: workshop.location,
    })
  }

  const handleNewTraining = (training: any) => {
    sendNotification({
      title: training.title || 'Nuevo entrenamiento',
      body: `🏋️ Nuevo entrenamiento disponible: ${training.title}`,
      date: training.date,
      location: training.location,
    })
  }

  const sendNotification = async (data: any) => {
    // Check if service worker is available
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready

      // Send notification through service worker
      if (registration.active) {
        // Use postMessage to send data to service worker
        registration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          data: {
            title: data.title,
            body: data.body,
            tag: 'new-workshop',
            requireInteraction: true,
            actions: [
              { action: 'open', title: 'Ver' },
              { action: 'close', title: 'Descartar' }
            ]
          }
        })

        // Also show via push (if push service available)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🤸 Acroyoga Club - ${data.title}`, {
            body: data.body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23ec4899" width="192" height="192"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120" fill="white" font-family="system-ui">🤸</text></svg>',
            tag: 'new-workshop',
            requireInteraction: true,
          })
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }
}
