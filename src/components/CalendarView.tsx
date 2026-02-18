import { useState, useEffect } from 'react'
import './CalendarView.css'

interface Activity {
  id: string
  title?: string
  description?: string
  date: string
  type: 'workshop' | 'training'
}

interface CalendarViewProps {
  workshops: any[]
  trainings: any[]
  onActivityClick: (activity: Activity) => void
}

export default function CalendarView({ workshops, trainings, onActivityClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<any[]>([])

  useEffect(() => {
    generateCalendar()
  }, [currentDate, workshops, trainings])

  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1)
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0)
    
    // Día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const startDay = firstDay.getDay()
    // Ajustar para que lunes sea 0
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1
    
    const days = []
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      })
    }
    
    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      
      // Buscar actividades en este día
      const dayActivities = getActivitiesForDay(date)
      
      days.push({
        day,
        isCurrentMonth: true,
        date,
        activities: dayActivities
      })
    }
    
    // Días del mes siguiente
    const remainingDays = 42 - days.length // 6 semanas * 7 días
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      })
    }
    
    setCalendarDays(days)
  }

  const getActivitiesForDay = (date: Date): Activity[] => {
    const activities: Activity[] = []
    
    // Buscar talleres
    workshops.forEach(workshop => {
      const workshopDate = new Date(workshop.date)
      if (isSameDay(workshopDate, date)) {
        activities.push({
          id: workshop.id,
          title: workshop.title,
          description: workshop.description,
          date: workshop.date,
          type: 'workshop'
        })
      }
    })
    
    // Buscar entrenamientos
    trainings.forEach(training => {
      const trainingDate = new Date(training.date)
      if (isSameDay(trainingDate, date)) {
        activities.push({
          id: training.id,
          title: 'Entrenamiento',
          description: 'Sesión de entrenamiento grupal',
          date: training.date,
          type: 'training'
        })
      }
    })
    
    return activities
  }

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="nav-button">←</button>
        <div className="current-month">
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={goToToday} className="today-button">Hoy</button>
        </div>
        <button onClick={goToNextMonth} className="nav-button">→</button>
      </div>

      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-dot workshop"></span> Talleres
        </span>
        <span className="legend-item">
          <span className="legend-dot training"></span> Entrenamientos
        </span>
      </div>

      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
        
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={`calendar-day ${!dayInfo.isCurrentMonth ? 'other-month' : ''} ${
              isSameDay(dayInfo.date, new Date()) ? 'today' : ''
            }`}
          >
            <div className="day-number">{dayInfo.day}</div>
            {dayInfo.activities && dayInfo.activities.length > 0 && (
              <div className="day-activities">
                {dayInfo.activities.map((activity: Activity) => (
                  <div
                    key={activity.id}
                    className={`activity-indicator ${activity.type}`}
                    onClick={() => onActivityClick(activity)}
                    title={activity.title}
                  >
                    <span className="activity-time">
                      {new Date(activity.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
