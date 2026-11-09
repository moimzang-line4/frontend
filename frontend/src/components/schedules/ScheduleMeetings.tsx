import { useState } from 'react'
import Button from '../Button'
import HomeDialog from '../home/HomeDialog'
import useScheduleMinutes from '../../hooks/schedules/useScheduleMinutes'
import type { ScheduleMinute } from '../../types/schedules/schedule'
import * as S from '../../styles/schedules/ScheduleDetailPage.styles'
import * as D from '../../styles/home/HomeDialog.styles'

type Props = { scheduleId: string }
export default function ScheduleMeetings({ scheduleId }: Props) {
  const { linked, available, create, link } = useScheduleMinutes(scheduleId)
  const [modal, setModal] = useState<'create' | 'find' | ScheduleMinute | null>(null)
  const [error, setError] = useState('')
  return (
    <S.MeetingSection aria-label="연결된 회의록">
      <S.SectionHeading><h2>연결된 회의록</h2><S.TextButton type="button" onClick={() => { setError(''); setModal('create') }}>+ 만들기</S.TextButton></S.SectionHeading>
      {linked.length ? <S.MeetingList>{linked.map(item => <S.MeetingButton type="button" key={item.id} onClick={() => setModal(item)}>{item.title}</S.MeetingButton>)}</S.MeetingList> : <S.Empty><h3>연결할 회의록이 없어요</h3><p>일정과 관련된 회의를 작성한 뒤<br />이 일정에 연결할 수 있어요.</p></S.Empty>}
      <S.FindButton type="button" onClick={() => { setError(''); setModal('find') }}>연동할 회의록 찾기</S.FindButton>
      {modal === 'create' && <HomeDialog title="회의록 만들기" onClose={() => setModal(null)}>
        <D.Form onSubmit={event => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const title = String(data.get('title') ?? '').trim()
          if (!title) return
          try { create(title, String(data.get('content') ?? '')); setModal(null) }
          catch { setError('회의록을 저장하지 못했어요. 다시 시도해주세요.') }
        }}>
          <D.Label>회의록 제목<D.Input name="title" required maxLength={80} /></D.Label>
          <D.Label>회의 내용<S.Textarea name="content" maxLength={10000} /></D.Label>
          {error && <p role="alert">{error}</p>}
          <Button type="submit">저장</Button>
        </D.Form>
      </HomeDialog>}
      {modal === 'find' && <HomeDialog title="연동할 회의록 찾기" onClose={() => setModal(null)}>
        {available.length ? <S.MeetingList>{available.map(item => <S.MeetingButton key={item.id} type="button" onClick={() => {
          try { link(item.id); setModal(null) } catch { setError('회의록을 연결하지 못했어요. 다시 시도해주세요.') }
        }}>{item.title}</S.MeetingButton>)}</S.MeetingList> : <p>연결할 회의록이 없어요.</p>}
        {error && <p role="alert">{error}</p>}
      </HomeDialog>}
      {modal && typeof modal === 'object' && <HomeDialog title={modal.title} onClose={() => setModal(null)}><S.RecordContent>{modal.content || '작성된 내용이 없어요.'}</S.RecordContent></HomeDialog>}
    </S.MeetingSection>
  )
}
