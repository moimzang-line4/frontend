import chevron from '../../assets/home/calendar-chevron.svg'
import type { HomeSchedule } from '../../types/home/schedule'
import * as S from '../../styles/home/MonthCalendar.styles'

type Props = {
  year: number
  monthIndex: number
  days: ({ day: number; date: string } | null)[]
  selectedDate: string
  schedules: HomeSchedule[]
  onMonthChange: (offset: number) => void
  onSelectDate: (date: string) => void
  onSelectEvent: (event: HomeSchedule) => void
}

export default function MonthCalendar({ year, monthIndex, days, selectedDate, schedules, onMonthChange, onSelectDate, onSelectEvent }: Props) {
  return (
    <S.Calendar aria-label="월간 일정 캘린더">
      <S.MonthNavigation>
        <S.MonthButton type="button" aria-label="이전 달" $previous onClick={() => onMonthChange(-1)}>
          <img src={chevron} alt="" width={16} height={16} />
        </S.MonthButton>
        <S.Month aria-live="polite">{year}.{String(monthIndex + 1).padStart(2, '0')}</S.Month>
        <S.MonthButton type="button" aria-label="다음 달" onClick={() => onMonthChange(1)}>
          <img src={chevron} alt="" width={16} height={16} />
        </S.MonthButton>
      </S.MonthNavigation>
      <S.Weekdays>{['일', '월', '화', '수', '목', '금', '토'].map(day => <span key={day}>{day}</span>)}</S.Weekdays>
      <S.Days>
        {days.map((cell, index) => (
          <S.DayCell key={cell?.date ?? `empty-${index}`} $eventCount={cell ? schedules.filter(event => event.date === cell.date && event.calendarLabel).length : 0}>
            {cell && <>
              <S.DayButton type="button" $selected={selectedDate === cell.date} aria-label={`${year}년 ${monthIndex + 1}월 ${cell.day}일`} aria-pressed={selectedDate === cell.date} onClick={() => onSelectDate(cell.date)}>
                {cell.day}
              </S.DayButton>
              {schedules.filter(event => event.date === cell.date && event.calendarLabel).map(event => (
                <S.EventBadge type="button" key={event.id} $category={event.category} aria-label={`${cell.date} ${event.title} 일정 보기`} onClick={() => onSelectEvent(event)}>{event.calendarLabel}</S.EventBadge>
              ))}
            </>}
          </S.DayCell>
        ))}
      </S.Days>
      <S.SelectionStatus aria-live="polite">선택한 날짜: {selectedDate}</S.SelectionStatus>
    </S.Calendar>
  )
}
