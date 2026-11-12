import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import SegmentTabs from '../../components/SegmentTabs'
import MemberSearchBar from '../../components/members/MemberSearchBar'
import useReceipts from '../../hooks/payments/useReceipts'
import useSettlement from '../../hooks/payments/useSettlement'
import { paymentsPath } from '../../constants/payments/receipt'
import { getReceiptRounds, personIdentity } from '../../utils/payments'
import { EmptyText } from '../../styles/members/MemberDetailPage.styles'
import * as S from '../../styles/payments/RoundEditPage.styles'

const PersonIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 19.5c.7-3.6 3.5-5.5 7-5.5s6.3 1.9 7 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// 피그마: 정산 명단 · 참여자 편집 및 저장 / 참여자 검색 결과
export default function RoundEditPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { scheduleId = '' } = useParams<{ scheduleId: string }>()
  const basePath = paymentsPath(scheduleId)

  const { receipts } = useReceipts(scheduleId)
  const { settlement, saveRounds } = useSettlement(scheduleId)

  // 영수증에 있는 차수 + 이미 저장된 차수
  const [draft, setDraft] = useState<Record<string, string[]>>(() => {
    const rounds = getReceiptRounds(receipts)
    return { ...Object.fromEntries(rounds.map(round => [round, [] as string[]])), ...settlement.rounds }
  })
  const roundNames = getReceiptRounds(receipts).filter(round => draft[round])
  const [active, setActive] = useState(() => {
    const requested = searchParams.get('round')
    return requested && draft[requested] ? requested : roundNames[0] ?? ''
  })
  const [search, setSearch] = useState('')
  // '+추가': 전체 명단에서 골라 넣기
  const [adding, setAdding] = useState(false)

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
    ? settlement.people.filter(person => matches(person.name))
    : settlement.people.filter(person => members.includes(person.id) && matches(person.name))

  const handleSave = () => {
    saveRounds(draft)
    navigate(`${basePath}/members`, { replace: true })
  }

  return (
    <MainLayout title={active ? `${active} 명단` : '정산 명단'} showFooter={false}>
      <S.Container>
        <S.Section>
          <S.Title>정산 차수</S.Title>
          <SegmentTabs
            label="정산 차수"
            tabs={roundNames.map(round => ({ id: round, label: round }))}
            value={active}
            onChange={next => { setActive(next); setAdding(false); setSearch('') }}
            extra={{ label: '+ 차수 추가', onClick: () => navigate(`${basePath}/receipts/manual`) }}
          />
        </S.Section>

        <S.SearchRow>
          <MemberSearchBar value={search} onChange={setSearch} placeholder="이름 검색" />
          <S.AddButton type="button" $active={adding} onClick={() => setAdding(prev => !prev)}>
            {adding ? '완료' : '+추가'}
          </S.AddButton>
        </S.SearchRow>

        {list.length > 0 ? (
          <S.List>
            {list.map(person => {
              const included = members.includes(person.id)
              return (
                <S.PersonCard key={person.id}>
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
                      aria-label={`${person.name} ${active} 포함`}
                      $checked={included}
                      onClick={() => toggle(person.id)}
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
          <EmptyText>{keyword ? '검색 결과가 없어요.' : adding ? '불러온 명단이 없어요.' : '아직 정산 인원이 없어요. +추가로 넣어주세요.'}</EmptyText>
        )}

        <Button onClick={handleSave}>정산 명단 저장하기</Button>
      </S.Container>
    </MainLayout>
  )
}
