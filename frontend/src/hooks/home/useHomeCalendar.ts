import { useMemo, useState } from 'react'
import type { HomeSchedule, NewSchedule, ScheduleCategory } from '../../types/home/schedule'

const storageKey = 'moimzang.home.schedules.v1'
const groupKey = 'moimzang.home.group-name'
const categories: ScheduleCategory[] = ['meeting', 'session', 'performance', 'newcomer']
const sampleSchedules: HomeSchedule[] = [
  { id: 'meeting', title: '정기회의', date: '2026-11-05', category: 'meeting', calendarLabel: '정기회의' },
  { id: 'session-1', title: '세션', date: '2026-11-08', category: 'session', calendarLabel: '세션' },
  { id: 'session-2', title: '세션', date: '2026-11-08', category: 'session', calendarLabel: '세션' },
  { id: 'autumn-1', title: '가을  정기공연', date: '2026-11-14', category: 'performance', calendarLabel: '정기공연', venue: '얼라이브홀', operationMenuCount: 4 },
  { id: 'autumn-2', title: '가을  정기공연', date: '2026-11-14', category: 'performance', venue: '얼라이브홀', operationMenuCount: 4 },
  { id: 'newcomer', title: '신입공연', date: '2026-11-22', category: 'newcomer', calendarLabel: '신입공연' },
]

function isSchedule(value: unknown): value is HomeSchedule {
  if (!value || typeof value !== 'object') return false
  const item = value as HomeSchedule
  return typeof item.id === 'string' && typeof item.title === 'string'
    && typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
    && categories.includes(item.category)
    && (item.calendarLabel === undefined || typeof item.calendarLabel === 'string')
    && (item.venue === undefined || typeof item.venue === 'string')
    && (item.operationMenuCount === undefined || typeof item.operationMenuCount === 'number')
}

function readSchedules(): HomeSchedule[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (Array.isArray(saved) && saved.every(isSchedule)) return saved
  } catch { /* Storage can be unavailable or contain old data. */ }
  return sampleSchedules
}

export default function useHomeCalendar() {
  const [month, setMonth] = useState(() => new Date(2026, 10, 1))
  const [selectedDate, setSelectedDate] = useState('2026-11-14')
  const [schedules, setSchedules] = useState(readSchedules)
  const [groupName, updateGroupName] = useState(() => {
    try { return localStorage.getItem(groupKey) || '음샘' } catch { return '음샘' }
  })
  const [storageError, setStorageError] = useState(false)

  function setGroupName(name: string) {
    updateGroupName(name)
    try { localStorage.setItem(groupKey, name); setStorageError(false) }
    catch { setStorageError(true) }
  }

  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`
  const days = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1).getDay()
    const lastDate = new Date(year, monthIndex + 1, 0).getDate()
    const cells = Math.ceil((firstDay + lastDate) / 7) * 7
    return Array.from({ length: cells }, (_, index) => {
      const day = index - firstDay + 1
      return day > 0 && day <= lastDate ? { day, date: `${prefix}-${String(day).padStart(2, '0')}` } : null
    })
  }, [year, monthIndex, prefix])
  const upcoming = useMemo(() => schedules
    .filter(item => item.operationMenuCount !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date)), [schedules])

  function changeMonth(offset: number) {
    setMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  function addSchedule(input: NewSchedule) {
    const item: HomeSchedule = { ...input, id: crypto.randomUUID(), calendarLabel: input.title, operationMenuCount: 0 }
    const nextSchedules = [...schedules, item]
    setSchedules(nextSchedules)
    try { localStorage.setItem(storageKey, JSON.stringify(nextSchedules)); setStorageError(false) }
    catch { setStorageError(true) }
    const [nextYear, nextMonth] = input.date.split('-').map(Number)
    setMonth(new Date(nextYear, nextMonth - 1, 1))
    setSelectedDate(input.date)
  }

  return { year, monthIndex, days, selectedDate, setSelectedDate, schedules, upcoming, changeMonth, addSchedule, groupName, setGroupName, storageError }
}
