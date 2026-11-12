import SwipeStatusCard from '../SwipeStatusCard'
import type { Participant } from '../../types/attendance/attendance'

type Props = {
  participant: Participant
  subtitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAttend: () => void
  // 스와이프로 드러나는 버튼: 미출석이면 삭제, 출석 완료면 되돌리기
  onSwipeAction: () => void
}

export default function AttendanceCard({ participant, subtitle, open, onOpenChange, onAttend, onSwipeAction }: Props) {
  return (
    <SwipeStatusCard
      name={participant.name}
      subtitle={subtitle}
      done={participant.attendedAt !== null}
      actionLabel="출석 처리"
      doneLabel="출석 완료"
      open={open}
      onOpenChange={onOpenChange}
      onAction={onAttend}
      onSwipeAction={onSwipeAction}
    />
  )
}
