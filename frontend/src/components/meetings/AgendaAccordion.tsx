import { useId, useState } from 'react'
import styled from 'styled-components'

import type { MeetingAgenda } from '../../types/meetings/meeting'
import type { AgendaMeeting } from '../../hooks/meetings/useScheduleMeetingAttachments'

import { agendaTitle } from '../../utils/meetings/agendaLinks'

import chevronIcon from '../../assets/meetings/agenda-chevron.svg'

import * as S from '../../styles/meetings/MeetingAttachments.styles'

type Props = {
  meeting: AgendaMeeting
  agenda: MeetingAgenda
  index: number
  today?: string
  selected?: boolean
  onSelect?: () => void
  onUnlink?: () => void
  expanded?: boolean
  onToggle?: () => void
}

const Card = styled(S.Card)`
  overflow: hidden;

  box-shadow:
    0 6px 18px rgb(63 141 124 / 9%),
    inset 0 1px 2px rgb(255 255 255 / 80%);
`

const Detail = styled(S.Detail)`
  gap: 0;
  padding: 4px 0 14px;
  overflow: hidden;
`

const Heading = styled(S.DetailHeading)`
  align-items: center;
  padding: 12px 16px;
  min-height: 42px;

  h4 {
    min-width: 49px;
    line-height: 18px;
  }

  > p {
    line-height: 18px;
  }
`

const Required = styled.span`
  color: #e45c55;
  font-weight: 400;
`

const Preparation = styled(S.Preparation)`
  min-height: 44px;
  margin: 0 16px 12px;
`

const Field = styled(S.Field)`
  padding: 12px 16px;
  gap: 12px;
`

export default function AgendaAccordion({
  meeting,
  agenda,
  index,
  selected,
  onSelect,
  onUnlink,
  expanded: controlledExpanded,
  onToggle,
}: Props) {
  const [localExpanded, setExpanded] = useState(false)
  const expanded = controlledExpanded ?? localExpanded
  const id = useId()

  const title = agendaTitle(agenda)

  const done = agenda.completed

  const label = `${meeting.title} 안건 ${index + 1}: ${title}`

  return (
    <Card aria-label={label}>
      <S.Header>
        {onSelect && (
          <S.Checkbox
            aria-label={`${label} 선택`}
            checked={!!selected}
            onChange={onSelect}
          />
        )}

        <S.Toggle
          id={`${id}-toggle`}
          type="button"
          aria-label={`${label} ${expanded ? '접기' : '펼치기'}`}
          aria-expanded={expanded}
          aria-controls={`${id}-panel`}
          onClick={() => (onToggle ? onToggle() : setExpanded(value => !value))}
        >
          <S.Status $done={done}>{done ? '완료' : '진행 중'}</S.Status>

          <S.HeaderText>
            <strong>
              안건{index + 1}. {title}
            </strong>

            <small>
              {agenda.decision.trim() ? '결정 사항 입력됨' : '결정 사항 미입력'}
            </small>
          </S.HeaderText>

          <S.Chevron
            src={chevronIcon}
            alt=""
            width={18}
            height={18}
            $expanded={expanded}
          />
        </S.Toggle>
      </S.Header>

      {expanded && (
        <S.Panel
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-toggle`}
        >
          {onUnlink && (
            <S.Disconnect
              type="button"
              aria-label={`${label} 연결 끊기`}
              onClick={onUnlink}
            >
              연결 끊기
            </S.Disconnect>
          )}

          <Detail>
            <Heading>
              <h4>
                안건 {index + 1}
                {index === 0 && (
                  <>
                    {' '}
                    <Required>*</Required>
                  </>
                )}
              </h4>

              <p>{title}</p>

              <S.Status $done={done}>{done ? '완료' : '진행 중'}</S.Status>
            </Heading>

            <Preparation>{agenda.preparation}</Preparation>

            <Field>
              논의 내용
              <textarea
                aria-label={`${label} 논의 내용`}
                readOnly
                value={agenda.discussion}
              />
            </Field>

            <Field>
              결정 사항
              <textarea
                aria-label={`${label} 결정 사항`}
                readOnly
                value={agenda.decision}
              />
            </Field>
          </Detail>
        </S.Panel>
      )}
    </Card>
  )
}
