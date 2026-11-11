import { useState } from 'react'

import type { ScheduleMinute } from '../../types/schedules/schedule'
const storageKey = 'moimzang.schedule.minutes.v1'
function readMinutes(): ScheduleMinute[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (Array.isArray(data)) return data.filter((item): item is ScheduleMinute => item
      && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.content === 'string'
      && (item.date === undefined || (typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)))
      && Array.isArray(item.scheduleIds) && item.scheduleIds.every((id: unknown) => typeof id === 'string'))
  } catch { /* Render the empty state if no records are available. */ }
  return []
}
export default function useScheduleMinutes(scheduleId?: string) {
  const [minutes, setMinutes] = useState(readMinutes)
  function save(next: ScheduleMinute[]) {
    localStorage.setItem(storageKey, JSON.stringify(next))
    setMinutes(next)
  }
  function create(title: string, content: string) {
    const now = new Date()
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const item: ScheduleMinute = { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), scheduleIds: scheduleId ? [scheduleId] : [], date }
    save([...minutes, item])
    return item
  }
  function link(id: string) {
    if (!scheduleId) return
    save(minutes.map(item => item.id === id && !item.scheduleIds.includes(scheduleId) ? { ...item, scheduleIds: [...item.scheduleIds, scheduleId] } : item))
  }
  return { minutes, linked: minutes.filter(item => scheduleId && item.scheduleIds.includes(scheduleId)), available: minutes.filter(item => !scheduleId || !item.scheduleIds.includes(scheduleId)), create, link }
}
