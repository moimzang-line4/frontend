import type { ScheduleCreateRequestColor } from '../../api/models/scheduleCreateRequestColor'

const colors: Record<ScheduleCreateRequestColor, string> = {
  RED: '#e86159',
  ORANGE: '#f2a74b',
  YELLOW: '#e7cb58',
  GREEN: '#5fbf92',
  TEAL: '#60b7c7',
  BLUE: '#6898e5',
  PURPLE: '#a38add',
  PINK: '#d68eb5',
}

export function toApiColor(value: string | undefined) {
  const keys = Object.keys(colors) as ScheduleCreateRequestColor[]

  const color = keys.find(
    key => colors[key].toLowerCase() === value?.toLowerCase(),
  )

  if (!color) {
    throw new Error('일정 색상을 선택해주세요.')
  }

  return color
}

export function toScreenColor(value: string | undefined) {
  if (!value) return undefined

  if (Object.prototype.hasOwnProperty.call(colors, value)) {
    return colors[value as ScheduleCreateRequestColor]
  }

  return /^#[0-9a-f]{6}$/i.test(value) ? value : undefined
}