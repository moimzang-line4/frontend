import { useState } from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

import useScheduleMeetingAttachments from '../../hooks/meetings/useScheduleMeetingAttachments'

import ConfirmDialog from '../common/ConfirmDialog'
import AgendaAccordion from '../meetings/AgendaAccordion'

import ScheduleMeetingPreview from '../meetings/ScheduleMeetingPreview'
import emptyIcon from '../../assets/meetings/empty-paper.svg'

import * as S from '../../styles/meetings/MeetingAttachments.styles'

type Props = {
  scheduleId: string
}

const Section = styled(S.Section)`
  gap: 16px;
  overflow: hidden;
`

const Tabs = styled(S.Tabs)`
  gap: 10px;
`

const List = styled(S.List)`
  gap: 16px;
`

export default function ScheduleMeetings({
  scheduleId,
}: Props) {
  const data = useScheduleMeetingAttachments(scheduleId)

  const [filter, setFilter] = useState<
    'all' | 'meeting' | 'agenda'
  >('all')

  const [disconnectId, setDisconnectId] =
    useState<number | null>(null)

  const hasContent =
    data.meetings.length > 0 ||
    data.agendas.length > 0

  const hasVisibleContent =
    filter === 'meeting'
      ? data.meetings.length > 0
      : filter === 'agenda'
        ? data.agendas.length > 0
        : hasContent

  const createPath =
    `/meetings/new?scheduleId=${encodeURIComponent(scheduleId)}`

  return (
    <Section aria-label="회의록 & 안건">
      <S.Top>
        <S.Heading>
          <h2>회의록 &amp; 안건</h2>

          {hasContent && (
            <Link to={createPath}>
              + 만들기
            </Link>
          )}
        </S.Heading>

        <Tabs aria-label="연결 항목 유형">
          {(
            [
              { value: 'all', label: '전체' },
              { value: 'meeting', label: '회의록' },
              { value: 'agenda', label: '안건' },
            ] as const
          ).map(tab => (
            <S.Tab
              key={tab.value}
              type="button"
              $active={filter === tab.value}
              aria-pressed={filter === tab.value}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
            </S.Tab>
          ))}
        </Tabs>
      </S.Top>

      {data.errorMessage && (
        <S.Empty>
          <strong role="alert">
            {data.errorMessage}
          </strong>

          <S.Disconnect
            type="button"
            disabled={data.refreshing}
            onClick={() => void data.reload()}
          >
            {data.refreshing
              ? '불러오는 중…'
              : '다시 불러오기'}
          </S.Disconnect>
        </S.Empty>
      )}

      {data.loading ? (
        <S.Empty role="status">
          회의록과 안건을 불러오는 중이에요.
        </S.Empty>
      ) : hasVisibleContent ? (
        <List>
          {filter !== 'agenda' &&
            data.meetings.map(meeting => (
              <li key={`meeting-${meeting.id}`}>
                <ScheduleMeetingPreview
                  meeting={meeting}
                />
              </li>
            ))}

          {filter !== 'meeting' &&
            data.agendas.map(item => (
              <li key={`agenda-${item.linkId}`}>
                <AgendaAccordion
                  meeting={item.meeting}
                  agenda={item.agenda}
                  index={item.index}
                  onUnlink={() =>
                    setDisconnectId(item.linkId)
                  }
                />
              </li>
            ))}
        </List>
      ) : !data.errorMessage ? (
        <S.Empty>
          <img
            src={emptyIcon}
            alt=""
            width={24}
            height={24}
          />

          <strong>
            {hasContent
              ? `연결된 ${
                  filter === 'meeting'
                    ? '회의록이'
                    : '안건이'
                } 없어요`
              : '아직 등록된 내용이 없어요'}
          </strong>
        </S.Empty>
      ) : null}

      <S.Actions>
        <S.Action
          to={
            `/schedules/${encodeURIComponent(scheduleId)}` +
            '/meetings/link'
          }
        >
          안건 연결하기
        </S.Action>

        <S.Action
          $primary
          to={createPath}
        >
          회의록 작성하기
        </S.Action>
      </S.Actions>

      <ConfirmDialog
        open={disconnectId !== null}
        title="연결을 끊을까요?"
        description="이 일정과의 연결만 해제되며, 회의록과 안건 내용은 유지돼요."
        confirmText="연결 끊기"
        onCancel={() => {
          if (!data.pending) {
            setDisconnectId(null)
          }
        }}
        onConfirm={async () => {
          if (disconnectId === null) return

          await data.disconnect(disconnectId)

          setDisconnectId(null)
        }}
      />
    </Section>
  )
}