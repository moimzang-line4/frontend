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
  function linkMany(ids: readonly string[]) {
    if (!scheduleId) throw new Error('연결할 일정을 찾을 수 없어요.')
    const selected = new Set(ids)
    const current = getMeetings()
    if ([...selected].some(id => !current.some(item => item.id === id))) throw new Error('선택한 회의록이 삭제되었어요. 목록을 다시 확인해주세요.')
    if (!selected.size) return
    saveMeetings(current.map(item => selected.has(item.id) && !item.scheduleIds.includes(scheduleId) ? { ...item, scheduleIds: [...item.scheduleIds, scheduleId] } : item))
  }
  function link(id: string) { linkMany([id]) }
  function unlink(id: string) {
    if (!scheduleId) return
    saveMeetings(getMeetings().map(item => item.id === id ? { ...item, scheduleIds: item.scheduleIds.filter(value => value !== scheduleId) } : item))
  }
  return { minutes, linked: minutes.filter(item => scheduleId && item.scheduleIds.includes(scheduleId)), available: minutes.filter(item => !scheduleId || !item.scheduleIds.includes(scheduleId)), create, link, linkMany, unlink }
}
