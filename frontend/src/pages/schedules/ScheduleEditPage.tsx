import { Link } from 'react-router'

import ScheduleCreatePage from './ScheduleCreatePage'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'

import * as S from '../../styles/schedules/ScheduleDetailPage.styles'

export default function ScheduleEditPage() {
  const { schedule } = useScheduleDetail()

  if (!schedule) {
    return (
      <S.Page>
        <S.Notice>
          <h1>일정을 찾을 수 없어요</h1>
          <Link to="/">홈으로 이동</Link>
        </S.Notice>
      </S.Page>
    )
  }

  return (
    <ScheduleCreatePage
      key={schedule.id}
      initialSchedule={schedule}
    />
  )
}