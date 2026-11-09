import { useState } from 'react'
import { Link } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import HomeHeader from '../../components/home/HomeHeader'
import MonthCalendar from '../../components/home/MonthCalendar'
import UpcomingEventCard from '../../components/home/UpcomingEventCard'
import HomeDialog from '../../components/home/HomeDialog'
import ScheduleForm from '../../components/home/ScheduleForm'
import useHomeCalendar from '../../hooks/home/useHomeCalendar'
import type { HomeSchedule } from '../../types/home/schedule'
import * as S from '../../styles/home/HomePage.styles'
import * as D from '../../styles/home/HomeDialog.styles'

type Modal = 'create' | 'settings' | HomeSchedule | null

export default function HomePage() {
  const calendar = useHomeCalendar()
  const [modal, setModal] = useState<Modal>(null)
  return (
    <MainLayout title="moimzang" showBack={false} header={<HomeHeader onSettings={() => setModal('settings')} />} home>
      <S.Content>
        <S.SectionHeading>
          <S.Heading>{calendar.groupName} 일정 캘린더</S.Heading>
          <S.AddButton type="button" onClick={() => setModal('create')}>＋ 일정 등록</S.AddButton>
        </S.SectionHeading>
        <MonthCalendar {...calendar} onMonthChange={calendar.changeMonth} onSelectDate={calendar.setSelectedDate} onSelectEvent={setModal} />
        <S.Heading>다가오는 운영 일정</S.Heading>
        {calendar.upcoming.map((event, index) => <UpcomingEventCard key={event.id} event={event} featured={index === 0} />)}
        {calendar.storageError && <S.StorageNotice role="status">브라우저 저장 공간에 접근할 수 없어 변경 내용은 새로고침하면 사라질 수 있어요.</S.StorageNotice>}
      </S.Content>
      {modal === 'create' && <HomeDialog title="일정 등록" onClose={() => setModal(null)}><ScheduleForm initialDate={calendar.selectedDate} onSubmit={value => { calendar.addSchedule(value); setModal(null) }} /></HomeDialog>}
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
      {modal && typeof modal === 'object' && <HomeDialog title={modal.title} onClose={() => setModal(null)}>
        <D.Detail><p>{modal.date.replaceAll('-', '.')}</p>{modal.venue && <p>{modal.venue}</p>}<Link to={`/operations?event=${encodeURIComponent(modal.id)}`}>운영 공간으로 이동</Link></D.Detail>
      </HomeDialog>}
    </MainLayout>
  )
}
