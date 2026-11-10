import { useSyncExternalStore } from 'react'
import type { DemoGroup } from '../../types/groups/demoGroup'

const initialGroup: DemoGroup = {
  id: 'demo-eumsaem', name: '2026 2학기 음샘', shortName: '음샘', description: '중앙 밴드 동아리', generation: '27기',
  ownerId: 'me', members: [{ id: 'me', name: '나' }, { id: 'operator-1', name: '다른 운영진' }],
}
let group: DemoGroup = { ...initialGroup, members: [...initialGroup.members] }
const listeners = new Set<() => void>()
function emit() { listeners.forEach(listener => listener()) }
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } }
const getSnapshot = () => group

export default function useDemoGroup() {
  const current = useSyncExternalStore(subscribe, getSnapshot)
  function updateGroup(values: Pick<DemoGroup, 'name' | 'shortName' | 'description' | 'generation'>) {
    localStorage.setItem('moimzang.home.group-name', values.shortName)
    group = { ...group, ...values }
    emit()
  }
  function transferOwner(id: string) {
    if (!group.members.some(member => member.id === id)) throw new Error('운영진을 찾을 수 없어요.')
    group = { ...group, ownerId: id }
    emit()
  }
  function leaveGroup() {
    const members = group.members.filter(member => member.id !== 'me')
    if (group.ownerId === 'me' && members.length === 0) throw new Error('모임장 권한을 이전할 운영진이 없어요.')
    group = { ...group, members, ownerId: group.ownerId === 'me' ? members[0].id : group.ownerId }
    emit()
  }
  function resetDemo() {
    try { localStorage.setItem('moimzang.home.group-name', initialGroup.shortName) } catch { /* The demo still works in memory. */ }
    group = { ...initialGroup, members: [...initialGroup.members] }
    emit()
  }
  return { group: current, isMember: current.members.some(member => member.id === 'me'), isOwner: current.ownerId === 'me', updateGroup, transferOwner, leaveGroup, resetDemo }
}
