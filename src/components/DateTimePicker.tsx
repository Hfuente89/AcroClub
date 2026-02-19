import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './DateTimePicker.css'

interface DateTimePickerProps {
  value: string // datetime-local format: "2026-02-19T18:30"
  onChange: (value: string) => void
}

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Parse current value
  const parsed = value ? new Date(value) : null
  const selectedDate = parsed && !isNaN(parsed.getTime()) ? parsed : null

  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth())

  const selectedHour = selectedDate ? String(selectedDate.getHours()).padStart(2, '0') : '10'
  const selectedMinute = selectedDate ? String(selectedDate.getMinutes()).padStart(2, '0') : '00'

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0)
    // Monday = 0, Sunday = 6
    let startDow = firstDay.getDay() - 1
    if (startDow < 0) startDow = 6

    const days: (number | null)[] = []
    for (let i = 0; i < startDow; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
    return days
  }, [viewYear, viewMonth])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  const selectDay = (day: number) => {
    const h = selectedHour
    const m = selectedMinute
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${h}:${m}`
    onChange(dateStr)
  }

  const changeTime = (h: string, m: string) => {
    if (!selectedDate) {
      // If no date selected, select today
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T${h}:${m}`
      onChange(dateStr)
    } else {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}T${h}:${m}`
      onChange(dateStr)
    }
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
  }

  const isToday = (day: number) => {
    return today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
  }

  // Generate hour options
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = ['00', '15', '30', '45']

  return (
    <div className="dtp-container">
      <div className="dtp-calendar">
        <div className="dtp-nav">
          <button type="button" className="dtp-nav-btn" onClick={prevMonth}>
            <ChevronLeft size={18} />
          </button>
          <span className="dtp-month-label">
            {MONTHS_ES[viewMonth]} {viewYear}
          </span>
          <button type="button" className="dtp-nav-btn" onClick={nextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="dtp-weekdays">
          {DAYS_ES.map(d => <span key={d} className="dtp-weekday">{d}</span>)}
        </div>
        <div className="dtp-days">
          {calendarDays.map((day, i) => (
            day === null ? (
              <span key={`e-${i}`} className="dtp-day-empty" />
            ) : (
              <button
                key={day}
                type="button"
                className={`dtp-day${isSelected(day) ? ' selected' : ''}${isToday(day) ? ' today' : ''}`}
                onClick={() => selectDay(day)}
              >
                {day}
              </button>
            )
          ))}
        </div>
      </div>

      <div className="dtp-time">
        <span className="dtp-time-label">Hora</span>
        <div className="dtp-time-selects">
          <select
            className="dtp-select"
            value={selectedHour}
            onChange={(e) => changeTime(e.target.value, selectedMinute)}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <span className="dtp-time-sep">:</span>
          <select
            className="dtp-select"
            value={selectedMinute}
            onChange={(e) => changeTime(selectedHour, e.target.value)}
          >
            {minutes.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedDate && (
        <div className="dtp-summary">
          {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} a las {selectedHour}:{selectedMinute}
        </div>
      )}
    </div>
  )
}
