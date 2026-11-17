import type { MeetingAgendaDetailResponse } from '../../api/models/meetingAgendaDetailResponse'

// The API has no startedAt flag: retain even an edit that was later cleared locally.
const eventName = 'moimzang-meeting-started'
const memory = new Set<number>()
const key = (id: number) => `moimzang.meeting-started.v1.${id}`

export function hasStartedLocally(id: number) {
  try {
    return memory.has(id) || localStorage.getItem(key(id)) === 'true'
  } catch {
    return memory.has(id)
  }
}

export function markMeetingStarted(id: number) {
  if (hasStartedLocally(id)) return
  memory.add(id)
  try {
    localStorage.setItem(key(id), 'true')
  } catch {
    /* Keep the session marker. */
  }
  window.dispatchEvent(new Event(eventName))
}

export function subscribeMeetingStarted(listener: () => void) {
  window.addEventListener(eventName, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(eventName, listener)
    window.removeEventListener('storage', listener)
  }
}

export function hasServerProgress(agendas: MeetingAgendaDetailResponse[]) {
  return agendas.some(
    agenda =>
      agenda.status === 'IN_PROGRESS' ||
      agenda.status === 'COMPLETED' ||
      !!agenda.discussionNote ||
      !!agenda.decision,
  )
}
