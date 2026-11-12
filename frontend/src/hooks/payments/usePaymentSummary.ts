import { useState } from 'react'
import { getRosterGroup } from '../attendance/useAttendance'
import { loadMembers } from '../members/useMembers'
import { getSettlementMemberIds } from '../../utils/payments'
import type { Settlement } from '../../types/payments/settlement'

// 정산 진행 카드 숫자: 정산 명단을 불러왔으면 (입금 완료 / 정산 인원), 아니면 (0 / 명단방 인원)
export default function usePaymentSummary(scheduleId: string, settlement: Settlement) {
  const [rosterCount] = useState(() => {
    const group = getRosterGroup(scheduleId)
    return group ? loadMembers().filter(member => member.groupId === group.id).length : 0
  })

  if (!settlement.loaded) return { paid: 0, total: rosterCount }
  const memberIds = getSettlementMemberIds(settlement)
  return { paid: memberIds.filter(id => settlement.paid.includes(id)).length, total: memberIds.length }
}
