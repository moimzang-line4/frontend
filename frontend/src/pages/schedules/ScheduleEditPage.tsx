import { Link } from 'react-router'

import ScheduleCreatePage from './ScheduleCreatePage'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'

import * as S from '../../styles/schedules/ScheduleDetailPage.styles'

export default function ScheduleEditPage() {
  const {
    schedule,
    loading,
    refreshing,
    errorMessage,
    reload,
  } = useScheduleDetail()

  if (loading) {
    return (
      <S.Page>
        <S.Notice>
          <p role="status">
            일정 정보를 불러오는 중이에요.
          </p>
        </S.Notice>
      </S.Page>
    )
  }

  if (errorMessage || !schedule) {
    return (
      <S.Page>
        <S.Notice>
          <h1>일정 정보를 불러오지 못했어요</h1>

          <p role="alert">
            {errorMessage || '일정을 찾을 수 없어요.'}
          </p>

          <button
            type="button"
            disabled={refreshing}
            onClick={() => void reload()}
          >
            {refreshing ? '불러오는 중…' : '다시 불러오기'}
          </button>

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