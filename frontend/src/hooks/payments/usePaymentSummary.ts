import { useState } from 'react'
import { getRosterGroup } from '../attendance/useAttendance'
import { loadMembers } from '../members/useMembers'

// 정산 진행 카드에 쓰는 인원 수 (출석과 같은 명단방 기준)
// TODO: 입금 확인 기능이 생기면 paid를 실제 입금 완료 인원으로 계산
export default function usePaymentSummary(scheduleId: string) {
  const [summary] = useState(() => {
    const group = getRosterGroup(scheduleId)
    const total = group ? loadMembers().filter(member => member.groupId === group.id).length : 0
    return { paid: 0, total }
  })
  return summary
}
