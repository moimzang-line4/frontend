import { useState } from 'react'
import { Link } from 'react-router'
import useScheduleMinutes from '../../hooks/schedules/useScheduleMinutes'
import ConfirmDialog from '../common/ConfirmDialog'
import AgendaAccordion from '../meetings/AgendaAccordion'
import MeetingAccordion from '../meetings/MeetingAccordion'
import { meetingAgendas } from '../../utils/meetings/agendaLinks'
import { meetingToday } from '../../utils/meetings/store'
import emptyIcon from '../../assets/meetings/empty-paper.svg'
import * as S from '../../styles/meetings/MeetingAttachments.styles'

type Props = { scheduleId: string }
type Disconnect = { meetingId: string; agendaId?: string } | null
export default function ScheduleMeetings({ scheduleId }: Props) {
  const { minutes, linked, unlink, unlinkAgenda } = useScheduleMinutes(scheduleId)
  const [filter, setFilter] = useState<'all' | 'meeting' | 'agenda'>('all')
  const [disconnect, setDisconnect] = useState<Disconnect>(null)
  const [today] = useState(meetingToday)
  const agendas = meetingAgendas(minutes).filter(({ agenda }) => agenda.scheduleIds?.includes(scheduleId))
  const hasContent = linked.length > 0 || agendas.length > 0
  const hasVisibleContent = filter === 'meeting' ? linked.length > 0 : filter === 'agenda' ? agendas.length > 0 : hasContent
  const createPath = `/meetings/new?scheduleId=${encodeURIComponent(scheduleId)}`
  return <S.Section aria-label="회의록 & 안건">
    <S.Top><S.Heading><h2>회의록 &amp; 안건</h2>{hasContent && <Link to={createPath}>+ 만들기</Link>}</S.Heading>
      <S.Tabs aria-label="연결 항목 유형">{([{ value: 'all', label: '전체' }, { value: 'meeting', label: '회의록' }, { value: 'agenda', label: '안건' }] as const).map(tab => <S.Tab key={tab.value} type="button" $active={filter === tab.value} aria-pressed={filter === tab.value} onClick={() => setFilter(tab.value)}>{tab.label}</S.Tab>)}</S.Tabs>
    </S.Top>
    {hasVisibleContent ? <S.List>
      {filter !== 'agenda' && linked.map(meeting => <li key={`meeting-${meeting.id}`}><MeetingAccordion meeting={meeting} today={today} scheduleId={scheduleId} onUnlink={() => setDisconnect({ meetingId: meeting.id })} /></li>)}
      {filter !== 'meeting' && agendas.map(({ meeting, agenda, index }) => <li key={`agenda-${meeting.id}-${agenda.id}`}><AgendaAccordion meeting={meeting} agenda={agenda} index={index} today={today} onUnlink={() => setDisconnect({ meetingId: meeting.id, agendaId: agenda.id })} /></li>)}
    </S.List> : <S.Empty><img src={emptyIcon} alt="" width={24} height={24} /><div><strong>{hasContent ? `연결된 ${filter === 'meeting' ? '회의록이' : '안건이'} 없어요` : '아직 등록된 내용이 없어요'}</strong><p>만들었던 회의의 관련 안건을 연결하거나<br />내용에 맞는 회의를 만들어보세요.</p></div></S.Empty>}
    <S.Actions><S.Action to={`/schedules/${encodeURIComponent(scheduleId)}/meetings/link`}>안건 연결하기</S.Action><S.Action $primary to={createPath}>회의록 작성하기</S.Action></S.Actions>
    <ConfirmDialog open={!!disconnect} title="연결을 끊을까요?" description="이 일정과의 연결만 해제되며, 회의록과 안건 내용은 유지돼요." confirmText="연결 끊기" onCancel={() => setDisconnect(null)} onConfirm={() => {
      if (disconnect?.agendaId) unlinkAgenda(disconnect.meetingId, disconnect.agendaId)
      else if (disconnect) unlink(disconnect.meetingId)
      setDisconnect(null)
    }} />
  </S.Section>
}
