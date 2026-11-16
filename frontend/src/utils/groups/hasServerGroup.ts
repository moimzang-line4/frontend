export default function hasServerGroup(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false
  }

  const group = value as {
    groupId?: unknown
    termId?: unknown
  }

  return (
    typeof group.groupId === 'number' &&
    Number.isSafeInteger(group.groupId) &&
    group.groupId > 0 &&
    typeof group.termId === 'number' &&
    Number.isSafeInteger(group.termId) &&
    group.termId > 0
  )
}