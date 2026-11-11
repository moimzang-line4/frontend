import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useMeetings, { startMeeting } from '../../hooks/meetings/useMeetings'
import { meetingFinished, meetingListPath, meetingToday } from '../../utils/meetings/store'
import type { Meeting, MeetingAgenda } from '../../types/meetings/meeting'
import * as S from '../../styles/meetings/MeetingPage.styles'

function AgendaEditor({ meeting, agenda, index, onError }: { meeting: Meeting; agenda: MeetingAgenda; index: number; onError: (error: string) => void }) {
  const { saveAgenda } = useMeetings()
  const [draft, setDraft] = useState(agenda)
  const [today] = useState(meetingToday)
  const readOnly = meetingFinished(meeting, today)
  function change(key: 'discussion' | 'decision', value: string) {
    const next = { ...draft, [key]: value }
    setDraft(next)
    try { saveAgenda(meeting.id, next); onError('') }
    catch { onError('내용을 저장하지 못했어요. 브라우저 저장 공간을 확인한 뒤 다시 입력해주세요.') }
  }
  return <S.RunCard>
    <S.RunHeading><h3>안건 {index + 1} {index === 0 && <S.Required>*</S.Required>}</h3><S.Status $done={agenda.completed || readOnly}>{agenda.completed || readOnly ? '완료' : '진행 중'}</S.Status></S.RunHeading>
    <S.Preparation>{agenda.preparation || '등록된 준비 내용이 없어요.'}</S.Preparation>
    <S.RunField>논의 내용<S.Textarea aria-label={`안건 ${index + 1} 논의 내용`} maxLength={10000} readOnly={readOnly} placeholder="회의에서 나온 의견을 기록해주세요." value={draft.discussion} onChange={event => change('discussion', event.target.value)} /></S.RunField>
    <S.RunField>결정 사항<S.Textarea aria-label={`안건 ${index + 1} 결정 사항`} maxLength={10000} readOnly={readOnly} placeholder="회의에서 결정된 사항을 작성해주세요." value={draft.decision} onChange={event => change('decision', event.target.value)} /></S.RunField>
  </S.RunCard>
}
function MeetingRun({ meeting }: { meeting: Meeting }) {
  const navigate = useNavigate()
  const { selectAgenda, completeAgenda } = useMeetings()
  const [today] = useState(meetingToday)
  const [stopOpen, setStopOpen] = useState(false)
  const [error, setError] = useState('')
  const index = Math.max(0, meeting.agendas.findIndex(agenda => agenda.id === meeting.activeAgendaId))
  const agenda = meeting.agendas[index]
  const count = meeting.agendas.filter(value => value.completed).length
  const percent = Math.round(count / meeting.agendas.length * 100)
  const finished = meetingFinished(meeting, today)
  useEffect(() => {
    if (meeting.status !== 'draft' || finished) return
    let cancelled = false
    Promise.resolve().then(() => { if (!cancelled) startMeeting(meeting.id) }).catch(() => { if (!cancelled) setError('회의 진행 상태를 저장하지 못했어요.') })
    return () => { cancelled = true }
  }, [meeting.id, meeting.status, finished])
  function complete() {
    try {
      completeAgenda(meeting.id, agenda)
      setError('')
      if (meeting.agendas.every(value => value.completed || value.id === agenda.id)) navigate(meetingListPath({ ...meeting, status: 'completed' }), { replace: true })
    } catch { setError('안건 완료 상태를 저장하지 못했어요. 다시 시도해주세요.') }
  }
  return <S.Page>
    <Header title="회의 진행" onBack={() => finished ? navigate(meetingListPath(meeting)) : setStopOpen(true)} />
    <S.Content>
      <S.Heading><h2>{meeting.title}</h2><p>{meeting.date}</p></S.Heading>
      <S.ProgressCard><div><S.ProgressHeading><h3>안건 진행률</h3><span>{count}/{meeting.agendas.length} 완료</span></S.ProgressHeading><S.ProgressText><span>{finished ? '종료된 회의' : `안건 ${index + 1} 논의 중`}</span><strong>{percent}%</strong></S.ProgressText></div><S.Progress aria-label="안건 진행률" max={100} value={percent} /></S.ProgressCard>
      <S.AgendaTabs aria-label="안건 선택">{meeting.agendas.map((value, position) => <S.AgendaTab key={value.id} type="button" disabled={!!error} $active={index === position} aria-pressed={index === position} onClick={() => { try { selectAgenda(meeting.id, value.id) } catch { setError('안건을 전환하지 못했어요.') } }}>안건 {position + 1}{value.completed ? ' ✓' : ''}</S.AgendaTab>)}</S.AgendaTabs>
      <AgendaEditor key={agenda.id} meeting={meeting} agenda={agenda} index={index} onError={setError} />
      {error && <S.Error role="alert">{error}</S.Error>}
      {finished ? <S.Submit onClick={() => navigate(`/meetings/${encodeURIComponent(meeting.id)}`)}>안건 확인 및 수정</S.Submit> : <><S.Submit disabled={!!error} onClick={complete}>{meeting.agendas.every(value => value.completed || value.id === agenda.id) ? '회의 완료하기' : '다음 안건'}</S.Submit><S.OutlineButton type="button" $danger onClick={() => setStopOpen(true)}>회의 중단하기</S.OutlineButton></>}
    </S.Content>
    <ConfirmDialog open={stopOpen} title="회의를 중단할까요?" description="저장된 논의 내용과 결정 사항은 유지되며, 나중에 회의를 이어갈 수 있어요." confirmText="중단하기" onCancel={() => setStopOpen(false)} onConfirm={() => {
      if (error) throw new Error('저장하지 못한 내용이 있어요. 취소 후 저장 공간을 확인해주세요.')
      navigate(meetingListPath(meeting), { replace: true })
    }} />
  </S.Page>
}
export default function MeetingRunPage() {
  const { meetingId } = useParams()
  const { meetings } = useMeetings()
  const meeting = meetings.find(item => item.id === meetingId)
  if (!meeting) return <S.Page><Header title="회의 진행" /><S.Notice><h1>회의록을 찾을 수 없어요</h1><Link to="/operations?type=minute">회의록 목록으로 이동</Link></S.Notice></S.Page>
  return <MeetingRun key={meeting.id} meeting={meeting} />
}
