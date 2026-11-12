import { useSyncExternalStore } from 'react'
import type { Meeting, MeetingLinkSelection } from '../../types/meetings/meeting'
import { getMeetings, meetingToday, newAgenda, saveMeetings, subscribeMeetings } from '../../utils/meetings/store'

export default function useScheduleMinutes(scheduleId?: string) {
  const minutes = useSyncExternalStore(subscribeMeetings, getMeetings)
  function create(title: string, content: string) {
    const agenda = { ...newAgenda(), preparation: content.trim().slice(0, 100), discussion: content.trim().length > 100 ? content.trim() : '' }
    const item: Meeting = { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), scheduleIds: scheduleId ? [scheduleId] : [], date: meetingToday(), createdAt: new Date().toISOString(), categoryName: '', participants: '', status: 'draft', agendas: [agenda], activeAgendaId: agenda.id }
    saveMeetings([...getMeetings(), item])
    return item
  }
  function linkSelection(selection: MeetingLinkSelection) {
    if (!scheduleId) throw new Error('연결할 일정을 찾을 수 없어요.')
    const current = getMeetings()
    const meetingIds = new Set(selection.meetingIds)
    if ([...meetingIds].some(id => !current.some(item => item.id === id))
      || selection.agendas.some(ref => !current.some(item => item.id === ref.meetingId && item.agendas.some(agenda => agenda.id === ref.agendaId)))) {
      throw new Error('선택한 회의록 또는 안건이 삭제되었어요. 목록을 다시 확인해주세요.')
    }
    if (!meetingIds.size && !selection.agendas.length) return
    saveMeetings(current.map(item => ({ ...item,
      scheduleIds: meetingIds.has(item.id) && !item.scheduleIds.includes(scheduleId) ? [...item.scheduleIds, scheduleId] : item.scheduleIds,
      agendas: item.agendas.map(agenda => selection.agendas.some(ref => ref.meetingId === item.id && ref.agendaId === agenda.id)
        && !agenda.scheduleIds?.includes(scheduleId) ? { ...agenda, scheduleIds: [...(agenda.scheduleIds ?? []), scheduleId] } : agenda),
    })))
  }
  function linkMany(ids: readonly string[]) { linkSelection({ meetingIds: [...ids], agendas: [] }) }
  function link(id: string) { linkMany([id]) }
  function unlinkAgenda(meetingId: string, agendaId: string) {
    if (!scheduleId) return
    saveMeetings(getMeetings().map(item => item.id === meetingId ? { ...item, agendas: item.agendas.map(agenda => agenda.id === agendaId
      ? { ...agenda, scheduleIds: (agenda.scheduleIds ?? []).filter(id => id !== scheduleId) } : agenda) } : item))
  }
  function unlink(id: string) {
    if (!scheduleId) return
    saveMeetings(getMeetings().map(item => item.id === id ? { ...item, scheduleIds: item.scheduleIds.filter(value => value !== scheduleId) } : item))
  }
  return { minutes, linked: minutes.filter(item => scheduleId && item.scheduleIds.includes(scheduleId)), available: minutes.filter(item => !scheduleId || !item.scheduleIds.includes(scheduleId)), create, link, linkMany, linkSelection, unlink, unlinkAgenda }
}
