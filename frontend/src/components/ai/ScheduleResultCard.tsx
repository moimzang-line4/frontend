import { useNavigate } from 'react-router'
import type { Schedule } from '../../types/schedules/schedule'
import * as S from '../../styles/ai/AssistantResult.styles'

type Props = {
  schedules: Schedule[]
}

const formatDate = (date: string) => {
  const [, month, day] = date.split('-').map(Number)
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][new Date(`${date}T00:00:00`).getDay()]
  return `${month}월 ${day}일 (${weekday})`
}

// 등록된 공연 일정 결과: 누르면 일정 상세로 이동
export default function ScheduleResultCard({ schedules }: Props) {
  const navigate = useNavigate()

  return (
    <S.Card aria-label="공연 일정">
      <S.List>
        {schedules.map(schedule => (
          <li key={schedule.id}>
            <S.RowLink type="button" onClick={() => navigate(`/schedules/${encodeURIComponent(schedule.id)}`)}>
              <S.Info>
                <strong>{schedule.title}</strong>
                <S.Meta>{[formatDate(schedule.date), schedule.startTime, schedule.venue].filter(Boolean).join(' · ')}</S.Meta>
              </S.Info>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </S.RowLink>
          </li>
        ))}
      </S.List>
    </S.Card>
  )
}
