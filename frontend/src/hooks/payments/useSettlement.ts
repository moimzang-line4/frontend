import { useState } from 'react'
import { getRosterGroup } from '../attendance/useAttendance'
import { loadMembers } from '../members/useMembers'
import type { Settlement, SettlementPerson } from '../../types/payments/settlement'

const storageKey = (scheduleId: string) => `moimzang.payments.settlement.${scheduleId}`

const EMPTY: Settlement = { loaded: false, people: [], rounds: {}, paid: [] }

function load(scheduleId: string): Settlement {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(scheduleId)) ?? 'null') as Settlement | null
    return saved?.rounds ? saved : EMPTY
  } catch {
    return EMPTY
  }
}

// 행사(일정)에 연결된 명단방의 부원 = 정산 대상 명단
function loadEventPeople(scheduleId: string): SettlementPerson[] {
  const group = getRosterGroup(scheduleId)
  if (!group) return []
  return loadMembers()
    .filter(member => member.groupId === group.id)
    .map(member => ({ id: `member-${member.id}`, name: member.name, department: member.department, phone: member.phone }))
}

// 일정별 정산 명단: 차수별 참여자 + 입금 여부 (API 연결 전까지 localStorage)
export default function useSettlement(scheduleId: string) {
  const [settlement, setSettlement] = useState<Settlement>(() => load(scheduleId))

  const update = (updater: (prev: Settlement) => Settlement) => {
    setSettlement(prev => {
      const next = updater(prev)
      try {
        localStorage.setItem(storageKey(scheduleId), JSON.stringify(next))
      } catch { /* 저장 실패 시에도 화면 상태는 유지 */ }
      return next
    })
  }

  // 행사 명단 불러오기: 영수증이 있는 차수마다 전체 인원을 기본으로 넣음
  const loadRoster = (rounds: string[]) => {
    const people = loadEventPeople(scheduleId)
    const ids = people.map(person => person.id)
    update(prev => ({
      loaded: true,
      people,
      rounds: Object.fromEntries(rounds.map(round => [round, prev.rounds[round] ?? ids])),
      paid: prev.paid,
    }))
  }

  const saveRounds = (rounds: Record<string, string[]>) => {
    update(prev => ({ ...prev, rounds }))
  }

  const removeFromRound = (round: string, personId: string) => {
    update(prev => ({ ...prev, rounds: { ...prev.rounds, [round]: (prev.rounds[round] ?? []).filter(id => id !== personId) } }))
  }

  const setPaid = (personId: string, paid: boolean) => {
    update(prev => ({
      ...prev,
      paid: paid ? [...new Set([...prev.paid, personId])] : prev.paid.filter(id => id !== personId),
    }))
  }

  const getPerson = (id: string) => settlement.people.find(person => person.id === id)

  return { settlement, getPerson, loadRoster, saveRounds, removeFromRound, setPaid }
}
