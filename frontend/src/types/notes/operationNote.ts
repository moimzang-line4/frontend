export type NoteType = 'general' | 'todo' | 'decision' | 'idea'
export type OperationNote = {
  id: string
  scheduleId: string
  type: NoteType
  title: string
  assignee: string
  content: string
  createdAt: string
  updatedAt: string
}
export type OperationNoteInput = Pick<OperationNote, 'type' | 'title' | 'assignee' | 'content'>
