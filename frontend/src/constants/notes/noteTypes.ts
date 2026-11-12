import type { NoteType } from '../../types/notes/operationNote'

export const noteTypes: { value: NoteType; label: string; color: string; background: string }[] = [
  { value: 'general', label: '일반 메모', color: '#78918c', background: '#f0f3f2' },
  { value: 'todo', label: '할 일', color: '#a15b31', background: '#ffebde' },
  { value: 'decision', label: '결정 사항', color: '#367d70', background: '#e4f3ea' },
  { value: 'idea', label: '아이디어', color: '#78918c', background: '#f0f3f2' },
]
export function noteTypeInfo(value: NoteType) { return noteTypes.find(type => type.value === value)! }
