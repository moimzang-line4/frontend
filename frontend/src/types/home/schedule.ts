export type ScheduleCategory = 'meeting' | 'session' | 'performance' | 'newcomer'

export type HomeSchedule = {
  id: string
  title: string
  date: string
  category: ScheduleCategory
  calendarLabel?: string
  venue?: string
  operationMenuCount?: number
}

export type NewSchedule = Pick<HomeSchedule, 'title' | 'date' | 'category' | 'venue'>
