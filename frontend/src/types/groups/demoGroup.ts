export type DemoGroup = {
  id: string
  name: string
  shortName: string
  description: string
  generation: string
  ownerId: string
  members: { id: string; name: string }[]
}
