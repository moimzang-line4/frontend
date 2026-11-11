import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useOperationNotes from '../../hooks/notes/useOperationNotes'
import OperationNoteCard from '../../components/notes/OperationNoteCard'
import NoteUnavailable from '../../components/notes/NoteUnavailable'
import { noteTypes } from '../../constants/notes/noteTypes'
import searchIcon from '../../assets/notes/search.svg'
import * as S from '../../styles/notes/NotesPage.styles'

export default function OperationNotesPage() {
  const navigate = useNavigate()
  const { schedule } = useScheduleDetail()
  const { notes } = useOperationNotes(schedule?.id ?? '')
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const selectedType = noteTypes.some(type => type.value === params.get('type')) ? params.get('type')! : 'all'
  if (!schedule || schedule.operationMenuCount === undefined) return <NoteUnavailable title="운영 메모" message="운영 메모를 사용할 일정을 찾을 수 없어요" backPath="/operations" />
  const basePath = `/schedules/${encodeURIComponent(schedule.id)}/operations/notes`
  const keyword = query.trim().toLocaleLowerCase()
  const filtered = notes.filter(note => (selectedType === 'all' || note.type === selectedType)
    && `${note.title} ${note.content} ${note.assignee}`.toLocaleLowerCase().includes(keyword))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, 'ko'))
  function selectType(type: string) {
    setParams(current => { const next = new URLSearchParams(current); if (type === 'all') next.delete('type'); else next.set('type', type); return next }, { replace: true })
  }
  return <S.Page $footer>
    <Header title="운영 메모" onBack={() => navigate(`/schedules/${encodeURIComponent(schedule.id)}`)} />
    <S.ListContent>
      <S.Search><img src={searchIcon} alt="" width={18} height={18} /><input type="search" aria-label="메모 검색" placeholder="메모 제목, 내용, 담당자 검색" value={query} onChange={event => setQuery(event.target.value)} /></S.Search>
      <S.Filters aria-label="메모 유형 필터">{[{ value: 'all', label: '전체' }, ...noteTypes].map(type => <S.Filter key={type.value} type="button" $active={selectedType === type.value} aria-pressed={selectedType === type.value} onClick={() => selectType(type.value)}>{type.label}</S.Filter>)}</S.Filters>
      <S.Heading><h2>메모 목록 {filtered.length}</h2><Link to={`${basePath}/new`}>+ 새 메모</Link></S.Heading>
      {filtered.length ? <S.List aria-label="운영 메모 목록">{filtered.map(note => <li key={note.id}><OperationNoteCard note={note} basePath={basePath} /></li>)}</S.List> : <S.Empty>{keyword ? '검색 결과가 없어요.' : selectedType === 'all' ? '아직 등록된 운영 메모가 없어요. 새 메모를 작성해 보세요.' : '이 유형의 운영 메모가 없어요.'}</S.Empty>}
    </S.ListContent>
    <Footer />
  </S.Page>
}
