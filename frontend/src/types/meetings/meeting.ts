export type MeetingStatus = 'draft' | 'in-progress' | 'completed'
export type MeetingAgenda = {
  id: string
  preparation: string
  discussion: string
  decision: string
  completed: boolean
}
export type Meeting = {
  id: string
  title: string
  content: string
  scheduleIds: string[]
  date: string
  createdAt: string
  updatedAt?: string
  categoryName: string
  participants: string
  status: MeetingStatus
  agendas: MeetingAgenda[]
  activeAgendaId: string
}
export type MeetingInput = Pick<Meeting, 'title' | 'date' | 'categoryName' | 'participants' | 'agendas'>
