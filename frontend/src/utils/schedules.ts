import type { Schedule } from '../types/schedules/schedule'

export function isScheduleOnDate(schedule: Schedule, date: string) {
  return schedule.date <= date && (schedule.endDate ?? schedule.date) >= date
}

// Repair only the exact legacy demo pair, never deduplicate user-created records.
export function reconcileLegacyDemoSchedules(schedules: Schedule[]): Schedule[] {
  const untouched = (item: Schedule) => item.endDate === undefined && item.startTime === undefined
    && item.endTime === undefined && item.allDay === undefined && item.color === undefined && item.categoryName === undefined
  const autumn = (item: Schedule) => untouched(item) && item.title.replace(/\s/g, '') === '가을정기공연'
    && item.date === '2026-11-14' && item.category === 'performance'
    && item.venue === '얼라이브홀' && item.operationMenuCount === 4
  const duplicate = schedules.find(item => item.id === 'autumn-2' && autumn(item) && item.calendarLabel === undefined)
  const original = schedules.find(item => item.id === 'autumn-1' && autumn(item))
  if (!duplicate || !original) return schedules
  return schedules.filter(item => item !== duplicate).map(item =>
    item.id === 'newcomer' && untouched(item) && item.title === '신입공연' && item.date === '2026-11-22'
      && item.category === 'newcomer' && item.operationMenuCount === undefined && item.venue === undefined
      ? { ...item, operationMenuCount: 4 }
      : item)
}
