import chevron from '../../assets/home/card-chevron.svg'
import type { HomeSchedule } from '../../types/home/schedule'
import * as S from '../../styles/home/UpcomingEventCard.styles'

const categoryLabels = { meeting: '회의', session: '세션', performance: '공연', newcomer: '공연' }
type Props = { event: HomeSchedule; featured?: boolean }

export default function UpcomingEventCard({ event, featured = false }: Props) {
  return (
    <S.Card to={`/operations?event=${encodeURIComponent(event.id)}`} $featured={featured} aria-label={`${event.title} 운영 공간으로 이동`}>
      <S.Details>
        <div>
          <S.Category $featured={featured}>{categoryLabels[event.category]} | {event.date.replaceAll('-', '.')}</S.Category>
          <S.Title>{event.title}</S.Title>
        </div>
        <S.Summary $featured={featured}>{event.operationMenuCount ?? 0}개 운영 메뉴{event.venue ? ` · ${event.venue}` : ''}</S.Summary>
      </S.Details>
      <img src={chevron} alt="" width={24} height={24} />
    </S.Card>
  )
}
