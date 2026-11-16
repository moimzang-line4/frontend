import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import Header from '../../layouts/Header'
import AgendaAccordion from '../../components/meetings/AgendaAccordion'

import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useAgendaLinkCandidates from '../../hooks/meetings/useAgendaLinkCandidates'

import type { CandidateMeeting } from '../../hooks/meetings/useAgendaLinkCandidates'

import searchIcon from '../../assets/operations/search.svg'
import calendarIcon from '../../assets/meetings/calendar.svg'
import chevronIcon from '../../assets/meetings/agenda-chevron.svg'

import * as P from '../../styles/meetings/MeetingPage.styles'
import * as A from '../../styles/meetings/MeetingAttachments.styles'
import * as S from '../../styles/meetings/MeetingLinkPage.styles'

function MeetingGroup({
  group,
  selected,
  onSelect,
}: {
  group: CandidateMeeting
  selected: boolean
  onSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const id = useId()

  const done =
    group.meeting.status === 'completed'

  return (
    <A.Card>
      <A.MeetingTop>
        <span>
          <A.Status $done={done}>
            {done ? '완료' : '진행 중'}
          </A.Status>

          {group.categoryName && (
            <A.Category>
              {group.categoryName}
            </A.Category>
          )}
        </span>

        {group.createdAt && (
          <time dateTime={group.createdAt}>
            {group.createdAt
              .slice(5, 10)
              .replace('-', '.')}
          </time>
        )}
      </A.MeetingTop>

      <A.Header>
        <A.Checkbox
          aria-label={
            `${group.meeting.title} 연결 가능한 안건 전체 선택`
          }
          checked={selected}
          onChange={onSelect}
        />

        <A.Toggle
          type="button"
          id={`${id}-toggle`}
          aria-label={
            `${group.meeting.title} 회의록 ` +
            (expanded ? '접기' : '펼치기')
          }
          aria-expanded={expanded}
          aria-controls={`${id}-panel`}
          onClick={() =>
            setExpanded(value => !value)
          }
        >
          <A.MeetingHeaderText>
            <strong>
              {group.meeting.title}
            </strong>
          </A.MeetingHeaderText>

          <A.Chevron
            src={chevronIcon}
            alt=""
            width={18}
            height={18}
            $expanded={expanded}
          />
        </A.Toggle>
      </A.Header>

      <A.Footer>
        <p>
          <span>
            연결 가능 안건 {group.agendas.length}개
          </span>

          <img
            src={calendarIcon}
            alt="회의 날짜"
            width={14}
            height={14}
          />

          {group.meeting.date}
        </p>
      </A.Footer>

      {expanded && (
        <A.Panel
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-toggle`}
        >
          {group.agendas.map(item => (
            <AgendaAccordion
              key={item.agendaId}
              meeting={item.meeting}
              agenda={item.agenda}
              index={item.index}
            />
          ))}
        </A.Panel>
      )}
    </A.Card>
  )
}

export default function MeetingLinkPage() {
  const navigate = useNavigate()

  const detail = useScheduleDetail()
  const { schedule } = detail

  const data = useAgendaLinkCandidates(
    schedule?.operationMenuCount !== undefined
      ? schedule.id
      : '',
  )

  const [kind, setKind] = useState<
    'agenda' | 'meeting'
  >('agenda')

  const [query, setQuery] = useState('')

  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(),
  )

  const [error, setError] = useState('')

  const returnPath = schedule
    ? `/schedules/${encodeURIComponent(schedule.id)}`
    : '/operations'

  if (
    !schedule ||
    schedule.operationMenuCount === undefined
  ) {
    return (
      <P.Page>
        <Header
          title="회의록 안건"
          onBack={() => navigate(returnPath)}
        />

        <P.Notice>
          {detail.loading ? (
            <p role="status">
              일정을 불러오는 중이에요.
            </p>
          ) : (
            <>
              <P.Error role="alert">
                {detail.errorMessage ||
                  '연결할 운영 공간을 찾을 수 없어요.'}
              </P.Error>

              {detail.errorMessage && (
                <P.OutlineButton
                  type="button"
                  disabled={detail.refreshing}
                  onClick={() =>
                    void detail.reload()
                  }
                >
                  다시 불러오기
                </P.OutlineButton>
              )}

              <Link to="/operations">
                운영 공간으로 이동
              </Link>
            </>
          )}
        </P.Notice>
      </P.Page>
    )
  }

  const keyword =
    query.trim().toLocaleLowerCase()

  const matches = (
    item: (typeof data.agendas)[number],
  ) =>
    [
      item.meeting.title,
      item.categoryName,
      item.agenda.preparation,
      item.agenda.discussion,
      item.agenda.decision,
    ]
      .join(' ')
      .toLocaleLowerCase()
      .includes(keyword)

  const agendas = data.agendas.filter(matches)

  const meetings = data.meetings
    .map(group => ({
      ...group,
      agendas: group.agendas.filter(matches),
    }))
    .filter(group => group.agendas.length > 0)

  const selectedIds = data.agendas
    .filter(item => selected.has(item.agendaId))
    .map(item => item.agendaId)

  function toggle(ids: number[]) {
    if (data.pending) return

    setSelected(current => {
      const next = new Set(current)

      const remove = ids.every(
        id => next.has(id),
      )

      for (const id of ids) {
        if (remove) {
          next.delete(id)
        } else {
          next.add(id)
        }
      }

      return next
    })

    setError('')
  }

  async function confirm() {
    if (
      !selectedIds.length ||
      data.pending
    ) {
      return
    }

    setError('')

    try {
      await data.connect(selectedIds)

      navigate(returnPath, {
        replace: true,
      })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : '안건을 연결하지 못했어요.',
      )
    }
  }

  return (
    <S.Page>
      <Header
        title="회의록 안건"
        onBack={() => {
          if (!data.pending) {
            navigate(returnPath)
          }
        }}
      />

      <S.Content>
        <fieldset
          disabled={data.pending}
          style={{ display: 'contents' }}
        >
          <A.Tabs aria-label="연결할 항목 유형">
            {(
              [
                {
                  value: 'agenda',
                  label: '안건',
                },
                {
                  value: 'meeting',
                  label: '회의록',
                },
              ] as const
            ).map(tab => (
              <A.Tab
                key={tab.value}
                type="button"
                $active={kind === tab.value}
                aria-pressed={kind === tab.value}
                onClick={() =>
                  setKind(tab.value)
                }
              >
                {tab.label}
              </A.Tab>
            ))}
          </A.Tabs>

          <S.Count>
            <h2>
              {kind === 'agenda'
                ? '안건'
                : '회의록'}{' '}

              {kind === 'agenda'
                ? agendas.length
                : meetings.length}개
            </h2>

            <span role="status">
              안건 {selectedIds.length}개 선택
            </span>
          </S.Count>

          <S.Toolbar>
            <S.Search>
              <img
                src={searchIcon}
                alt=""
                width={20}
                height={20}
              />

              <input
                type="search"
                aria-label={
                  kind === 'agenda'
                    ? '안건 검색'
                    : '회의록 검색'
                }
                placeholder={
                  kind === 'agenda'
                    ? '안건 검색'
                    : '회의록 검색'
                }
                value={query}
                onChange={event =>
                  setQuery(event.target.value)
                }
              />
            </S.Search>

            <S.Add
              type="button"
              disabled={
                !selectedIds.length ||
                data.pending ||
                data.loading ||
                !!data.errorMessage
              }
              onClick={() => void confirm()}
            >
              {data.pending
                ? '연결 중…'
                : `+추가${
                    selectedIds.length
                      ? ` (${selectedIds.length})`
                      : ''
                  }`}
            </S.Add>
          </S.Toolbar>

          {(error || data.errorMessage) && (
            <P.Error role="alert">
              {error || data.errorMessage}
            </P.Error>
          )}

          {data.errorMessage && (
            <P.OutlineButton
              type="button"
              disabled={data.refreshing}
              onClick={() => void data.reload()}
            >
              다시 불러오기
            </P.OutlineButton>
          )}

          {data.loading ? (
            <S.Empty role="status">
              연결할 안건을 불러오는 중이에요.
            </S.Empty>
          ) : kind === 'agenda' ? (
            agendas.length ? (
              <S.List aria-label="연결할 안건 목록">
                {agendas.map(item => (
                  <li key={item.agendaId}>
                    <AgendaAccordion
                      meeting={item.meeting}
                      agenda={item.agenda}
                      index={item.index}
                      selected={selected.has(
                        item.agendaId,
                      )}
                      onSelect={() =>
                        toggle([item.agendaId])
                      }
                    />
                  </li>
                ))}
              </S.List>
            ) : !data.errorMessage ? (
              <S.Empty>
                {keyword
                  ? '검색 결과가 없어요.'
                  : '추가로 연결할 안건이 없어요.'}
              </S.Empty>
            ) : null
          ) : meetings.length ? (
            <S.List aria-label="연결할 회의록 목록">
              {meetings.map(group => (
                <li key={group.meeting.id}>
                  <MeetingGroup
                    group={group}
                    selected={group.agendas.every(
                      item =>
                        selected.has(
                          item.agendaId,
                        ),
                    )}
                    onSelect={() =>
                      toggle(
                        group.agendas.map(
                          item => item.agendaId,
                        ),
                      )
                    }
                  />
                </li>
              ))}
            </S.List>
          ) : !data.errorMessage ? (
            <S.Empty>
              {keyword
                ? '검색 결과가 없어요.'
                : '연결 가능한 안건이 있는 회의록이 없어요.'}
            </S.Empty>
          ) : null}
        </fieldset>
      </S.Content>
    </S.Page>
  )
}