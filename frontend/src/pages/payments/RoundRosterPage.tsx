import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import SwipeStatusCard from '../../components/SwipeStatusCard'
import SegmentTabs from '../../components/SegmentTabs'
import MemberSearchBar from '../../components/members/MemberSearchBar'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useRoundTargets, useSettlementTargetActions } from '../../hooks/payments/useSettlementApi'
import type { SettlementTarget } from '../../hooks/payments/useSettlementApi'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'
import { paymentsPath } from '../../constants/payments/receipt'
import { PAYMENT_FILTERS, SETTLEMENT_TEXT } from '../../constants/payments/settlement'
import { personIdentity, won } from '../../utils/payments'
import type { PaymentFilter } from '../../types/payments/settlement'
import { EmptyText, MemberCount, TopRow } from '../../styles/members/MemberDetailPage.styles'
import * as S from '../../styles/payments/RoundRosterPage.styles'

// 피그마: 정산 명단 · 미입금 / 입금 완료 / 전체 (학과 및 식별정보 표시)
// URL의 :round는 차수 ID
export default function RoundRosterPage() {
  const navigate = useNavigate()
  const { scheduleId = '', round = '' } = useParams<{ scheduleId: string; round: string }>()
  const basePath = paymentsPath(scheduleId)

  const { label, targets, totalOf, loading, error, reload } = useRoundTargets(Number(scheduleId), Number(round))
  const { saveTargets, setPaid } = useSettlementTargetActions(Number(scheduleId))

  const [filter, setFilter] = useState<PaymentFilter>('unpaid')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<SettlementTarget | null>(null)

  const keyword = search.trim().toLowerCase()
  const visible = targets.filter(person => {
    if (filter === 'unpaid' && person.paid) return false
    if (filter === 'paid' && !person.paid) return false
    return !keyword || person.name.toLowerCase().includes(keyword)
  })

  const run = (task: Promise<void>, fallback: string) => {
    task.catch(caught => showAlert(getApiErrorMessage(caught, fallback)))
  }

  // 입금 확인은 일정 전체 기준 (서버: 사람 단위)
  const changePaid = (person: SettlementTarget, paid: boolean) => {
    setOpenId(null)
    run(setPaid(person.id, paid), '입금 상태를 바꾸지 못했어요.')
  }

  const removePerson = (person: SettlementTarget) => {
    const rest = targets.filter(item => item.id !== person.id).map(item => item.id)
    run(saveTargets(Number(round), rest), '정산 명단에서 빼지 못했어요.')
  }

  const emptyText = loading
    ? '정산 명단을 불러오는 중이에요.'
    : error || (keyword ? '검색 결과가 없어요.' : filter === 'unpaid' && targets.length > 0 ? '모두 입금했어요.' : '해당하는 인원이 없어요.')

  return (
    <MainLayout
      title={label ? `${label} 명단` : '정산 명단'}
      showFooter={false}
      headerRightAction={(
        <S.EditButton type="button" onClick={() => navigate(`${basePath}/rounds/edit?round=${encodeURIComponent(round)}`)}>
          편집
        </S.EditButton>
      )}
    >
      <S.Container>
        <TopRow>
          <MemberCount>총 {targets.length}명</MemberCount>
        </TopRow>

        <MemberSearchBar value={search} onChange={setSearch} placeholder="이름 검색" />

        <SegmentTabs
          label="입금 상태"
          tabs={PAYMENT_FILTERS}
          value={filter}
          onChange={next => { setFilter(next); setOpenId(null) }}
        />

        {!loading && !error && visible.length > 0 ? (
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
                      <S.Amount>총 {won(totalOf(person))}</S.Amount>
                    </>
                  )}
                  done={person.paid}
                  actionLabel="입금 확인"
                  doneLabel="입금 완료"
                  open={openId === person.id}
                  onOpenChange={open => setOpenId(open ? person.id : null)}
                  onAction={() => changePaid(person, true)}
                  onSwipeAction={() => {
                    setOpenId(null)
                    if (person.paid) changePaid(person, false)
                    else setRemoveTarget(person)
                  }}
                />
              )
            })}
          </S.List>
        ) : (
          <EmptyText>
            {emptyText}
            {error && <button type="button" onClick={() => void reload()}> 다시 불러오기</button>}
          </EmptyText>
        )}
      </S.Container>

      <ConfirmDialog
        open={Boolean(removeTarget)}
        title={SETTLEMENT_TEXT.removeTitle}
        description={removeTarget ? `${removeTarget.name} 님이 ${label} 정산 명단에서 빠지고, 1인 금액이 다시 계산돼요.` : ''}
        confirmText="삭제하기"
        titleSize={18}
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) removePerson(removeTarget)
          setRemoveTarget(null)
        }}
      />
    </MainLayout>
  )
}
