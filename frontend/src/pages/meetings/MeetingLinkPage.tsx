import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import useSchedules from '../../hooks/schedules/useSchedules'
import useScheduleMinutes from '../../hooks/schedules/useScheduleMinutes'
import AgendaAccordion from '../../components/meetings/AgendaAccordion'
import MeetingAccordion from '../../components/meetings/MeetingAccordion'
import { meetingToday } from '../../utils/meetings/store'
import { agendaKey, agendaTitle, meetingAgendas } from '../../utils/meetings/agendaLinks'
import searchIcon from '../../assets/operations/search.svg'
import * as P from '../../styles/meetings/MeetingPage.styles'
import * as A from '../../styles/meetings/MeetingAttachments.styles'
import * as S from '../../styles/meetings/MeetingLinkPage.styles'

export default function MeetingLinkPage() {
  const { scheduleId } = useParams()
  const navigate = useNavigate()
  const { schedules } = useSchedules()
  const { minutes, available, linkSelection } = useScheduleMinutes(scheduleId)
  const schedule = schedules.find(item => item.id === scheduleId)
  const [kind, setKind] = useState<'agenda' | 'meeting'>('agenda')
  const [query, setQuery] = useState('')
  const [selectedMeetings, setSelectedMeetings] = useState<Set<string>>(() => new Set())
  const [selectedAgendas, setSelectedAgendas] = useState<Set<string>>(() => new Set())
  const [error, setError] = useState('')
  const [today] = useState(meetingToday)
  if (!schedule || schedule.operationMenuCount === undefined) return <P.Page><Header title="회의록 안건" /><P.Notice><h1>연결할 일정을 찾을 수 없어요</h1><Link to="/operations">운영 공간으로 이동</Link></P.Notice></P.Page>
  const returnPath = `/schedules/${encodeURIComponent(schedule.id)}`
  const keyword = query.trim().toLocaleLowerCase()
  const agendas = meetingAgendas(minutes).filter(({ agenda }) => !agenda.scheduleIds?.includes(schedule.id))
    .filter(({ meeting, agenda }) => `${meeting.title} ${meeting.categoryName} ${agendaTitle(agenda)} ${agenda.preparation} ${agenda.discussion} ${agenda.decision}`.toLocaleLowerCase().includes(keyword))
    .sort((a, b) => b.meeting.createdAt.localeCompare(a.meeting.createdAt) || a.index - b.index)
  const meetings = available.filter(item => `${item.title} ${item.categoryName} ${item.content}`.toLocaleLowerCase().includes(keyword))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.title.localeCompare(b.title, 'ko'))
  const count = selectedAgendas.size + selectedMeetings.size
  function toggle(value: string, type: 'agenda' | 'meeting') {
    const setter = type === 'agenda' ? setSelectedAgendas : setSelectedMeetings
    setter(current => { const next = new Set(current); if (next.has(value)) next.delete(value); else next.add(value); return next })
    setError('')
  }
  function confirm() {
    if (!count) return
    try {
      linkSelection({ meetingIds: [...selectedMeetings], agendas: [...selectedAgendas].map(key => { const [meetingId, agendaId] = JSON.parse(key) as [string, string]; return { meetingId, agendaId } }) })
      navigate(returnPath, { replace: true })
    } catch (caught) { setError(caught instanceof Error ? caught.message : '연결하지 못했어요. 다시 시도해주세요.') }
  }
  return <S.Page>
    <Header title="회의록 안건" onBack={() => navigate(returnPath)} />
    <S.Content>
      <A.Tabs aria-label="연결할 항목 유형">{([{ value: 'agenda', label: '안건' }, { value: 'meeting', label: '회의록' }] as const).map(tab => <A.Tab key={tab.value} type="button" $active={kind === tab.value} aria-pressed={kind === tab.value} onClick={() => setKind(tab.value)}>{tab.label}</A.Tab>)}</A.Tabs>
      <S.Count><h2>{kind === 'agenda' ? '안건' : '회의록'} {kind === 'agenda' ? agendas.length : meetings.length}개</h2><span role="status">{count}개 선택</span></S.Count>
      <S.Toolbar><S.Search><img src={searchIcon} alt="" width={20} height={20} /><input type="search" aria-label={kind === 'agenda' ? '안건 검색' : '회의록 검색'} placeholder={kind === 'agenda' ? '안건 검색' : '회의록 검색'} value={query} onChange={event => setQuery(event.target.value)} /></S.Search><S.Add type="button" disabled={!count} onClick={confirm}>+추가{count > 0 ? ` (${count})` : ''}</S.Add></S.Toolbar>
      {error && <P.Error role="alert">{error}</P.Error>}
      {kind === 'agenda' ? (agendas.length ? <S.List aria-label="연결할 안건 목록">{agendas.map(({ meeting, agenda, index }) => <li key={agendaKey(meeting.id, agenda.id)}><AgendaAccordion meeting={meeting} agenda={agenda} index={index} today={today} selected={selectedAgendas.has(agendaKey(meeting.id, agenda.id))} onSelect={() => toggle(agendaKey(meeting.id, agenda.id), 'agenda')} /></li>)}</S.List> : <S.Empty>{keyword ? '검색 결과가 없어요.' : '추가로 연결할 안건이 없어요.'}</S.Empty>)
        : (meetings.length ? <S.List aria-label="연결할 회의록 목록">{meetings.map(meeting => <li key={meeting.id}><MeetingAccordion meeting={meeting} today={today} selected={selectedMeetings.has(meeting.id)} onSelect={() => toggle(meeting.id, 'meeting')} /></li>)}</S.List> : <S.Empty>{keyword ? '검색 결과가 없어요.' : '추가로 연결할 회의록이 없어요.'}</S.Empty>)}
    </S.Content>
  </S.Page>
}
