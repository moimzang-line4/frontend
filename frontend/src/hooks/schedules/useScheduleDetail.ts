import { useParams } from 'react-router'
import { useState } from 'react'
import useSchedules from './useSchedules'

export default function useScheduleDetail() {
  const [today] = useState(() => new Date())
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const { schedules } = useSchedules()
  const schedule = schedules.find(item => item.id === scheduleId)
  let countdown = ''
  if (schedule) {
    const [year, month, day] = schedule.date.split('-').map(Number)
    const days = Math.round((Date.UTC(year, month - 1, day) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000)
    countdown = days === 0 ? 'D-DAY' : days > 0 ? `D-${days}` : `D+${Math.abs(days)}`
  }
  return { schedule, countdown }
}
