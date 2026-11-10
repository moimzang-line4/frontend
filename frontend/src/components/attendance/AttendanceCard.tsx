import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { Participant } from '../../types/attendance/attendance'
import * as S from '../../styles/attendance/AttendanceCard.styles'

type Props = {
  participant: Participant
  subtitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAttend: () => void
  // 스와이프로 드러나는 버튼: 미출석이면 삭제, 출석 완료면 되돌리기
  onSwipeAction: () => void
}

// 버튼 너비 88 + 간격 8
const ACTION_WIDTH = 96

export default function AttendanceCard({
  participant,
  subtitle,
  open,
  onOpenChange,
  onAttend,
  onSwipeAction,
}: Props) {
  const attended = participant.attendedAt !== null
  const [dragX, setDragX] = useState<number | null>(null)
  const drag = useRef({ startX: 0, startY: 0, base: 0, moved: false, active: false })

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      base: open ? -ACTION_WIDTH : 0,
      moved: false,
      active: true,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state.active) return
    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY

    if (!state.moved) {
      // 세로 스크롤이면 스와이프 취소
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
        state.active = false
        return
      }
      if (Math.abs(dx) < 6) return
      state.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    setDragX(Math.min(0, Math.max(-ACTION_WIDTH, state.base + dx)))
  }

  const handlePointerEnd = () => {
    const state = drag.current
    state.active = false
    if (state.moved && dragX !== null) onOpenChange(dragX < -ACTION_WIDTH / 2)
    setDragX(null)
  }

  const offset = dragX ?? (open ? -ACTION_WIDTH : 0)

  return (
    <S.Row>
      <S.SwipeAction
        type="button"
        $variant={attended ? 'undo' : 'delete'}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        onClick={onSwipeAction}
      >
        {attended ? '되돌리기' : '삭제하기'}
      </S.SwipeAction>

      <S.Card
        style={{ transform: `translateX(${offset}px)` }}
        $dragging={dragX !== null}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={event => {
          // 드래그 직후의 클릭은 무시, 열린 카드를 누르면 닫기
          if (drag.current.moved) {
            event.preventDefault()
            event.stopPropagation()
            drag.current.moved = false
          } else if (open) {
            event.preventDefault()
            event.stopPropagation()
            onOpenChange(false)
          }
        }}
      >
        <S.Info>
          <S.Name>{participant.name}</S.Name>
          <S.Subtitle>{subtitle}</S.Subtitle>
        </S.Info>

        {attended ? (
          <S.DoneBadge aria-label={`${participant.name} 출석 완료`}>✓ 출석 완료</S.DoneBadge>
        ) : (
          <S.AttendButton type="button" onClick={onAttend} aria-label={`${participant.name} 출석 처리`}>
            ✓ 출석 처리
          </S.AttendButton>
        )}
      </S.Card>
    </S.Row>
  )
}
