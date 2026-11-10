import { Link, useNavigate } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ProgressHeroCard from '../../components/ProgressHeroCard'
import RouteTabs from '../../components/RouteTabs'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import usePaymentSummary from '../../hooks/payments/usePaymentSummary'
import useReceipts from '../../hooks/payments/useReceipts'
import { PAYMENTS_TABS, RECEIPT_TEXT, paymentsPath } from '../../constants/payments/receipt'
import type { PaymentsTab } from '../../types/payments/receipt'
import type { Schedule } from '../../types/schedules/schedule'
import { OutlineButton } from '../../styles/OutlineButton.styles'
import * as S from '../../styles/payments/PaymentsPage.styles'

type Props = { tab: PaymentsTab }

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
  const { paid, total } = usePaymentSummary(schedule.id)
  const { receipts } = useReceipts(schedule.id)
  const basePath = paymentsPath(schedule.id)

  const tabs = PAYMENTS_TABS.map(item => ({ label: item.label, to: `${basePath}${item.path}` }))

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

      <S.Body>
        <S.TabSection>
          <RouteTabs label="정산 메뉴" tabs={tabs} />

          {tab === 'receipts' ? (
            receipts.length === 0 ? (
              <EmptyState title={RECEIPT_TEXT.emptyTitle} description={RECEIPT_TEXT.emptyDescription} />
            ) : (
              // TODO: 영수증 목록 화면(피그마: 정산 · 영수증 목록) 구현 예정
              <EmptyState title={`영수증 ${receipts.length}건이 등록됐어요`} description="영수증 목록 화면은 준비 중이에요" />
            )
          ) : (
            <EmptyState title="준비 중인 화면이에요" />
          )}
        </S.TabSection>

        {tab === 'receipts' && (
          <S.Actions>
            <Button onClick={() => navigate(`${basePath}/receipts/camera`)}>＋ 영수증 추가</Button>
            <OutlineButton type="button" $size="large" onClick={() => navigate(`${basePath}/receipts/manual`)}>
              직접 등록하기
            </OutlineButton>
          </S.Actions>
        )}
      </S.Body>
    </S.Container>
  )
}
