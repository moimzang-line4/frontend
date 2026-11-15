import type { DemoGroup } from '../groups/demoGroup'

export type GroupDraft = {
  id: string
  name: string
  generation: string
  groupId?: number
  termId?: number
}

export type OnboardingState = {
  completed: boolean
  draft?: GroupDraft
  group?: DemoGroup
}