function localDate(value: Date) {
  return `${String(value.getFullYear()).padStart(4, '0')}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

function localTime(value: Date) {
  return `${String(value.getHours()).padStart(2, '0')}:00`
}

// Round the current local clock on the selected calendar day, carrying midnight forward.
export function scheduleCreateDefaults(
  selectedDate?: string | null,
  now = new Date(),
) {
  const empty = { date: '', endDate: '', startTime: '', endTime: '' }
  if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) return empty
  const start = new Date(`${selectedDate}T00:00:00`)
  if (
    !Number.isFinite(start.getTime()) ||
    start.getFullYear() < 1900 ||
    localDate(start) !== selectedDate
  )
    return empty
  const roundUp =
    now.getMinutes() > 0 || now.getSeconds() > 0 || now.getMilliseconds() > 0
  start.setHours(now.getHours() + (roundUp ? 1 : 0), 0, 0, 0)
  const end = new Date(start)
  end.setHours(end.getHours() + 1)
  if (end.getFullYear() > 9999) return empty
  return {
    date: localDate(start),
    endDate: localDate(end),
    startTime: localTime(start),
    endTime: localTime(end),
  }
}
