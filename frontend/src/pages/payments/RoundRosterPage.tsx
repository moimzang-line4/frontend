import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import SwipeStatusCard from '../../components/SwipeStatusCard'
import SegmentTabs from '../../components/SegmentTabs'
import MemberSearchBar from '../../components/members/MemberSearchBar'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useReceipts from '../../hooks/payments/useReceipts'
import useSettlement from '../../hooks/payments/useSettlement'
import { paymentsPath } from '../../constants/payments/receipt'
import { PAYMENT_FILTERS, SETTLEMENT_TEXT } from '../../constants/payments/settlement'
import { getPersonTotal, getRoundSummaries, personIdentity, won } from '../../utils/payments'
import type { PaymentFilter, SettlementPerson } from '../../types/payments/settlement'
import { EmptyText, MemberCount, TopRow } from '../../styles/members/MemberDetailPage.styles'
import * as S from '../../styles/payments/RoundRosterPage.styles'

// 피그마: 정산 명단 · 미입금 / 입금 완료 / 전체 (학과 및 식별정보 표시)
export default function RoundRosterPage() {
  const navigate = useNavigate()
  const { scheduleId = '', round: roundParam = '' } = useParams<{ scheduleId: string; round: string }>()
  const round = roundParam
  const basePath = paymentsPath(scheduleId)

  const { receipts } = useReceipts(scheduleId)
  const { settlement, getPerson, removeFromRound, setPaid } = useSettlement(scheduleId)

  const [filter, setFilter] = useState<PaymentFilter>('unpaid')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<SettlementPerson | null>(null)

  const summaries = getRoundSummaries(receipts, settlement)
  const people = (settlement.rounds[round] ?? [])
    .map(getPerson)
    .filter((person): person is SettlementPerson => Boolean(person))

  const keyword = search.trim().toLowerCase()
  const isPaid = (id: string) => settlement.paid.includes(id)
  const visible = people.filter(person => {
    if (filter === 'unpaid' && isPaid(person.id)) return false
    if (filter === 'paid' && !isPaid(person.id)) return false
    return !keyword || person.name.toLowerCase().includes(keyword)
  })

  return (
    <MainLayout
      title={`${round} 명단`}
      showFooter={false}
      headerRightAction={(
        <S.EditButton type="button" onClick={() => navigate(`${basePath}/rounds/edit?round=${encodeURIComponent(round)}`)}>
          편집
        </S.EditButton>
      )}
    >
      <S.Container>
        <TopRow>
          <MemberCount>총 {people.length}명</MemberCount>
        </TopRow>

        <MemberSearchBar value={search} onChange={setSearch} placeholder="이름 검색" />

        <SegmentTabs
          label="입금 상태"
          tabs={PAYMENT_FILTERS}
          value={filter}
          onChange={next => { setFilter(next); setOpenId(null) }}
        />

        {visible.length > 0 ? (
          <S.List>
            {visible.map(person => {
              const identity = personIdentity(person)
              return (
                <SwipeStatusCard
                  key={person.id}
                  name={person.name}
                  subtitle={(
                    <>
                      {identity && <S.Identity>{identity}</S.Identity>}
                      <S.Amount>총 {won(getPersonTotal(person.id, summaries, settlement))}</S.Amount>
                    </>
                  )}
                  done={isPaid(person.id)}
                  actionLabel="입금 확인"
                  doneLabel="입금 완료"
                  open={openId === person.id}
                  onOpenChange={open => setOpenId(open ? person.id : null)}
                  onAction={() => { setPaid(person.id, true); setOpenId(null) }}
                  onSwipeAction={() => {
                    setOpenId(null)
                    if (isPaid(person.id)) setPaid(person.id, false)
                    else setRemoveTarget(person)
                  }}
                />
              )
            })}
          </S.List>
        ) : (
          <EmptyText>
            {keyword ? '검색 결과가 없어요.' : filter === 'unpaid' && people.length > 0 ? '모두 입금했어요.' : '해당하는 인원이 없어요.'}
          </EmptyText>
        )}
      </S.Container>

      <ConfirmDialog
        open={Boolean(removeTarget)}
        title={SETTLEMENT_TEXT.removeTitle}
        description={removeTarget ? `${removeTarget.name} 님이 ${round} 정산 명단에서 빠지고, 1인 금액이 다시 계산돼요.` : ''}
        confirmText="삭제하기"
        titleSize={18}
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) removeFromRound(round, removeTarget.id)
          setRemoveTarget(null)
        }}
      />
    </MainLayout>
  )
}
