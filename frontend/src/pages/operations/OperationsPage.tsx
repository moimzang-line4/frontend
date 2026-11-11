import { useState } from 'react'
import { useNavigate } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import HomeDialog from '../../components/home/HomeDialog'
import CreateOperationSheet from '../../components/operations/CreateOperationSheet'
import SortOperationSheet from '../../components/operations/SortOperationSheet'
import { sortLabels } from '../../constants/operations/sortOptions'
import useOperationRecords from '../../hooks/operations/useOperationRecords'
import useDemoGroup from '../../hooks/groups/useDemoGroup'
import searchIcon from '../../assets/operations/search.svg'
import caretIcon from '../../assets/operations/caret.svg'
import chevronIcon from '../../assets/operations/record-chevron.svg'
import type { OperationFilter } from '../../types/operations/operation'
import * as S from '../../styles/operations/OperationsPage.styles'
import * as D from '../../styles/home/HomeDialog.styles'

export default function OperationsPage() {
  const navigate = useNavigate()
  const data = useOperationRecords()
  const { group } = useDemoGroup()
  const [modal, setModal] = useState<'create' | 'sort' | 'minute' | { id: string } | null>(null)
  const [error, setError] = useState('')
  const minute = typeof modal === 'object' && modal ? data.minutes.find(item => item.id === modal.id) : undefined
  return <MainLayout title="운영 공간" showBack={false} headerAlign="left" home>
    <S.Content>
      <S.Generation><select aria-label="조회할 운영 연도" value={data.year} onChange={event => data.setYear(event.target.value)}>{data.years.map(year => <option key={year} value={year}>{year === data.currentYear ? `${group.generation} (${year})` : `${year}년`}</option>)}</select><img src={caretIcon} alt="" width={12} height={12} /></S.Generation>
      <S.Tabs aria-label="운영 기록 기간">{[{ value: false, label: '진행 중' }, { value: true, label: '지난 기록' }].map(tab => <S.Tab key={tab.label} type="button" $active={data.past === tab.value} aria-pressed={data.past === tab.value} onClick={() => data.setPast(tab.value)}>{tab.label}</S.Tab>)}</S.Tabs>
      <S.SearchRow>
        <S.Search><img src={searchIcon} alt="" width={20} height={20} /><input type="search" aria-label="일정·회의록 검색" placeholder="일정·회의록 검색" value={data.query} onChange={event => data.setQuery(event.target.value)} /></S.Search>
        <S.Sort type="button" aria-label={`기록 정렬: ${sortLabels[data.sort]}`} aria-haspopup="dialog" aria-expanded={modal === 'sort'} onClick={() => setModal('sort')}>{sortLabels[data.sort]}<img src={caretIcon} alt="" width={12} height={12} /></S.Sort>
      </S.SearchRow>
      <S.Filters aria-label="운영 기록 유형">{([['all', '전체'], ['schedule', '일정 운영'], ['minute', '회의록']] as [OperationFilter, string][]).map(([value, label]) => <S.Filter key={value} type="button" $active={data.filter === value} aria-pressed={data.filter === value} onClick={() => data.setFilter(value)}>{label}</S.Filter>)}</S.Filters>
      <S.Heading><h2>운영 기록 {data.records.length}개</h2><button type="button" aria-haspopup="dialog" onClick={() => setModal('create')}>＋ 만들기</button></S.Heading>
      {data.records.length ? <S.Records aria-label="운영 기록 목록">{data.records.map(record => <li key={`${record.kind}-${record.id}`}><S.Record type="button" onClick={() => record.kind === 'schedule' ? navigate(`/schedules/${encodeURIComponent(record.id)}`) : setModal({ id: record.id })}>
        <div><S.Badge $minute={record.kind === 'minute'}>{record.kind === 'minute' ? '회의록' : '일정 운영'}</S.Badge><div><h3>{record.title}</h3><p>{record.date.replaceAll('-', '.')} · {record.past ? '지난 기록' : '진행 중'}</p></div></div><img src={chevronIcon} alt="" width={24} height={24} />
      </S.Record></li>)}</S.Records> : <S.Empty>{data.query ? '검색 결과가 없어요.' : '아직 운영 기록이 없어요. 만들기에서 새로운 기록을 추가해 보세요.'}</S.Empty>}
    </S.Content>
    {modal === 'sort' && <SortOperationSheet selected={data.sort} onSelect={data.setSort} onClose={() => setModal(null)} />}
    {modal === 'create' && <CreateOperationSheet onClose={() => setModal(null)} onSchedule={() => navigate('/schedules/new?from=operations')} onMinute={() => { setError(''); setModal('minute') }} />}
    {modal === 'minute' && <HomeDialog title="회의록 작성하기" onClose={() => setModal(null)}><D.Form onSubmit={event => {
      event.preventDefault()
      const form = new FormData(event.currentTarget)
      const title = String(form.get('title') ?? '').trim()
      if (!title) return
      try { data.create(title, String(form.get('content') ?? '')); data.setYear(data.currentYear); data.setPast(false); data.setFilter('all'); data.setQuery(''); setModal(null) }
      catch { setError('회의록을 저장하지 못했어요. 다시 시도해주세요.') }
    }}><D.Label>회의록 제목<D.Input name="title" required maxLength={80} /></D.Label><D.Label>회의 내용<S.Textarea name="content" maxLength={10000} /></D.Label>{error && <p role="alert">{error}</p>}<Button type="submit">저장</Button></D.Form></HomeDialog>}
    {minute && <HomeDialog title={minute.title} onClose={() => setModal(null)}><S.MinuteContent>{minute.content || '작성된 내용이 없어요.'}</S.MinuteContent></HomeDialog>}
  </MainLayout>
}
