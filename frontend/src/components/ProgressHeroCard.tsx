import * as S from '../styles/ProgressHeroCard.styles'

type Props = {
  title: string
  // 진행 중 / 완료 시 카드에 표시할 상태 문구
  status: string
  doneStatus?: string
  done: number
  total: number
  ariaLabel?: string
}

// 피그마 '진행 카드' 배경 (오른쪽 위가 파인 모양)
const CARD_PATH = 'M227.928 37.0594L223.514 15.9132C221.579 6.64248 213.407 0 203.936 0H20C8.95431 0 0 8.95431 0 20V119C0 130.046 8.9543 139 20 139H330C341.046 139 350 130.046 350 119V72.9726C350 61.9269 341.046 52.9726 330 52.9726H247.506C238.036 52.9726 229.863 46.3301 227.928 37.0594Z'

// 출석·정산 화면 상단의 진행 카드 (오른쪽 위가 파인 모양)
export default function ProgressHeroCard({ title, status, doneStatus, done, total, ariaLabel }: Props) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  const complete = total > 0 && done === total

  return (
    <S.Card aria-label={ariaLabel ?? `${title} 진행 현황`}>
      <S.Background viewBox="0 0 350 139" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="progress-hero-fill" x1="21" y1="23.63" x2="116.809" y2="204" gradientUnits="userSpaceOnUse">
            <stop offset="0.1071" stopColor="#438B7E" />
            <stop offset="0.8214" stopColor="#96CEBC" />
          </linearGradient>
        </defs>
        <path d={CARD_PATH} fill="url(#progress-hero-fill)" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1" />
      </S.Background>

      <S.Heading>
        <S.Title title={title}>{title}</S.Title>
        <S.Status>{complete && doneStatus ? doneStatus : status}</S.Status>
      </S.Heading>

      <S.Stats>
        <S.Stat>
          <strong>{done}</strong>
          <span>완료</span>
        </S.Stat>
        <S.Stat>
          <strong>{total}</strong>
          <span>전체</span>
        </S.Stat>
      </S.Stats>

      <S.Progress
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="진행률"
      >
        <S.Bubble $percent={percent}>{percent}%</S.Bubble>
        <S.Track>
          <S.Fill style={{ width: `${percent}%` }} />
        </S.Track>
      </S.Progress>
    </S.Card>
  )
}
