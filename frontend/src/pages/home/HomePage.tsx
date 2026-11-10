import { useState } from 'react'
import { useNavigate } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import settingsIcon from '../../assets/home/settings.svg'
import MonthCalendar from '../../components/home/MonthCalendar'
import UpcomingEventCard from '../../components/home/UpcomingEventCard'
import HomeDialog from '../../components/home/HomeDialog'
import SelectedDateSheet from '../../components/home/SelectedDateSheet'
import useHomeCalendar from '../../hooks/home/useHomeCalendar'
import * as S from '../../styles/home/HomePage.styles'
import * as D from '../../styles/home/HomeDialog.styles'

type Modal = 'settings' | null

export default function HomePage() {
  const calendar = useHomeCalendar()
  const navigate = useNavigate()
  const [modal, setModal] = useState<Modal>(null)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  return (
    <MainLayout title="홈" showBack={false} headerRightAction={
      <S.SettingsButton type="button" aria-label="설정" onClick={() => setModal('settings')}>
        <img src={settingsIcon} alt="" width={24} height={24} />
      </S.SettingsButton>
    } home>
      <S.Content>
        <S.SectionHeading>
          <S.Heading>{calendar.groupName} 일정 캘린더</S.Heading>
          <S.AddButton type="button" onClick={() => navigate('/schedules/new')}>＋ 일정 등록</S.AddButton>
        </S.SectionHeading>
        <MonthCalendar {...calendar} onMonthChange={calendar.changeMonth} onSelectDate={date => { calendar.setSelectedDate(date); setDateSheetOpen(true) }} onSelectEvent={event => navigate(`/schedules/${encodeURIComponent(event.id)}`)} />
        <S.Heading>다가오는 운영 일정</S.Heading>
        {calendar.upcoming.map((event, index) => <UpcomingEventCard key={event.id} event={event} featured={index === 0} />)}
        {calendar.upcoming.length === 0 && <S.EmptyMessage>예정된 운영 일정이 없어요.</S.EmptyMessage>}
        {calendar.storageError && <S.StorageNotice role="status">브라우저 저장 공간에 접근할 수 없어 변경 내용은 새로고침하면 사라질 수 있어요.</S.StorageNotice>}
      </S.Content>
      {modal === 'settings' && <HomeDialog title="설정" onClose={() => setModal(null)}>
        <D.Form onSubmit={event => {
          event.preventDefault()
          const name = String(new FormData(event.currentTarget).get('groupName') ?? '').trim()
          if (!name) return
          calendar.setGroupName(name)
          setModal(null)
        }}>
          <D.Label>모임 이름<D.Input name="groupName" required maxLength={30} defaultValue={calendar.groupName} /></D.Label>
          <Button type="submit">저장</Button>
        </D.Form>
      </HomeDialog>}
      {dateSheetOpen && <SelectedDateSheet
        date={calendar.selectedDate}
        schedules={calendar.schedules}
        onClose={() => setDateSheetOpen(false)}
        onAdd={() => navigate('/schedules/new')}
        onSelectEvent={event => navigate(`/schedules/${encodeURIComponent(event.id)}`)}
      />}
    </MainLayout>
  )
}
