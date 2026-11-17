export function meetingReturnTo(state: unknown, completed = false) {
  const value =
    state && typeof state === 'object' && 'returnTo' in state
      ? state.returnTo
      : undefined
  if (
    typeof value === 'string' &&
    (/^\/schedules\/[1-9]\d*$/.test(value) ||
      /^\/operations(?:\?[^#]*)?$/.test(value))
  )
    return value
  return completed
    ? '/operations?type=minute&period=past'
    : '/operations?type=minute'
}
