import { useSyncExternalStore } from 'react'
import { getOnboarding, subscribeOnboarding, updateOnboarding } from '../../utils/onboarding/store'

export default function useOnboarding() {
  const state = useSyncExternalStore(subscribeOnboarding, getOnboarding)
  return { ...state, update: updateOnboarding }
}
