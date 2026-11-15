export type DemoGroup = {
  id: string
  groupId?: number
  termId?: number
  name: string
  shortName: string
  description: string
  generation: string
  ownerId: string
  members: {
    id: string
    name: string
    profile: string
  }[]
}