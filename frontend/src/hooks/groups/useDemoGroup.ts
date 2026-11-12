import { useSyncExternalStore } from 'react'
import type { DemoGroup } from '../../types/groups/demoGroup'
import type { GroupDraft } from '../../types/onboarding/onboarding'
import { getOnboarding, subscribeOnboarding, updateOnboarding } from '../../utils/onboarding/store'

const initialGroup: DemoGroup = {
  id: 'demo-eumsaem', name: '2026 2학기 음샘', shortName: '음샘', description: '중앙 밴드 동아리', generation: '27기',
  ownerId: 'me', members: [{ id: 'me', name: '나', profile: '모임장' }, { id: 'operator-1', name: '강민준', profile: '광고홍보학과 1140' }, { id: 'operator-2', name: '정서현', profile: '광고홍보학과 1140' }, { id: 'operator-3', name: '김민서', profile: '광고홍보학과 1140' }],
}
let demoGroup: DemoGroup = { ...initialGroup, members: [...initialGroup.members] }
const listeners = new Set<() => void>()
function emit() { listeners.forEach(listener => listener()) }
function subscribe(listener: () => void) {
  listeners.add(listener)
  const unsubscribe = subscribeOnboarding(listener)
  return () => { listeners.delete(listener); unsubscribe() }
}
const getSnapshot = () => getOnboarding().group ?? demoGroup
function saveGroup(next: DemoGroup) {
  if (getOnboarding().group) updateOnboarding({ group: next })
  else { demoGroup = next; emit() }
}

export default function useDemoGroup() {
  const current = useSyncExternalStore(subscribe, getSnapshot)
  function updateGroup(values: Pick<DemoGroup, 'name' | 'shortName' | 'description' | 'generation'>) {
    try { localStorage.setItem('moimzang.home.group-name', values.shortName) } catch { /* Keep demo edits available in memory. */ }
    saveGroup({ ...getSnapshot(), ...values })
  }
  function transferOwner(id: string) {
    const group = getSnapshot()
    if (group.ownerId !== 'me') throw new Error('모임장만 권한을 변경할 수 있어요.')
    if (!group.members.some(member => member.id === id)) throw new Error('운영진을 찾을 수 없어요.')
    saveGroup({ ...group, ownerId: id })
  }
  function removeOperator(id: string) {
    const group = getSnapshot()
    if (group.ownerId !== 'me') throw new Error('모임장만 운영진을 내보낼 수 있어요.')
    if (id === group.ownerId) throw new Error('모임장은 내보낼 수 없어요.')
    if (!group.members.some(member => member.id === id)) throw new Error('운영진을 찾을 수 없어요.')
    saveGroup({ ...group, members: group.members.filter(member => member.id !== id) })
  }
  function leaveGroup() {
    const group = getSnapshot()
    const members = group.members.filter(member => member.id !== 'me')
    if (group.ownerId === 'me' && members.length === 0) throw new Error('모임장 권한을 이전할 운영진이 없어요.')
    saveGroup({ ...group, members, ownerId: group.ownerId === 'me' ? members[0].id : group.ownerId })
  }
  function resetDemo() {
    try { localStorage.setItem('moimzang.home.group-name', initialGroup.shortName) } catch { /* The demo still works in memory. */ }
    saveGroup({ ...initialGroup, members: [...initialGroup.members] })
  }
  function createGroup(draft: GroupDraft) {
    const next: DemoGroup = { ...draft, shortName: draft.name, description: '', ownerId: 'me', members: [{ id: 'me', name: '나', profile: '모임장' }] }
    updateOnboarding({ completed: true, draft: undefined, group: next })
    try { localStorage.setItem('moimzang.home.group-name', next.shortName) } catch { /* Group information is already saved. */ }
  }
  return { group: current, isMember: current.members.some(member => member.id === 'me'), isOwner: current.ownerId === 'me', updateGroup, createGroup, transferOwner, removeOperator, leaveGroup, resetDemo }
}
