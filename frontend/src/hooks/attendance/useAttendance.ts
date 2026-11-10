import { useState } from 'react'
import { loadMembers } from '../members/useMembers'
import { loadGroups } from '../members/useMemberGroups'
import type { MemberGroup } from '../../types/members/member'
import type {
  AttendanceExtraField,
  NewParticipant,
  Participant,
} from '../../types/attendance/attendance'

const storageKey = (scheduleId: string, groupId?: number) => `moimzang.attendance.${scheduleId}.group.${groupId ?? 'none'}`
const rosterKey = (scheduleId: string) => `moimzang.attendance.roster.${scheduleId}`

// 일정에 저장된 명단방이 있으면 그걸, 없으면 모임의 현재 명단방(등록 중 → 첫 번째)을 사용
export function getRosterGroup(scheduleId: string): MemberGroup | undefined {
  const groups = loadGroups()
  try {
    const saved = groups.find(group => group.id === Number(localStorage.getItem(rosterKey(scheduleId))))
    if (saved) return saved
  } catch { /* 저장소를 사용할 수 없으면 기본 명단방 사용 */ }
  return groups.find(group => group.status === 'open') ?? groups[0]
}

export function saveRosterGroup(scheduleId: string, groupId: number | undefined) {
  if (groupId === undefined) localStorage.removeItem(rosterKey(scheduleId))
  else localStorage.setItem(rosterKey(scheduleId), String(groupId))
}

export function getExtraField(group?: MemberGroup): AttendanceExtraField | undefined {
  const enabled = new Set(group?.fields?.filter(field => field.enabled).map(field => field.id))
  if (!group?.fields || enabled.has('phone')) {
    return { key: 'phone', label: '전화번호 뒤 4자리', placeholder: '예: 4827' }
  }
  if (enabled.has('studentId')) {
    return { key: 'studentId', label: '학번 뒤 4자리', placeholder: '예: 4827' }
  }
  return undefined
}

function seedFromRoster(groupId?: number): Participant[] {
  const group = loadGroups().find(item => item.id === groupId)
  if (!group) return []
  return loadMembers()
    .filter(member => member.groupId === group.id)
    .map(member => ({
      id: `member-${member.id}`,
      name: member.name,
      department: member.department,
      phone: member.phone,
      attendedAt: null,
      onsite: false,
    }))
}

function load(scheduleId: string, groupId?: number): Participant[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey(scheduleId, groupId)) ?? 'null')
    if (Array.isArray(saved)) {
      const excluded: string[] = JSON.parse(localStorage.getItem(`${storageKey(scheduleId, groupId)}.excluded`) ?? '[]')
      const existing = saved as Participant[]
      const seeds = seedFromRoster(groupId)
      return [...existing.map(item => {
        const current = seeds.find(seed => seed.id === item.id)
        return current ? { ...current, attendedAt: item.attendedAt } : item
      }), ...seeds.filter(item => !existing.some(savedItem => savedItem.id === item.id) && !excluded.includes(item.id))]
    }
  } catch { /* 저장소를 사용할 수 없으면 명단에서 새로 불러옴 */ }
  return seedFromRoster(groupId)
}

export default function useAttendance(scheduleId: string, groupId?: number) {
  const [participants, setParticipants] = useState<Participant[]>(() => load(scheduleId, groupId))

  const update = (updater: (prev: Participant[]) => Participant[]) => {
    setParticipants(prev => {
      const next = updater(prev)
      try {
        localStorage.setItem(storageKey(scheduleId, groupId), JSON.stringify(next))
      } catch { /* 저장 실패 시에도 화면 상태는 유지 */ }
      return next
    })
  }

  const setAttended = (id: string, attended: boolean) => {
    update(prev => prev.map(item =>
      item.id === id ? { ...item, attendedAt: attended ? Date.now() : null } : item,
    ))
  }

  const removeParticipant = (id: string) => {
    const key = `${storageKey(scheduleId, groupId)}.excluded`
    const excluded: string[] = JSON.parse(localStorage.getItem(key) ?? '[]')
    localStorage.setItem(key, JSON.stringify([...new Set([...excluded, id])]))
    update(prev => prev.filter(item => item.id !== id))
  }

  const addParticipant = (input: NewParticipant) => {
    const participant: Participant = {
      id: `onsite-${Date.now()}`,
      name: input.name,
      department: input.department,
      phone: '',
      extra: input.extra || undefined,
      attendedAt: null,
      onsite: true,
    }
    // 방금 추가한 인원이 맨 위에 보이도록
    update(prev => [participant, ...prev])
    return participant
  }

  const attendedCount = participants.filter(item => item.attendedAt !== null).length

  return {
    participants,
    attendedCount,
    setAttended,
    removeParticipant,
    addParticipant,
  }
}
