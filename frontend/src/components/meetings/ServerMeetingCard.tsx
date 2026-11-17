import { useLocation } from 'react-router'
import useMeetingStarted from '../../hooks/meetings/useMeetingStarted'
import styled from 'styled-components'

import type { MeetingSummaryResponse } from '../../api/models'
import calendarIcon from '../../assets/meetings/calendar.svg'
import personIcon from '../../assets/meetings/person.svg'
import * as Base from '../../styles/meetings/MeetingCard.styles'

type Props = {
  id: string
  title: string
  date: string
  meeting?: MeetingSummaryResponse
  loading: boolean
  failed: boolean
  onRetry: () => void
}

const Card = styled(Base.Card)`
  padding: 14px 14px 10px;
`

const Badge = styled(Base.Category)<{ $completed: boolean }>`
  background: ${({ $completed }) => ($completed ? '#dae1ff' : '#ffebde')};
  color: ${({ $completed }) => ($completed ? '#4f75f8' : '#a15b31')};
`

const Footer = styled(Base.Footer)`
  padding-top: 8px;
`

const Retry = styled.button`
  color: #367d70;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`

export default function ServerMeetingCard({
  id,
  title,
  date,
  meeting,
  loading,
  failed,
  onRetry,
}: Props) {
  const location = useLocation()
  const origin = { returnTo: location.pathname + location.search }
  const { started, known } = useMeetingStarted(
    Number(id),
    meeting?.status === 'COMPLETED' ? true : undefined,
  )
  const path = `/meetings/${encodeURIComponent(id)}`
  const completed = meeting?.status === 'COMPLETED'
  const count = (meeting?.attendees ?? '')
    .split(/[,，\n]/)
    .filter(name => name.trim()).length
  const createdDate = meeting?.createdAt?.slice(0, 10)

  return (
    <Card>
      <Base.MainLink
        to={path}
        state={origin}
        aria-label={`${title} 회의 정보 및 안건 수정`}
      >
        <Base.Top>
          <Base.Badges>
            {meeting && (
              <Badge $completed={completed}>
                {completed ? '완료' : '진행 중'}
              </Badge>
            )}
            {meeting?.categoryName && (
              <Base.Category>{meeting.categoryName}</Base.Category>
            )}
          </Base.Badges>

          {createdDate && /^\d{4}-\d{2}-\d{2}$/.test(createdDate) && (
            <time dateTime={createdDate}>
              {createdDate.slice(5).replace('-', '.')}
            </time>
          )}
        </Base.Top>

        <Base.Title>
          <h3>{meeting?.title ?? title}</h3>
          <span aria-hidden="true">›</span>
        </Base.Title>
      </Base.MainLink>

      <Footer>
        <Base.Metadata>
          {typeof meeting?.agendaCount === 'number' && (
            <span>안건 {meeting.agendaCount}개</span>
          )}
          {count > 0 && (
            <span>
              <img src={personIcon} alt="참석자" width={14} height={14} />
              {count}명
            </span>
          )}
          <span>
            <img src={calendarIcon} alt="회의 날짜" width={14} height={14} />
            {meeting?.meetingDate ?? date}
          </span>
        </Base.Metadata>

        <Base.Action
          to={`${path}/${completed ? 'review' : 'run'}`}
          state={origin}
          $filled={!!meeting && !completed}
        >
          {completed
            ? '회의록 보기'
            : started
              ? '회의 이어하기'
              : known
                ? '회의 시작하기'
                : '회의 열기'}
        </Base.Action>
      </Footer>

      {!meeting && loading && (
        <Base.Metadata role="status">불러오는 중…</Base.Metadata>
      )}
      {!meeting && !loading && failed && (
        <Retry type="button" onClick={onRetry}>
          회의 정보 다시 불러오기
        </Retry>
      )}
    </Card>
  )
}
