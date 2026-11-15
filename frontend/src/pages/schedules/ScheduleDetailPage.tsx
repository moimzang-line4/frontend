import { Link } from 'react-router'

import Footer from '../../layouts/Footer'
import ScheduleMeetings from '../../components/schedules/ScheduleMeetings'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import { operationMenus } from '../../constants/schedules/operationMenus'

import heroBackground from '../../assets/schedules/detail-header.svg'

import * as S from '../../styles/schedules/ScheduleDetailPage.styles'

export default function ScheduleDetailPage() {
  const {
    schedule,
    countdown,
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

        <Footer />
      </S.Page>
    )
  }

  if (errorMessage) {
    return (
      <S.Page>
        <S.Notice>
          <h1>일정 정보를 불러오지 못했어요</h1>

          <p role="alert">{errorMessage}</p>

          <button
            type="button"
            disabled={refreshing}
            onClick={() => void reload()}
          >
            {refreshing ? '불러오는 중…' : '다시 불러오기'}
          </button>

          <Link to="/">홈으로 이동</Link>
        </S.Notice>

        <Footer />
      </S.Page>
    )
  }

  if (!schedule) {
    return (
      <S.Page>
        <S.Notice>
          <h1>일정을 찾을 수 없어요</h1>
          <p>삭제되었거나 존재하지 않는 일정이에요.</p>
          <Link to="/">홈으로 이동</Link>
        </S.Notice>

        <Footer />
      </S.Page>
    )
  }

  const dateText =
    schedule.date.replaceAll('-', '.') +
    (
      schedule.endDate && schedule.endDate !== schedule.date
        ? ` ~ ${schedule.endDate.replaceAll('-', '.')}`
        : ''
    )

  const timeText = schedule.allDay
    ? '종일'
    : schedule.startTime && schedule.endTime
      ? `${schedule.startTime}–${schedule.endTime}`
      : schedule.startTime || '시간 미정'

  const basePath = `/schedules/${encodeURIComponent(schedule.id)}`

  return (
    <S.Page>
      <S.Hero>
        <S.HeroBackground
          src={heroBackground}
          alt=""
          width={390}
          height={211}
        />

        <S.HeroNavigation>
          <S.Brand to="/" aria-label="moimzang 홈">
            moimzang
          </S.Brand>

          <S.EditLink to={`${basePath}/edit`}>
            수정하기
          </S.EditLink>
        </S.HeroNavigation>

        <S.Metadata>
          <S.Date>{dateText}</S.Date>

          <S.Title title={schedule.title}>
            {schedule.title}
          </S.Title>

          <S.TimeVenue
            title={`${timeText}${
              schedule.venue ? ` · ${schedule.venue}` : ''
            }`}
          >
            {timeText}
            {schedule.venue ? ` · ${schedule.venue}` : ''}
          </S.TimeVenue>
        </S.Metadata>

        <S.Countdown
          $length={countdown.length}
          aria-label={`일정까지 ${countdown}`}
        >
          {countdown}
        </S.Countdown>
      </S.Hero>

      <S.Content>
        {schedule.operationMenuCount !== undefined ? (
          <S.MenuGrid aria-label="일정 운영 메뉴">
            {operationMenus.map(menu => (
              <S.MenuCard
                key={menu.id}
                to={`${basePath}/operations/${menu.id}`}
              >
                <h2>{menu.title}</h2>
                <p>{menu.description}</p>

                <S.MenuImage
                  src={menu.image}
                  alt=""
                  width={menu.width}
                  height={menu.height}
                  $right={menu.right}
                  $bottom={menu.bottom}
                />
              </S.MenuCard>
            ))}
          </S.MenuGrid>
        ) : (
          <S.Empty>
            <h3>연결된 운영 공간이 없어요</h3>
            <p>이 일정은 일반 일정으로 등록되었어요.</p>
          </S.Empty>
        )}

        <ScheduleMeetings
          key={schedule.id}
          scheduleId={schedule.id}
        />
      </S.Content>

      <Footer />
    </S.Page>
  )
}