import { useState } from 'react'
import { useNavigate } from 'react-router'
import useScheduleMinutes from '../../hooks/schedules/useScheduleMinutes'
import ConfirmDialog from '../common/ConfirmDialog'
import chevronIcon from '../../assets/meetings/linked-chevron.svg'
import * as C from '../../styles/meetings/LinkedMeetingCard.styles'
import * as S from '../../styles/schedules/ScheduleDetailPage.styles'

type Props = { scheduleId: string }
export default function ScheduleMeetings({ scheduleId }: Props) {
  const navigate = useNavigate()
  const { linked, unlink } = useScheduleMinutes(scheduleId)
  const [editing, setEditing] = useState(false)
  const [unlinkId, setUnlinkId] = useState<string | null>(null)
  return (
    <S.MeetingSection aria-label="연결된 회의록">
      <S.SectionHeading><h2>연결된 회의록</h2>{linked.length ? <C.EditButton type="button" onClick={() => setEditing(value => !value)}>{editing ? '완료' : '수정'}</C.EditButton> : <S.TextButton type="button" onClick={() => navigate(`/meetings/new?scheduleId=${encodeURIComponent(scheduleId)}`)}>+ 만들기</S.TextButton>}</S.SectionHeading>
      {linked.length ? <C.List>{linked.map(item => {
        const index = Math.max(0, item.agendas.findIndex(agenda => agenda.id === item.activeAgendaId))
        const agenda = item.agendas[index]
        return <div key={item.id}><C.Card to={`/meetings/${encodeURIComponent(item.id)}?scheduleId=${encodeURIComponent(scheduleId)}`} aria-label={`${item.title} 안건 확인 및 수정`}>
          <div><div><strong>회의 | {item.date.replaceAll('-', '.')}</strong><h3>{item.title}</h3></div><p>안건 {index + 1} · {agenda.preparation || '등록된 안건 내용이 없어요.'}</p></div>
          <img src={chevronIcon} alt="" width={24} height={24} />
        </C.Card>{editing && <C.ManageRow><button type="button" aria-label={`${item.title} 연결 해제`} onClick={() => setUnlinkId(item.id)}>연결 해제</button></C.ManageRow>}</div>
      })}</C.List> : <S.Empty><h3>연결할 회의록이 없어요</h3><p>일정과 관련된 회의를 작성한 뒤<br />이 일정에 연결할 수 있어요.</p></S.Empty>}
      {editing && linked.length > 0 && <C.CreateButton type="button" onClick={() => navigate(`/meetings/new?scheduleId=${encodeURIComponent(scheduleId)}`)}>+ 새 회의록 만들기</C.CreateButton>}
      <S.FindButton type="button" onClick={() => navigate(`/schedules/${encodeURIComponent(scheduleId)}/meetings/link`)}>연동할 회의록 찾기</S.FindButton>
      <ConfirmDialog open={!!unlinkId} title="회의록 연결을 해제할까요?" description="이 일정과의 연결만 해제되며, 회의록은 운영 공간에 유지돼요." confirmText="연결 해제" onCancel={() => setUnlinkId(null)} onConfirm={() => { if (unlinkId) unlink(unlinkId); setUnlinkId(null) }} />
    </S.MeetingSection>
  )
}
