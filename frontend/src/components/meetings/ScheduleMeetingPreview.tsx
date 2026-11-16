import styled from 'styled-components'

import type { AttachmentMeeting } from '../../hooks/meetings/useScheduleMeetingAttachments'

import calendarIcon from '../../assets/meetings/calendar.svg'

import * as Base from '../../styles/meetings/MeetingCard.styles'

type Props = {
  meeting: AttachmentMeeting
}

const Card = styled(Base.Card)`
  border: 1px solid #ddece7;
  padding: 14px;
  overflow: hidden;

  box-shadow:
    0 6px 18px rgb(63 141 124 / 9%),
    inset 0 1px 2px rgb(255 255 255 / 80%);
`

const Badge = styled(Base.Category)<{
  $done: boolean
}>`
  background: ${({ $done }) =>
    $done ? '#dae1ff' : '#ffebde'};

  color: ${({ $done }) =>
    $done ? '#4f75f8' : '#a15b31'};
`

const Action = styled(Base.Action)`
  flex-shrink: 0;
  min-width: 84px;
  padding: 4px 10px;
  font-weight: 500;
`

export default function ScheduleMeetingPreview({
  meeting,
}: Props) {
  const path =
    `/meetings/${encodeURIComponent(meeting.id)}`

  const done = meeting.status === 'completed'

  return (
    <Card>
      <Base.MainLink
        to={path}
        aria-label={`${meeting.title} 회의 정보 및 안건 확인`}
      >
        <Base.Top>
          <Base.Badges>
            <Badge $done={done}>
              {done ? '완료' : '진행 중'}
            </Badge>

            {meeting.categoryName && (
              <Base.Category>
                {meeting.categoryName}
              </Base.Category>
            )}
          </Base.Badges>

          <time dateTime={meeting.createdAt}>
            {meeting.createdAt
              .slice(5, 10)
              .replace('-', '.')}
          </time>
        </Base.Top>

        <Base.Title>
          <h3>{meeting.title}</h3>
          <span aria-hidden="true">›</span>
        </Base.Title>
      </Base.MainLink>

      <Base.Footer>
        <Base.Metadata>
          <span>
            안건 {meeting.agendas.length}개
          </span>

          <span>
            <img
              src={calendarIcon}
              alt="회의 날짜"
              width={14}
              height={14}
            />

            {meeting.date}
          </span>
        </Base.Metadata>

        <Action
          to={`${path}/run`}
          $filled={!done}
        >
          {done ? '회의록 보기' : '회의 이어하기'}
        </Action>
      </Base.Footer>
    </Card>
  )
}