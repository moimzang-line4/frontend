export type ScheduleCategory = 'meeting' | 'session' | 'performance' | 'newcomer' | 'afterparty' | 'custom'

export type Schedule = {
  id: string
  title: string
  date: string
  category: ScheduleCategory
  categoryName?: string
  calendarLabel?: string
  venue?: string
  operationMenuCount?: number
  endDate?: string
  startTime?: string
  endTime?: string
  allDay?: boolean
  color?: string
}

export type NewSchedule = Pick<Schedule, 'title' | 'date' | 'category' | 'categoryName' | 'venue' | 'endDate' | 'startTime' | 'endTime' | 'allDay' | 'color'> & {
  createOperationSpace: boolean
}

export type CategoryOption = { id: string; label: string; kind: ScheduleCategory }

export type ScheduleMinute = { id: string; title: string; content: string; scheduleIds: string[]; date?: string }
