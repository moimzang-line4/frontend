import { useEffect, useId, useRef, useState } from 'react'
import type { HomeSchedule } from '../../types/home/schedule'
import closeIcon from '../../assets/home/day-sheet-close.svg'
import chevronIcon from '../../assets/home/day-sheet-chevron.svg'
import * as S from '../../styles/home/SelectedDateSheet.styles'

type Props = {
  date: string
  schedules: HomeSchedule[]
  onClose: () => void
  onAdd: () => void
  onSelectEvent: (event: HomeSchedule) => void
}
const categoryLabels: Record<HomeSchedule['category'], string> = {
  meeting: '회의', session: '세션', performance: '공연', newcomer: '공연', afterparty: '뒤풀이', custom: '일정',
}
function getTimeLabel(event: HomeSchedule) {
  if (event.allDay) return '종일'
  if (event.startTime && event.endTime) return `${event.startTime}–${event.endTime}`
  return event.startTime || '시간 미정'
}

export default function SelectedDateSheet({ date, schedules, onClose, onAdd, onSelectEvent }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const afterCloseRef = useRef<(() => void) | null>(null)
  const titleId = useId()
  const [closing, setClosing] = useState(false)
  const [, month, day] = date.split('-').map(Number)
  const selectedSchedules = schedules
    .filter(event => event.date <= date && (event.endDate ?? event.date) >= date)
    .sort((a, b) => {
      if (Boolean(a.allDay) !== Boolean(b.allDay)) return a.allDay ? -1 : 1
      return (a.startTime ?? '').localeCompare(b.startTime ?? '')
    })

  useEffect(() => {
    dialogRef.current?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow }
  }, [])
  useEffect(() => {
    if (!closing) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => dialogRef.current?.close(), reduced ? 0 : 180)
    return () => window.clearTimeout(timer)
  }, [closing])

  function requestClose(afterClose?: () => void) {
    if (closing) return
    afterCloseRef.current = afterClose ?? null
    setClosing(true)
  }

  return (
    <S.Sheet ref={dialogRef} $closing={closing} aria-labelledby={titleId} onClose={() => {
      const callback = afterCloseRef.current
      afterCloseRef.current = null
      onClose()
      callback?.()
    }} onCancel={event => { event.preventDefault(); requestClose() }} onClick={event => {
      const dialog = dialogRef.current
      if (!dialog || event.target !== dialog) return
      const rect = dialog.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) requestClose()
    }}>
      <S.Header>
        <S.DateTitle id={titleId}>{month}월 {day}일</S.DateTitle>
        <S.IconButton type="button" aria-label="닫기" onClick={() => requestClose()}><img src={closeIcon} alt="" width={24} height={24} /></S.IconButton>
      </S.Header>
      <S.Content>
        <S.HeadingRow><S.Heading>오늘의 일정</S.Heading><S.AddButton type="button" onClick={() => requestClose(onAdd)}>＋ 추가</S.AddButton></S.HeadingRow>
        <S.List>
          {selectedSchedules.length === 0 ? <S.Empty>등록된 일정이 없어요.</S.Empty> : selectedSchedules.map(event => (
            <S.EventButton type="button" key={event.id} onClick={() => requestClose(() => onSelectEvent(event))}>
              <S.EventInfo>
                <S.Category>{event.categoryName ?? categoryLabels[event.category]} | {event.date.replaceAll('-', '.')}</S.Category>
                <S.EventTitle>{event.title}</S.EventTitle>
                <S.Summary>{getTimeLabel(event)} · {event.operationMenuCount !== undefined ? '운영 공간 연결' : '일반 일정'}</S.Summary>
              </S.EventInfo>
              <img src={chevronIcon} alt="" width={14} height={14} />
            </S.EventButton>
          ))}
        </S.List>
        <S.CloseButton type="button" onClick={() => requestClose()}>닫기</S.CloseButton>
      </S.Content>
    </S.Sheet>
  )
}
