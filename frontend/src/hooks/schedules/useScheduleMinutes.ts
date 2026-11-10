import { useState } from 'react'

import type { ScheduleMinute } from '../../types/schedules/schedule'
const storageKey = 'moimzang.schedule.minutes.v1'
function readMinutes(): ScheduleMinute[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (Array.isArray(data)) return data.filter((item): item is ScheduleMinute => item
      && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.content === 'string'
      && Array.isArray(item.scheduleIds) && item.scheduleIds.every((id: unknown) => typeof id === 'string'))
  } catch { /* Render the empty state if no records are available. */ }
  return []
}
export default function useScheduleMinutes(scheduleId: string) {
  const [minutes, setMinutes] = useState(readMinutes)
  function save(next: ScheduleMinute[]) {
    localStorage.setItem(storageKey, JSON.stringify(next))
    setMinutes(next)
  }
  function create(title: string, content: string) {
    const item: ScheduleMinute = { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), scheduleIds: [scheduleId] }
    save([...minutes, item])
  }
  function link(id: string) {
    save(minutes.map(item => item.id === id && !item.scheduleIds.includes(scheduleId) ? { ...item, scheduleIds: [...item.scheduleIds, scheduleId] } : item))
  }
  return { linked: minutes.filter(item => item.scheduleIds.includes(scheduleId)), available: minutes.filter(item => !item.scheduleIds.includes(scheduleId)), create, link }
}
