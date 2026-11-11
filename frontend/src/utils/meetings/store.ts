import type { Meeting, MeetingAgenda, MeetingStatus } from '../../types/meetings/meeting'

const storageKey = 'moimzang.schedule.minutes.v1'
const changeEvent = 'moimzang:minutes-changed'
export function meetingToday(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function newAgenda(): MeetingAgenda {
  return { id: crypto.randomUUID(), preparation: '', discussion: '', decision: '', completed: false }
}
function isAgenda(value: unknown): value is MeetingAgenda {
  if (!value || typeof value !== 'object') return false
  const agenda = value as MeetingAgenda
  return typeof agenda.id === 'string' && typeof agenda.preparation === 'string'
    && typeof agenda.discussion === 'string' && typeof agenda.decision === 'string' && typeof agenda.completed === 'boolean'
}
function read(): Meeting[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(saved)) return []
    return saved.flatMap(value => {
      if (!value || typeof value !== 'object') return []
      const item = value as Record<string, unknown>
      if (typeof item.id !== 'string' || typeof item.title !== 'string' || typeof item.content !== 'string'
        || !Array.isArray(item.scheduleIds) || !item.scheduleIds.every(id => typeof id === 'string')) return []
      const date = typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? item.date : meetingToday()
      const agendas = Array.isArray(item.agendas) && item.agendas.length && item.agendas.every(isAgenda)
        ? item.agendas : [{ id: `${item.id}-agenda`, preparation: item.content.slice(0, 100), discussion: item.content.length > 100 ? item.content : '', decision: '', completed: false }]
      const status: MeetingStatus = item.status === 'in-progress' || item.status === 'completed' ? item.status : 'draft'
      return [{ ...item, id: item.id, title: item.title, content: item.content, scheduleIds: item.scheduleIds,
        date, createdAt: typeof item.createdAt === 'string' ? item.createdAt : `${date}T00:00:00`,
        categoryName: typeof item.categoryName === 'string' ? item.categoryName : '', participants: typeof item.participants === 'string' ? item.participants : '',
        status, agendas, activeAgendaId: typeof item.activeAgendaId === 'string' && agendas.some(agenda => agenda.id === item.activeAgendaId) ? item.activeAgendaId : agendas[0].id,
      } as Meeting]
    })
  } catch { return [] }
}
let snapshot = read()
export const getMeetings = () => snapshot
export function subscribeMeetings(listener: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) { snapshot = read(); listener() }
  }
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', storage)
  return () => { window.removeEventListener(changeEvent, listener); window.removeEventListener('storage', storage) }
}
export function saveMeetings(next: Meeting[]) {
  localStorage.setItem(storageKey, JSON.stringify(next))
  snapshot = next
  window.dispatchEvent(new Event(changeEvent))
}
export function agendaContent(agendas: MeetingAgenda[]) {
  return agendas.map((agenda, index) => [`안건 ${index + 1}`, agenda.preparation, agenda.discussion && `논의: ${agenda.discussion}`, agenda.decision && `결정: ${agenda.decision}`].filter(Boolean).join('\n')).join('\n\n')
}
export function meetingFinished(meeting: Pick<Meeting, 'date' | 'status'>, today: string) {
  return meeting.status === 'completed' || meeting.date < today
}

export function meetingListPath(meeting?: Pick<Meeting, 'date' | 'status'>) {
  const today = meetingToday()
  const params = new URLSearchParams({ type: 'minute' })
  if (meeting && meetingFinished(meeting, today)) params.set('period', 'past')
  if (meeting && meeting.date.slice(0, 4) !== today.slice(0, 4)) params.set('year', meeting.date.slice(0, 4))
  return `/operations?${params}`
}
