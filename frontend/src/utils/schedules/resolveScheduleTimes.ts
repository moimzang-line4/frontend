// The API requires timestamps even when the user only chooses dates.
export function resolveScheduleTimes(draft: {
  allDay: boolean
  startTime: string
  endTime: string
}) {
  const allDay = draft.allDay || (!draft.startTime && !draft.endTime)
  return {
    allDay,
    startTime: allDay ? '00:00' : draft.startTime || '00:00',
    endTime: allDay ? '23:59' : draft.endTime || '23:59',
  }
}
