import type { Meeting, MeetingAgenda } from '../../types/meetings/meeting'

export function agendaTitle(agenda: MeetingAgenda) {
  return agenda.title?.trim() || agenda.preparation.split('\n').find(line => line.trim())?.trim() || '제목 없는 안건'
}
export function agendaKey(meetingId: string, agendaId: string) { return JSON.stringify([meetingId, agendaId]) }
export function meetingAgendas(meetings: Meeting[]) {
  return meetings.flatMap(meeting => meeting.agendas.map((agenda, index) => ({ meeting, agenda, index })))
}
