import { useSyncExternalStore } from 'react'
import type { Meeting, MeetingAgenda, MeetingInput } from '../../types/meetings/meeting'
import { agendaContent, getMeetings, saveMeetings, subscribeMeetings } from '../../utils/meetings/store'

function change(id: string, update: (meeting: Meeting) => Meeting) {
  if (!getMeetings().some(item => item.id === id)) throw new Error('회의록을 찾을 수 없어요.')
  saveMeetings(getMeetings().map(item => item.id === id ? { ...update(item), updatedAt: new Date().toISOString() } : item))
}
export function startMeeting(id: string) { change(id, item => ({ ...item, status: item.status === 'completed' ? 'completed' : 'in-progress' })) }

export default function useMeetings() {
  const meetings = useSyncExternalStore(subscribeMeetings, getMeetings)
  function create(input: MeetingInput) {
    const item: Meeting = { ...input, id: crypto.randomUUID(), content: agendaContent(input.agendas), scheduleIds: [],
      createdAt: new Date().toISOString(), status: 'draft', activeAgendaId: input.agendas[0].id }
    saveMeetings([...getMeetings(), item])
    return item
  }
  function update(id: string, input: MeetingInput) {
    change(id, item => ({ ...item, ...input, content: agendaContent(input.agendas),
      activeAgendaId: input.agendas.some(agenda => agenda.id === item.activeAgendaId) ? item.activeAgendaId : input.agendas[0].id }))
  }
  function remove(id: string) { saveMeetings(getMeetings().filter(item => item.id !== id)) }

  function saveAgenda(id: string, agenda: MeetingAgenda) {
    change(id, item => {
      const agendas = item.agendas.map(value => value.id === agenda.id ? agenda : value)
      return { ...item, agendas, content: agendaContent(agendas) }
    })
  }
  function selectAgenda(id: string, agendaId: string) { change(id, item => ({ ...item, activeAgendaId: agendaId })) }
  function completeAgenda(id: string, agenda: MeetingAgenda) {
    change(id, item => {
      const agendas = item.agendas.map(value => value.id === agenda.id ? { ...agenda, completed: true } : value)
      const next = agendas.find(value => !value.completed)
      return { ...item, agendas, content: agendaContent(agendas), activeAgendaId: next?.id ?? agenda.id, status: next ? 'in-progress' : 'completed' }
    })
  }
  return { meetings, create, update, remove, start: startMeeting, saveAgenda, selectAgenda, completeAgenda }
}
