import halo from '../../assets/onboarding/halo.svg'
import * as S from '../../styles/onboarding/OnboardingPage.styles'

export default function OnboardingIllustration({ step }: { step: number }) {
  return <S.Illustration aria-hidden="true">
    <S.Halo src={halo} alt="" width={300} height={220} />
    {step === 0 ? <><S.Calendar><S.Days>{Array.from({ length: 14 }, (_, index) => <span key={index} />)}</S.Days></S.Calendar><S.CalendarBadge>●&nbsp; 오늘 일정</S.CalendarBadge></>
      : step === 1 ? <S.Attendance>{[0, 1, 2].map(index => <S.AttendanceCard key={index}><span /><span /><strong>✓</strong></S.AttendanceCard>)}</S.Attendance>
        : <><S.Receipt>{[0, 1, 2, 3].map(index => <span key={index} />)}</S.Receipt><S.ReceiptBadge>✦&nbsp; AI 도우미</S.ReceiptBadge></>}
  </S.Illustration>
}
