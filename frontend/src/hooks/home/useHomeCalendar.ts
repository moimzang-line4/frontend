import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import useSchedules from '../schedules/useSchedules'
import useTodayDate from './useTodayDate'
import useDemoGroup from '../groups/useDemoGroup'

const groupKey = 'moimzang.home.group-name'

export default function useHomeCalendar() {
  const today = useTodayDate()
  const { group, updateGroup } = useDemoGroup()
  const [searchParams] = useSearchParams()
  const dateParam = searchParams.get('date')
  const initialDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : today
  const [month, setMonth] = useState(() => {
    const [year, month] = initialDate.split('-').map(Number)
    return new Date(year, month - 1, 1)
  })
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const { schedules } = useSchedules()
  const [groupName, updateGroupName] = useState(() => {
    try { return group.shortName || localStorage.getItem(groupKey) || '음샘' } catch { return '음샘' }
  })
  const [storageError, setStorageError] = useState(false)

  function setGroupName(name: string) {
    updateGroupName(name)
    try { updateGroup({ name: group.name, shortName: name, description: group.description, generation: group.generation }); localStorage.setItem(groupKey, name); setStorageError(false) }
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
    .filter(item => item.operationMenuCount !== undefined && (item.endDate ?? item.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.startTime ?? '').localeCompare(b.startTime ?? '') || a.id.localeCompare(b.id)), [schedules, today])

  function changeMonth(offset: number) {
    setMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }


  return { year, monthIndex, days, today, selectedDate, setSelectedDate, schedules, upcoming, changeMonth, groupName: group.shortName || groupName, setGroupName, storageError }
}
