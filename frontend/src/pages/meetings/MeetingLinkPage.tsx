import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import useSchedules from '../../hooks/schedules/useSchedules'
import useScheduleMinutes from '../../hooks/schedules/useScheduleMinutes'
import { meetingFinished, meetingToday } from '../../utils/meetings/store'
import searchIcon from '../../assets/operations/search.svg'
import calendarIcon from '../../assets/meetings/calendar.svg'
import * as P from '../../styles/meetings/MeetingPage.styles'
import * as C from '../../styles/meetings/MeetingCard.styles'
import * as S from '../../styles/meetings/MeetingLinkPage.styles'

export default function MeetingLinkPage() {
  const { scheduleId } = useParams()
  const navigate = useNavigate()
  const { schedules } = useSchedules()
  const { available, linkMany } = useScheduleMinutes(scheduleId)
  const schedule = schedules.find(item => item.id === scheduleId)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [error, setError] = useState('')
  const [today] = useState(meetingToday)
  if (!schedule) return <P.Page><Header title="회의록 찾기" /><P.Notice><h1>연결할 일정을 찾을 수 없어요</h1><Link to="/operations">운영 공간으로 이동</Link></P.Notice></P.Page>
  const returnPath = `/schedules/${encodeURIComponent(schedule.id)}`
  const keyword = query.trim().toLocaleLowerCase()
  const filtered = available.filter(item => `${item.title} ${item.categoryName} ${item.content}`.toLocaleLowerCase().includes(keyword))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.title.localeCompare(b.title, 'ko'))
  function confirm() {
    if (!selected.size) return
    try { linkMany([...selected]); navigate(returnPath, { replace: true }) }
    catch (caught) { setError(caught instanceof Error ? caught.message : '회의록을 연결하지 못했어요. 다시 시도해주세요.') }
  }
  return <P.Page>
    <Header title="회의록 찾기" onBack={() => navigate(returnPath)} rightAction={<S.Confirm type="button" disabled={!selected.size} onClick={confirm}>확인</S.Confirm>} />
    <P.Content>
      <S.Summary><h2>{schedule.title}</h2><p>연결할 회의록을 선택해주세요. 이미 연결된 회의록은 제외했어요.</p><p role="status">{selected.size}개 선택 · 검색 결과 {filtered.length}개</p></S.Summary>
      <S.Search><img src={searchIcon} alt="" width={20} height={20} /><input type="search" aria-label="연결할 회의록 검색" placeholder="회의 제목·카테고리·내용 검색" value={query} onChange={event => setQuery(event.target.value)} /></S.Search>
      {error && <P.Error role="alert">{error}</P.Error>}
      {filtered.length ? <S.List aria-label="연결할 회의록 목록">{filtered.map(item => <li key={item.id}>
        <S.Selectable>
          <C.Top><C.Badges>{meetingFinished(item, today) ? <C.Status $done>완료</C.Status> : item.status === 'in-progress' ? <C.Status $done={false}>진행 중</C.Status> : null}{item.categoryName && <C.Category>{item.categoryName}</C.Category>}</C.Badges><S.Checkbox aria-label={`${item.title} 선택`} checked={selected.has(item.id)} onChange={() => { setSelected(current => { const next = new Set(current); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); return next }); setError('') }} /></C.Top>
          <C.Title><h3>{item.title}</h3></C.Title><C.Preview>{item.agendas.map(agenda => agenda.preparation).filter(Boolean).join(', ') || item.content || '작성된 안건 내용이 없어요.'}</C.Preview>
          <S.Footer><span>안건 {item.agendas.length}개</span><span><img src={calendarIcon} alt="회의 날짜" width={14} height={14} />{item.date}</span></S.Footer>
        </S.Selectable>
      </li>)}</S.List> : <S.Empty>{keyword ? '검색 결과가 없어요.' : '추가로 연결할 회의록이 없어요.'}</S.Empty>}
    </P.Content>
  </P.Page>
}
