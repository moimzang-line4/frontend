import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import CategorySheet from '../../components/schedules/CategorySheet'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useMeetings from '../../hooks/meetings/useMeetings'
import useCategories from '../../hooks/schedules/useCategories'
import { meetingListPath, newAgenda } from '../../utils/meetings/store'
import type { Meeting, MeetingAgenda } from '../../types/meetings/meeting'
import type { CategoryOption } from '../../types/schedules/schedule'
import calendarIcon from '../../assets/schedules/calendar.svg'
import chevronIcon from '../../assets/schedules/date-chevron.svg'
import * as S from '../../styles/meetings/MeetingPage.styles'

function MeetingForm({ meeting }: { meeting?: Meeting }) {
  const navigate = useNavigate()
  const { create, update, remove } = useMeetings()
  const { categories } = useCategories()
  const [title, setTitle] = useState(meeting?.title ?? '')
  const [date, setDate] = useState(meeting?.date ?? '')
  const [category, setCategory] = useState<CategoryOption | null>(meeting?.categoryName ? categories.find(item => item.label === meeting.categoryName) ?? { id: meeting.categoryName, label: meeting.categoryName, kind: 'custom' } : null)
  const [participants, setParticipants] = useState(meeting?.participants ?? '')
  const [agendas, setAgendas] = useState<MeetingAgenda[]>(() => meeting?.agendas ?? [newAgenda()])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState('')
  const canSubmit = !!(title.trim() && date && category && agendas[0]?.preparation.trim())
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    const input = { title: title.trim(), date, categoryName: category!.label, participants: participants.trim(), agendas: agendas.map(agenda => ({ ...agenda, preparation: agenda.preparation.trim() })) }
    try {
      if (meeting) update(meeting.id, input)
      else create(input)
      navigate(meetingListPath({ date, status: meeting?.status ?? 'draft' }), { replace: true })
    } catch { setError('회의록을 저장하지 못했어요. 브라우저 저장 공간을 확인해주세요.') }
  }
  return <S.Page>
    <Header title="회의 만들기" onBack={() => navigate(meetingListPath(meeting))} />
    <S.Content><S.Form onSubmit={submit}>
      <S.Card>
        <S.Row><label htmlFor="meeting-title">회의 제목 <S.Required>*</S.Required></label><input aria-label="회의 제목" id="meeting-title" required maxLength={80} placeholder="회의 제목을 입력해주세요" value={title} onChange={event => setTitle(event.target.value)} /></S.Row>
        <S.Row><label htmlFor="meeting-date">회의 날짜 <S.Required>*</S.Required></label><S.Picker><span><img src={calendarIcon} alt="" width={18} height={18} />{date || '날짜 선택'}</span><img src={chevronIcon} alt="" width={21} height={21} /><input aria-label="회의 날짜" id="meeting-date" type="date" required value={date} onChange={event => setDate(event.target.value)} /></S.Picker></S.Row>
        <S.Row><span id="meeting-category-label">카테고리 <S.Required>*</S.Required></span><S.Category type="button" aria-label={`카테고리: ${category?.label ?? '선택해 주세요'}`} aria-haspopup="dialog" aria-expanded={categoryOpen} onClick={() => setCategoryOpen(true)}>{category?.label ?? ''}<img src={chevronIcon} alt="" width={21} height={21} /></S.Category></S.Row>
        <S.Row><label htmlFor="meeting-participants">참석자</label><input id="meeting-participants" maxLength={300} placeholder="예: 김가은, 홍보팀" value={participants} onChange={event => setParticipants(event.target.value)} /></S.Row>
        {agendas.map((agenda, index) => <S.Agenda key={agenda.id} aria-label={`안건 ${index + 1}`}>
          <S.AgendaHeading><label htmlFor={`agenda-${agenda.id}`}>안건 {index + 1} {index === 0 && <S.Required>*</S.Required>}</label><S.Counter>{index > 0 && <><button type="button" aria-label={`안건 ${index + 1} 삭제`} onClick={() => setAgendas(current => current.filter(value => value.id !== agenda.id))}>삭제</button><span>|</span></>}<span>{agenda.preparation.length}/100</span></S.Counter></S.AgendaHeading>
          <S.Textarea aria-label={`안건 ${index + 1}`} id={`agenda-${agenda.id}`} required={index === 0} maxLength={100} placeholder="준비 사항, 아이디어, 결정 사항을 자유롭게 기록해 주세요." value={agenda.preparation} onChange={event => setAgendas(current => current.map(value => value.id === agenda.id ? { ...value, preparation: event.target.value } : value))} />
        </S.Agenda>)}
        <S.AddWrap><S.OutlineButton type="button" onClick={() => setAgendas(current => [...current, newAgenda()])}>+ 안건 추가</S.OutlineButton></S.AddWrap>
      </S.Card>
      {error && <S.Error role="alert">{error}</S.Error>}
      <S.Submit type="submit" disabled={!canSubmit}>{meeting ? '수정하기' : '등록하기'}</S.Submit>
      {meeting && <S.OutlineButton type="button" $danger onClick={() => setDeleteOpen(true)}>삭제하기</S.OutlineButton>}
    </S.Form></S.Content>
    {categoryOpen && <CategorySheet selectedId={category?.id} onSelect={setCategory} onClose={() => setCategoryOpen(false)} />}
    <ConfirmDialog open={deleteOpen} title="회의록을 삭제할까요?" description="안건과 논의 내용도 함께 삭제되며 복구할 수 없어요." confirmText="삭제하기" onCancel={() => setDeleteOpen(false)} onConfirm={() => { if (meeting) remove(meeting.id); navigate('/operations?type=minute', { replace: true }) }} />
  </S.Page>
}
export default function MeetingFormPage() {
  const { meetingId } = useParams()
  const { meetings } = useMeetings()
  const meeting = meetings.find(item => item.id === meetingId)
  if (meetingId && !meeting) return <S.Page><Header title="회의 만들기" /><S.Notice><h1>회의록을 찾을 수 없어요</h1><Link to="/operations?type=minute">회의록 목록으로 이동</Link></S.Notice></S.Page>
  return <MeetingForm key={meetingId ?? 'new'} meeting={meeting} />
}
