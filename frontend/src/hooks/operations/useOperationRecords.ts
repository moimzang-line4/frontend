import { useState } from 'react'
import useSchedules from '../schedules/useSchedules'
import useScheduleMinutes from '../schedules/useScheduleMinutes'
import type { OperationFilter, OperationRecord } from '../../types/operations/operation'

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export default function useOperationRecords() {
  const { schedules } = useSchedules()
  const { minutes, create } = useScheduleMinutes()
  const [today] = useState(localDate)
  const [year, setYear] = useState(today.slice(0, 4))
  const [past, setPast] = useState(false)
  const [filter, setFilter] = useState<OperationFilter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('latest')
  const records: OperationRecord[] = [
    ...schedules.filter(item => item.operationMenuCount !== undefined).map(item => ({
      id: item.id, kind: 'schedule' as const, title: item.title, date: item.date, past: (item.endDate ?? item.date) < today,
    })),
    ...minutes.map(item => {
      const linkedSchedules = schedules.filter(schedule => item.scheduleIds.includes(schedule.id))
      const date = item.date ?? linkedSchedules[0]?.date ?? today
      return { id: item.id, kind: 'minute' as const, title: item.title, date,
        past: linkedSchedules.length ? linkedSchedules.every(schedule => (schedule.endDate ?? schedule.date) < today) : date < today }
    }),
  ]
  const years = [...new Set([today.slice(0, 4), ...records.map(item => item.date.slice(0, 4))])].sort().reverse()
  const filtered = records.filter(item => item.date.startsWith(year) && item.past === past
    && (filter === 'all' || item.kind === filter) && item.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => (sort === 'latest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)) || a.title.localeCompare(b.title, 'ko'))
  return { currentYear: today.slice(0, 4), records: filtered, minutes, create, year, setYear, years, past, setPast, filter, setFilter, query, setQuery, sort, setSort }
}
