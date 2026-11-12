import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { meetingFinished } from '../../utils/meetings/store'
import useSchedules from '../schedules/useSchedules'
import useScheduleMinutes from '../schedules/useScheduleMinutes'
import type { OperationFilter, OperationRecord, OperationSort } from '../../types/operations/operation'

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export default function useOperationRecords() {
  const { schedules } = useSchedules()
  const { minutes, create } = useScheduleMinutes()
  const [today] = useState(localDate)
  const [params, setParams] = useSearchParams()
  const requestedYear = params.get('year')
  const year = requestedYear && /^\d{4}$/.test(requestedYear) ? requestedYear : today.slice(0, 4)
  function setYear(value: string) {
    setParams(current => { const next = new URLSearchParams(current); if (value === today.slice(0, 4)) next.delete('year'); else next.set('year', value); return next }, { replace: true })
  }
  const past = params.get('period') === 'past'
  function setPast(value: boolean) {
    setParams(current => { const next = new URLSearchParams(current); if (value) next.set('period', 'past'); else next.delete('period'); return next }, { replace: true })
  }
  const filter: OperationFilter = params.get('type') === 'minute' ? 'minute' : params.get('type') === 'schedule' ? 'schedule' : 'all'
  function setFilter(value: OperationFilter) {
    setParams(current => { const next = new URLSearchParams(current); if (value === 'all') next.delete('type'); else next.set('type', value); return next }, { replace: true })
  }
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<OperationSort>('latest')
  const records: OperationRecord[] = [
    ...schedules.filter(item => item.operationMenuCount !== undefined).map(item => ({
      id: item.id, kind: 'schedule' as const, title: item.title, date: item.date, createdAt: item.createdAt ?? item.date, past: (item.endDate ?? item.date) < today,
    })),
    ...minutes.map(item => {
      const linkedSchedules = schedules.filter(schedule => item.scheduleIds.includes(schedule.id))
      const date = item.date ?? linkedSchedules[0]?.date ?? today
      return { id: item.id, kind: 'minute' as const, title: item.title, date, createdAt: item.createdAt ?? date,
        past: meetingFinished(item, today) }
    }),
  ]
  const years = [...new Set([today.slice(0, 4), ...records.map(item => item.date.slice(0, 4))])].sort().reverse()
  const filtered = records.filter(item => item.date.startsWith(year) && item.past === past
    && (filter === 'all' || item.kind === filter) && item.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => {
      const nameOrder = a.title.localeCompare(b.title, 'ko')
      if (sort === 'name') return nameOrder
      if (sort === 'upcoming') {
        const distance = (date: string) => Math.abs(Date.parse(date) - Date.parse(today))
        return distance(a.date) - distance(b.date) || nameOrder
      }
      const registeredOrder = a.createdAt.localeCompare(b.createdAt)
      return (sort === 'latest' ? -registeredOrder : registeredOrder) || nameOrder
    })
  return { currentYear: today.slice(0, 4), records: filtered, minutes, create, year, setYear, years, past, setPast, filter, setFilter, query, setQuery, sort, setSort }
}
