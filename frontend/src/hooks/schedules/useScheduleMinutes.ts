import { useSyncExternalStore } from 'react'
import type { Meeting } from '../../types/meetings/meeting'
import { getMeetings, meetingToday, newAgenda, saveMeetings, subscribeMeetings } from '../../utils/meetings/store'

export default function useScheduleMinutes(scheduleId?: string) {
  const minutes = useSyncExternalStore(subscribeMeetings, getMeetings)
  function create(title: string, content: string) {
    const agenda = { ...newAgenda(), preparation: content.trim().slice(0, 100), discussion: content.trim().length > 100 ? content.trim() : '' }
    const item: Meeting = { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), scheduleIds: scheduleId ? [scheduleId] : [], date: meetingToday(), createdAt: new Date().toISOString(), categoryName: '', participants: '', status: 'draft', agendas: [agenda], activeAgendaId: agenda.id }
    saveMeetings([...getMeetings(), item])
    return item
  }
  function link(id: string) {
    if (!scheduleId) return
    saveMeetings(getMeetings().map(item => item.id === id && !item.scheduleIds.includes(scheduleId) ? { ...item, scheduleIds: [...item.scheduleIds, scheduleId] } : item))
  }
  function unlink(id: string) {
    if (!scheduleId) return
    saveMeetings(getMeetings().map(item => item.id === id ? { ...item, scheduleIds: item.scheduleIds.filter(value => value !== scheduleId) } : item))
  }
  return { minutes, linked: minutes.filter(item => scheduleId && item.scheduleIds.includes(scheduleId)), available: minutes.filter(item => !scheduleId || !item.scheduleIds.includes(scheduleId)), create, link, unlink }
}
