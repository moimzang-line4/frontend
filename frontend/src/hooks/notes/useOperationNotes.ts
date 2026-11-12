import { useSyncExternalStore } from 'react'
import { noteTypes } from '../../constants/notes/noteTypes'
import type { OperationNote, OperationNoteInput } from '../../types/notes/operationNote'

const storageKey = 'moimzang.schedule.operation-notes.v1'
const changeEvent = 'moimzang:operation-notes-changed'
function isNote(value: unknown): value is OperationNote {
  if (!value || typeof value !== 'object') return false
  const item = value as OperationNote
  return typeof item.id === 'string' && typeof item.scheduleId === 'string' && noteTypes.some(type => type.value === item.type)
    && typeof item.title === 'string' && typeof item.assignee === 'string' && typeof item.content === 'string'
    && typeof item.createdAt === 'string' && Number.isFinite(Date.parse(item.createdAt))
    && typeof item.updatedAt === 'string' && Number.isFinite(Date.parse(item.updatedAt))
}
function read(): OperationNote[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(saved) ? saved.filter(isNote) : []
  } catch { return [] }
}
let snapshot = read()
const getSnapshot = () => snapshot
function subscribe(listener: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) { snapshot = read(); listener() }
  }
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', storage)
  return () => { window.removeEventListener(changeEvent, listener); window.removeEventListener('storage', storage) }
}
function save(next: OperationNote[]) {
  try { localStorage.setItem(storageKey, JSON.stringify(next)) }
  catch { throw new Error('메모를 저장하지 못했어요. 브라우저 저장 공간을 확인해주세요.') }
  snapshot = next
  window.dispatchEvent(new Event(changeEvent))
}
function validate(input: OperationNoteInput) {
  const values = { ...input, title: input.title.trim(), assignee: input.assignee.trim(), content: input.content.trim() }
  if (!noteTypes.some(type => type.value === values.type) || !values.title || !values.content) throw new Error('메모 유형, 제목과 내용을 입력해주세요.')
  if (values.title.length > 80 || values.content.length > 100 || values.assignee.length > 100) throw new Error('입력 가능한 글자 수를 확인해주세요.')
  return values
}
export default function useOperationNotes(scheduleId: string) {
  const allNotes = useSyncExternalStore(subscribe, getSnapshot)
  const notes = allNotes.filter(item => item.scheduleId === scheduleId)
  function create(input: OperationNoteInput) {
    const values = validate(input)
    const now = new Date().toISOString()
    const item: OperationNote = { ...values, id: crypto.randomUUID(), scheduleId, createdAt: now, updatedAt: now }
    save([...snapshot, item])
    return item
  }
  function update(id: string, input: OperationNoteInput) {
    const values = validate(input)
    if (!snapshot.some(item => item.id === id && item.scheduleId === scheduleId)) throw new Error('메모를 찾을 수 없어요.')
    save(snapshot.map(item => item.id === id && item.scheduleId === scheduleId ? { ...item, ...values, updatedAt: new Date().toISOString() } : item))
  }
  function remove(id: string) {
    if (!snapshot.some(item => item.id === id && item.scheduleId === scheduleId)) throw new Error('메모를 찾을 수 없어요.')
    save(snapshot.filter(item => item.id !== id || item.scheduleId !== scheduleId))
  }
  return { notes, create, update, remove }
}
