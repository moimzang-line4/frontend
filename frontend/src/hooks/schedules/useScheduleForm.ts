import { resolveScheduleTimes } from '../../utils/schedules/resolveScheduleTimes'
import { scheduleCreateDefaults } from '../../utils/schedules/createDefaults'
import { useState } from 'react'
import useScheduleCategoriesApi from './useScheduleCategoriesApi'
import { scheduleColors } from '../../constants/schedules/options'
import type { CategoryOption, NewSchedule, Schedule } from '../../types/schedules/schedule'

type Draft = {
  title: string
  color: string
  category: CategoryOption | null
  allDay: boolean
  date: string
  endDate: string
  startTime: string
  endTime: string
  venue: string
  createOperationSpace: boolean
}

export default function useScheduleForm(initialSchedule?: Schedule, selectedDate?: string | null) {
  const { categories } = useScheduleCategoriesApi()
  const [draft, setDraft] = useState<Draft>(() => initialSchedule ? {
    title: initialSchedule.title,
    color: initialSchedule.color ?? scheduleColors[0].value,
    category: initialSchedule.categoryName
  ? (
      categories.find(
        item => item.label === initialSchedule.categoryName,
      ) ?? {
        id: initialSchedule.categoryName,
        kind: 'custom',
        label: initialSchedule.categoryName,
      }
    )
  : null,
    allDay: initialSchedule.allDay ?? false,
    date: initialSchedule.date, endDate: initialSchedule.endDate ?? initialSchedule.date,
    startTime: initialSchedule.startTime ?? '', endTime: initialSchedule.endTime ?? '',
    venue: initialSchedule.venue ?? '', createOperationSpace: initialSchedule.operationMenuCount !== undefined,
  } : {
    title: '', color: scheduleColors[0].value, category: null, allDay: false,
    ...scheduleCreateDefaults(selectedDate), venue: '', createOperationSpace: true,
  })
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(current => ({ ...current, [key]: value }))
  }
  const datesFilled = Boolean(draft.date && draft.endDate)
  const times = resolveScheduleTimes(draft)
  const start = `${draft.date}T${times.startTime}`
  const end = `${draft.endDate}T${times.endTime}`
  const invalidRange = datesFilled && end < start
  const canSubmit = Boolean(
    draft.title.trim() &&
    draft.category?.label.trim() &&
    scheduleColors.some(color => color.value === draft.color) &&
    datesFilled && !invalidRange
  )
  function toSchedule(): NewSchedule | null {
    if (!canSubmit) return null
    return {
      title: draft.title.trim(), category: draft.category?.kind ?? 'custom', categoryName: draft.category?.label ?? '일정',
      date: draft.date, endDate: draft.endDate, allDay: times.allDay,
      ...(times.allDay ? {} : { startTime: times.startTime, endTime: times.endTime }),
      color: draft.color, venue: draft.venue.trim(), createOperationSpace: draft.createOperationSpace,
    }
  }
  return { draft, update, canSubmit, invalidRange, toSchedule }
}
