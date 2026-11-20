import GroupSwitcher from '../../components/groups/GroupSwitcher'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import MainLayout from '../../layouts/MainLayout'
import MonthCalendar from '../../components/home/MonthCalendar'
import UpcomingEventCard from '../../components/home/UpcomingEventCard'
import SelectedDateSheet from '../../components/home/SelectedDateSheet'

import useHomeCalendar from '../../hooks/home/useHomeCalendar'
import useCurrentGroup from '../../hooks/groups/useCurrentGroup'

import settingsIcon from '../../assets/home/settings.svg'

import * as S from '../../styles/home/HomePage.styles'

export default function HomePage() {
  const calendar = useHomeCalendar()
  const currentGroup = useCurrentGroup()
  const navigate = useNavigate()

  const [dateSheetOpen, setDateSheetOpen] = useState(false)


  return (
    <MainLayout
      title="moimzang"
      headerAlign="left"
      headerVariant="brand"
      showBack={false}
      headerRightAction={
        <S.SettingsButton
          type="button"
          aria-label="설정"
          onClick={() =>
            navigate('/settings', {
              state: { settingsParent: '/' },
            })
          }
        >
          <img
            src={settingsIcon}
            alt=""
            width={24}
            height={24}
          />
        </S.SettingsButton>
      }
      home
    >
      <S.Content>
        {currentGroup.loading && (
          <S.EmptyMessage role="status">
            그룹 정보를 불러오는 중이에요.
          </S.EmptyMessage>
        )}

        {currentGroup.errorMessage && (
          <div>
            <S.StorageNotice role="alert">
              {currentGroup.errorMessage}
            </S.StorageNotice>

            {currentGroup.canRetry && (
              <S.AddButton
                type="button"
                disabled={currentGroup.refreshing}
                onClick={() => void currentGroup.reload()}
              >
                {currentGroup.refreshing
                  ? '불러오는 중…'
                  : '다시 불러오기'}
              </S.AddButton>
            )}
          </div>
        )}

        <S.CalendarTitle>
          <GroupSwitcher />
        </S.CalendarTitle>

        <S.SectionHeading>
          <S.Heading>일정 캘린더</S.Heading>

          <S.AddButton
            type="button"
            onClick={() => navigate('/schedules/new')}
          >
            ＋ 일정 등록
          </S.AddButton>
        </S.SectionHeading>

        <MonthCalendar
          {...calendar}
          onMonthChange={calendar.changeMonth}
          // 날짜·일정 뱃지 모두 해당 날짜의 '오늘의 일정' 시트만 열기 (상세 이동은 시트에서)
          onSelectDate={(date) => {
            calendar.setSelectedDate(date)
            setDateSheetOpen(true)
          }}
        />

        <S.UpcomingSection aria-labelledby="upcoming-schedules-title">
        <S.Heading id="upcoming-schedules-title">다가오는 운영 일정</S.Heading>

        {calendar.upcoming.map(event => (
          <UpcomingEventCard
            key={event.id}
            event={event}
            featured={event.date === calendar.today}
          />
        ))}

        {!calendar.loading &&
  !calendar.errorMessage &&
  calendar.upcoming.length === 0 && (
          <S.UpcomingEmpty>
            예정된 운영 일정이 없어요.
          </S.UpcomingEmpty>
        )}

        {calendar.loading && (
  <S.EmptyMessage role="status">
    일정을 불러오는 중이에요.
  </S.EmptyMessage>
)}

{calendar.errorMessage && (
  <div>
    <S.StorageNotice role="alert">
      {calendar.errorMessage}
    </S.StorageNotice>

    {calendar.canRetry && (
      <S.AddButton
        type="button"
        disabled={calendar.refreshing}
        onClick={() => void calendar.reload()}
      >
        {calendar.refreshing ? '불러오는 중…' : '일정 다시 불러오기'}
      </S.AddButton>
    )}
  </div>
)}
        </S.UpcomingSection>
      </S.Content>

      {dateSheetOpen && (
        <SelectedDateSheet
          date={calendar.selectedDate}
          schedules={calendar.schedules}
          onClose={() => setDateSheetOpen(false)}
          onAdd={() => navigate(`/schedules/new?date=${encodeURIComponent(calendar.selectedDate)}`)}
          onSelectEvent={event =>
            navigate(`/schedules/${encodeURIComponent(event.id)}`)
          }
        />
      )}
    </MainLayout>
  )
}