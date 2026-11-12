import { Link, useNavigate } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ProgressHeroCard from '../../components/ProgressHeroCard'
import RouteTabs from '../../components/RouteTabs'
import ReceiptCard from '../../components/payments/ReceiptCard'
import NoticeComposer from '../../components/payments/NoticeComposer'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import usePaymentSummary from '../../hooks/payments/usePaymentSummary'
import useReceipts from '../../hooks/payments/useReceipts'
import useSettlement from '../../hooks/payments/useSettlement'
import { showAlert } from '../../hooks/useAlert'
import { PAYMENTS_TABS, RECEIPT_TEXT, paymentsPath } from '../../constants/payments/receipt'
import { SETTLEMENT_TEXT } from '../../constants/payments/settlement'
import { getReceiptRounds, getRoundSummaries } from '../../utils/payments'
import type { PaymentsTab, ReceiptStatus } from '../../types/payments/receipt'
import type { Schedule } from '../../types/schedules/schedule'
import { OutlineButton } from '../../styles/OutlineButton.styles'
import * as S from '../../styles/payments/PaymentsPage.styles'

type Props = { tab: PaymentsTab }

const PeopleIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.5 19c.5-3.2 2.8-5 5.5-5s5 1.8 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.3c1.7.6 2.7 2.2 3 4.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChatIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 4c4.4 0 8 2.9 8 6.6 0 3.6-3.6 6.5-8 6.5-.8 0-1.6-.1-2.3-.3L5.5 19l.9-3.4C4.9 14.4 4 12.6 4 10.6 4 6.9 7.6 4 12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

// 일정 운영 메뉴 > 정산·입금 (/schedules/:scheduleId/operations/payments)
export default function PaymentsPage({ tab }: Props) {
  const { schedule } = useScheduleDetail()

  if (!schedule || schedule.operationMenuCount === undefined) {
    return (
      <MainLayout title="정산·입금">
        <S.Notice>
          <p>연결된 일정 또는 운영 공간이 없어요.</p>
          <Link to="/">홈으로 이동</Link>
        </S.Notice>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="정산·입금" showFooter={false}>
      <PaymentsContent key={schedule.id} schedule={schedule} tab={tab} />
    </MainLayout>
  )
}

function PaymentsContent({ schedule, tab }: Props & { schedule: Schedule }) {
  const navigate = useNavigate()
  const { receipts } = useReceipts(schedule.id)
  const { settlement, loadRoster } = useSettlement(schedule.id)
  const { paid, total } = usePaymentSummary(schedule.id, settlement)
  const basePath = paymentsPath(schedule.id)

  const tabs = <RouteTabs label="정산 메뉴" tabs={PAYMENTS_TABS.map(item => ({ label: item.label, to: `${basePath}${item.path}` }))} />
  const summaries = getRoundSummaries(receipts, settlement)
  const addReceipt = () => navigate(`${basePath}/receipts/camera`)

  // 차수 참여자가 모두 입금했으면 '정산 완료'
  const roundStatus = (round: string): ReceiptStatus => {
    const ids = settlement.rounds[round] ?? []
    return ids.length > 0 && ids.every(id => settlement.paid.includes(id)) ? 'done' : 'ongoing'
  }

  const handleLoadRoster = () => {
    if (receipts.length === 0) {
      showAlert(SETTLEMENT_TEXT.rosterNeedsReceipt, { description: SETTLEMENT_TEXT.rosterNeedsReceiptDescription })
      return
    }
    loadRoster(getReceiptRounds(receipts))
    navigate(`${basePath}/rounds/edit`)
  }

  const renderBody = () => {
    // 영수증 탭: 목록 (피그마: 정산 · 영수증 목록)
    if (tab === 'receipts' && receipts.length > 0) {
      return (
        <S.ListBody>
          <S.List>
            {tabs}
            {receipts.map(receipt => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                status={settlement.loaded ? roundStatus(receipt.round) : undefined}
                onClick={() => navigate(`${basePath}/receipts/${receipt.id}`)}
              />
            ))}
          </S.List>
          <Button onClick={addReceipt}>＋ 영수증 추가</Button>
        </S.ListBody>
      )
    }

    // 명단·금액 탭: 차수별 명단 및 금액
    if (tab === 'members' && settlement.loaded && receipts.length > 0) {
      return (
        <S.ListBody>
          <S.List>
            {tabs}
            {receipts.map(receipt => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                status={roundStatus(receipt.round)}
                detail={`${settlement.rounds[receipt.round]?.length ?? 0}명`}
                showDate={false}
                onClick={() => navigate(`${basePath}/rounds/${encodeURIComponent(receipt.round)}`)}
              />
            ))}
          </S.List>
          <Button onClick={addReceipt}>＋ 영수증 추가</Button>
        </S.ListBody>
      )
    }

    // 공지 복사 탭: 포함할 차수 선택 → 공지 생성
    if (tab === 'notice' && summaries.length > 0) {
      return (
        <S.List>
          {tabs}
          <NoticeComposer title={schedule.title} summaries={summaries} />
        </S.List>
      )
    }

    // 빈 화면 (영수증 없음 / 명단 불러오기 전 / 정산 내역 없음)
    const empty = {
      receipts: { icon: undefined, title: RECEIPT_TEXT.emptyTitle, description: RECEIPT_TEXT.emptyDescription },
      members: { icon: PeopleIcon, title: SETTLEMENT_TEXT.rosterEmptyTitle, description: SETTLEMENT_TEXT.rosterEmptyDescription },
      notice: { icon: ChatIcon, title: SETTLEMENT_TEXT.noticeEmptyTitle, description: SETTLEMENT_TEXT.noticeEmptyDescription },
    }[tab]

    return (
      <S.Body>
        <S.TabSection>
          {tabs}
          <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
        </S.TabSection>

        <S.Actions>
          {tab === 'receipts' && (
            <>
              <Button onClick={addReceipt}>＋ 영수증 추가</Button>
              <OutlineButton type="button" $size="large" onClick={() => navigate(`${basePath}/receipts/manual`)}>
                직접 등록하기
              </OutlineButton>
            </>
          )}
          {tab === 'members' && <Button onClick={handleLoadRoster}>행사 명단 불러오기</Button>}
          {tab === 'notice' && <Button onClick={addReceipt}>＋ 정산 내역 등록</Button>}
        </S.Actions>
      </S.Body>
    )
  }

  return (
    <S.Container>
      <ProgressHeroCard
        title={schedule.title}
        status="정산 준비중"
        doneStatus="정산 완료"
        done={paid}
        total={total}
        ariaLabel={`${schedule.title} 정산 현황`}
      />
      {renderBody()}
    </S.Container>
  )
}
