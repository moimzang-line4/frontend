import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import SegmentTabs from '../../components/SegmentTabs'
import MemberSearchBar from '../../components/members/MemberSearchBar'
import { useRoundCandidates, useSettlementHome, useSettlementTargetActions } from '../../hooks/payments/useSettlementApi'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'
import { paymentsPath } from '../../constants/payments/receipt'
import { personIdentity } from '../../utils/payments'
import { EmptyText } from '../../styles/members/MemberDetailPage.styles'
import * as S from '../../styles/payments/RoundEditPage.styles'

const PersonIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 19.5c.7-3.6 3.5-5.5 7-5.5s6.3 1.9 7 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every(id => b.includes(id))

// 피그마: 정산 명단 · 참여자 편집 및 저장 / 참여자 검색 결과
export default function RoundEditPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { scheduleId = '' } = useParams<{ scheduleId: string }>()
  const basePath = paymentsPath(scheduleId)

  // 영수증이 등록된 차수만 정산 대상
  const { home, loading: homeLoading, error: homeError } = useSettlementHome(Number(scheduleId))
  const rounds = (home?.receipts ?? []).map(receipt => ({ id: receipt.id, label: receipt.round }))

  const [selected, setSelected] = useState(() => searchParams.get('round') ?? '')
  const active = rounds.some(round => round.id === selected) ? selected : rounds[0]?.id ?? ''
  const activeLabel = rounds.find(round => round.id === active)?.label ?? ''

  const { data, loading, error } = useRoundCandidates(Number(active))
  const { saveTargets } = useSettlementTargetActions(Number(scheduleId))

  // 차수별 편집 중인 명단 / 서버에 저장된 명단 / 이름 정보
  const [draft, setDraft] = useState<Record<string, string[]>>({})
  const [saved, setSaved] = useState<Record<string, string[]>>({})
  const [people, setPeople] = useState<Record<string, { id: string; name: string; department: string; phone: string }>>({})
  const [search, setSearch] = useState('')
  // '+추가': 차수 참가자 전체에서 골라 넣기
  const [adding, setAdding] = useState(false)
  const [pending, setPending] = useState(false)
  const pendingRef = useRef(false)

  // 차수를 처음 열면 서버 명단(없으면 출석한 사람)으로 시작
  useEffect(() => {
    if (!data || !active) return
    setDraft(prev => (prev[active] ? prev : { ...prev, [active]: data.initial }))
    setSaved(prev => (prev[active] ? prev : { ...prev, [active]: data.saved }))
    setPeople(prev => ({ ...prev, ...Object.fromEntries(data.people.map(person => [person.id, person])) }))
  }, [data, active])

  const members = draft[active] ?? []
  const keyword = search.trim().toLowerCase()
  const matches = (name: string) => !keyword || name.toLowerCase().includes(keyword)

  const toggle = (id: string) => {
    setDraft(prev => {
      const current = prev[active] ?? []
      return { ...prev, [active]: current.includes(id) ? current.filter(item => item !== id) : [...current, id] }
    })
  }

  const list = adding
    ? (data?.people ?? []).filter(person => matches(person.name))
    : members.map(id => people[id]).filter(person => person && matches(person.name))

  // 바뀐 차수만 저장 (처음 불러온 차수는 기본 명단으로 저장)
  const handleSave = async () => {
    if (pendingRef.current) return
    pendingRef.current = true
    setPending(true)
    try {
      for (const [roundId, ids] of Object.entries(draft)) {
        const before = saved[roundId] ?? []
        if (before.length > 0 ? sameIds(before, ids) : ids.length === 0) continue
        await saveTargets(Number(roundId), ids)
      }
      navigate(`${basePath}/members`, { replace: true })
    } catch (caught) {
      showAlert(getApiErrorMessage(caught, '정산 명단을 저장하지 못했어요.'))
    } finally {
      pendingRef.current = false
      setPending(false)
    }
  }

  const statusText = homeLoading || loading
    ? '명단을 불러오는 중이에요.'
    : homeError || error || (rounds.length === 0 ? '먼저 영수증을 등록해주세요.' : '')

  return (
    <MainLayout title={activeLabel ? `${activeLabel} 명단` : '정산 명단'} showFooter={false}>
      <S.Container>
        <S.Section>
          <S.Title>정산 차수</S.Title>
          <SegmentTabs
            label="정산 차수"
            tabs={rounds}
            value={active}
            onChange={next => { setSelected(next); setAdding(false); setSearch('') }}
            extra={{ label: '+ 차수 추가', onClick: () => navigate(`${basePath}/receipts/manual`) }}
          />
        </S.Section>

        <S.SearchRow>
          <MemberSearchBar value={search} onChange={setSearch} placeholder="이름 검색" />
          <S.AddButton type="button" $active={adding} onClick={() => setAdding(prev => !prev)}>
            {adding ? '완료' : '+추가'}
          </S.AddButton>
        </S.SearchRow>

        {statusText ? (
          <EmptyText>{statusText}</EmptyText>
        ) : list.length > 0 ? (
          <S.List>
            {list.map(person => {
              const included = members.includes(person.id)
              return (
                <S.PersonCard
                  key={person.id}
                  // 추가 모드에서는 카드 어디를 눌러도 체크
                  onClick={adding ? () => toggle(person.id) : undefined}
                  style={adding ? { cursor: 'pointer' } : undefined}
                >
                  <S.Avatar>{PersonIcon}</S.Avatar>
                  <S.PersonText>
                    <strong>{person.name}</strong>
                    <span>{personIdentity(person)}</span>
                  </S.PersonText>
                  {adding ? (
                    <S.CheckButton
                      type="button"
                      role="checkbox"
                      aria-checked={included}
                      aria-label={`${person.name} ${activeLabel} 포함`}
                      $checked={included}
                      // 카드 클릭과 겹쳐서 두 번 토글되지 않도록
                      onClick={event => { event.stopPropagation(); toggle(person.id) }}
                    />
                  ) : (
                    <S.RemoveButton type="button" aria-label={`${person.name} 빼기`} onClick={() => toggle(person.id)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </S.RemoveButton>
                  )}
                </S.PersonCard>
              )
            })}
          </S.List>
        ) : (
          <EmptyText>{keyword ? '검색 결과가 없어요.' : adding ? '이 차수의 참가자가 없어요.' : '아직 정산 인원이 없어요. +추가로 넣어주세요.'}</EmptyText>
        )}

        <Button onClick={() => void handleSave()} disabled={pending || Boolean(statusText)}>
          {pending ? '저장 중…' : '정산 명단 저장하기'}
        </Button>
      </S.Container>
    </MainLayout>
  )
}
