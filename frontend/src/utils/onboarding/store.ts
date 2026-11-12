import type { DemoGroup } from '../../types/groups/demoGroup'
import type { GroupDraft, OnboardingState } from '../../types/onboarding/onboarding'

export const onboardingKey = 'moimzang.onboarding.v1'
function validDraft(value: unknown): value is GroupDraft {
  if (!value || typeof value !== 'object') return false
  const item = value as GroupDraft
  return typeof item.id === 'string' && !!item.id && typeof item.name === 'string' && !!item.name.trim() && typeof item.generation === 'string' && !!item.generation.trim()
}
function validGroup(value: unknown): value is DemoGroup {
  if (!validDraft(value)) return false
  const item = value as DemoGroup
  return typeof item.shortName === 'string' && typeof item.description === 'string' && typeof item.ownerId === 'string'
    && Array.isArray(item.members) && item.members.every(member => member && typeof member.id === 'string' && typeof member.name === 'string' && typeof member.profile === 'string')
}
function read(): OnboardingState {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(onboardingKey) ?? 'null')
    if (saved && typeof saved === 'object') {
      const item = saved as Partial<OnboardingState>
      return { completed: item.completed === true, draft: validDraft(item.draft) ? item.draft : undefined, group: validGroup(item.group) ? item.group : undefined }
    }
  } catch { /* A first visit or unavailable storage starts the introduction. */ }
  return { completed: false }
}
let state = read()
const listeners = new Set<() => void>()
export const getOnboarding = () => state
export function subscribeOnboarding(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === onboardingKey || event.key === null) { state = read(); listener() }
  }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage) }
}
export function updateOnboarding(update: Partial<OnboardingState>) {
  const next = { ...state, ...update }
  try { localStorage.setItem(onboardingKey, JSON.stringify(next)) }
  catch { throw new Error('진행 상태를 저장하지 못했어요. 브라우저 저장 공간을 확인해주세요.') }
  state = next
  listeners.forEach(listener => listener())
}
