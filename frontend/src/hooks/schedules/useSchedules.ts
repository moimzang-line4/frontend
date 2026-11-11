import { useSyncExternalStore } from 'react'
import { reconcileLegacyDemoSchedules } from '../../utils/schedules'
import type { Schedule, NewSchedule, ScheduleCategory } from '../../types/schedules/schedule'

const storageKey = 'moimzang.home.schedules.v1'
const changeEvent = 'moimzang:schedules-changed'
const categories: ScheduleCategory[] = ['meeting', 'session', 'performance', 'newcomer', 'afterparty', 'custom']
const sampleSchedules: Schedule[] = [
  { id: 'meeting', title: '정기회의', date: '2026-11-05', category: 'meeting', calendarLabel: '정기회의' },
  { id: 'session-1', title: '세션', date: '2026-11-08', category: 'session', calendarLabel: '세션' },
  { id: 'session-2', title: '세션', date: '2026-11-08', category: 'session', calendarLabel: '세션' },
  { id: 'autumn-1', title: '가을 정기공연', date: '2026-11-14', category: 'performance', calendarLabel: '가을 정기공연', venue: '얼라이브홀', operationMenuCount: 4 },
  { id: 'newcomer', title: '신입공연', date: '2026-11-22', category: 'newcomer', calendarLabel: '신입공연', operationMenuCount: 4 },
]

function isSchedule(value: unknown): value is Schedule {
  if (!value || typeof value !== 'object') return false
  const item = value as Schedule
  return typeof item.id === 'string' && typeof item.title === 'string'
    && typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
    && categories.includes(item.category)
    && (item.createdAt === undefined || typeof item.createdAt === 'string')
    && (item.calendarLabel === undefined || typeof item.calendarLabel === 'string')
    && (item.venue === undefined || typeof item.venue === 'string')
    && (item.operationMenuCount === undefined || typeof item.operationMenuCount === 'number')
}

function readSchedules(): Schedule[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (Array.isArray(saved) && saved.every(isSchedule)) return reconcileLegacyDemoSchedules(saved)
  } catch { /* Storage can be unavailable or contain old data. */ }
  return sampleSchedules
}

let snapshot = readSchedules()
const getSnapshot = () => snapshot

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
      snapshot = readSchedules()
      listener()
    }
  }
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(changeEvent, listener)
    window.removeEventListener('storage', onStorage)
  }
}

export default function useSchedules() {
  const schedules = useSyncExternalStore(subscribe, getSnapshot)
  function addSchedule(input: NewSchedule) {
    const { createOperationSpace, ...values } = input
    const item: Schedule = {
      ...values,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      calendarLabel: input.title,
      ...(createOperationSpace ? { operationMenuCount: 0 } : {}),
    }
    const next = [...snapshot, item]
    localStorage.setItem(storageKey, JSON.stringify(next))
    snapshot = next
    window.dispatchEvent(new Event(changeEvent))
    return item
  }
  function updateSchedule(id: string, input: NewSchedule) {
    if (!snapshot.some(item => item.id === id)) throw new Error('일정을 찾을 수 없어요.')
    const { createOperationSpace, ...values } = input
    const next = snapshot.map(item => {
      if (item.id !== id) return item
      const { operationMenuCount, ...previous } = item
      return { ...previous, ...values, calendarLabel: input.title,
        ...(input.allDay ? { startTime: undefined, endTime: undefined } : {}),
        ...(createOperationSpace ? { operationMenuCount: operationMenuCount ?? 0 } : {}),
      }
    })
    localStorage.setItem(storageKey, JSON.stringify(next))
    snapshot = next
    window.dispatchEvent(new Event(changeEvent))
  }
  return { schedules, addSchedule, updateSchedule }
}
