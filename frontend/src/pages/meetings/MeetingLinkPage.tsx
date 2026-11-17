import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import Header from '../../layouts/Header'
import AgendaAccordion from '../../components/meetings/AgendaAccordion'

import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useAgendaLinkCandidates from '../../hooks/meetings/useAgendaLinkCandidates'

import searchIcon from '../../assets/operations/search.svg'

import * as P from '../../styles/meetings/MeetingPage.styles'

import * as S from '../../styles/meetings/MeetingLinkPage.styles'

export default function MeetingLinkPage() {
  const navigate = useNavigate()

  const detail = useScheduleDetail()
  const { schedule } = detail

  const data = useAgendaLinkCandidates(
    schedule?.operationMenuCount !== undefined ? schedule.id : '',
  )

  const [query, setQuery] = useState('')

  const [selected, setSelected] = useState<Set<number>>(() => new Set())

  const [error, setError] = useState('')

  const returnPath = schedule
    ? `/schedules/${encodeURIComponent(schedule.id)}`
    : '/operations'

  if (!schedule || schedule.operationMenuCount === undefined) {
    return (
      <P.Page>
        <Header title="안건 연결하기" onBack={() => navigate(returnPath)} />

        <P.Notice>
          {detail.loading ? (
            <p role="status">일정을 불러오는 중이에요.</p>
          ) : (
            <>
              <P.Error role="alert">
                {detail.errorMessage || '연결할 운영 공간을 찾을 수 없어요.'}
              </P.Error>

              {detail.errorMessage && (
                <P.OutlineButton
                  type="button"
                  disabled={detail.refreshing}
                  onClick={() => void detail.reload()}
                >
                  다시 불러오기
                </P.OutlineButton>
              )}

              <Link to="/operations">운영 공간으로 이동</Link>
            </>
          )}
        </P.Notice>
      </P.Page>
    )
  }

  const keyword = query.trim().toLocaleLowerCase()

  const matches = (item: (typeof data.agendas)[number]) =>
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

  const selectedIds = data.agendas
    .filter(item => selected.has(item.agendaId))
    .map(item => item.agendaId)

  function toggle(ids: number[]) {
    if (data.pending) return

    setSelected(current => {
      const next = new Set(current)

      const remove = ids.every(id => next.has(id))

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
    if (!selectedIds.length || data.pending) {
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
        caught instanceof Error ? caught.message : '안건을 연결하지 못했어요.',
      )
    }
  }

  return (
    <S.Page>
      <Header
        title="안건 연결하기"
        onBack={() => {
          if (!data.pending) {
            navigate(returnPath)
          }
        }}
      />

      <S.Content>
        <fieldset disabled={data.pending} style={{ display: 'contents' }}>
          <S.Count>
            <h2>안건 {agendas.length}개</h2>

            <span role="status">안건 {selectedIds.length}개 선택</span>
          </S.Count>

          <S.Toolbar>
            <S.Search>
              <img src={searchIcon} alt="" width={20} height={20} />

              <input
                type="search"
                aria-label="안건 검색"
                placeholder="안건 검색"
                value={query}
                onChange={event => setQuery(event.target.value)}
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
                    selectedIds.length ? ` (${selectedIds.length})` : ''
                  }`}
            </S.Add>
          </S.Toolbar>

          {(error || data.errorMessage) && (
            <P.Error role="alert">{error || data.errorMessage}</P.Error>
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
            <S.Empty role="status">연결할 안건을 불러오는 중이에요.</S.Empty>
          ) : agendas.length ? (
            <S.List aria-label="연결할 안건 목록">
              {agendas.map(item => (
                <li key={item.agendaId}>
                  <AgendaAccordion
                    meeting={item.meeting}
                    agenda={item.agenda}
                    index={item.index}
                    selected={selected.has(item.agendaId)}
                    onSelect={() => toggle([item.agendaId])}
                  />
                </li>
              ))}
            </S.List>
          ) : !data.errorMessage ? (
            <S.Empty>
              {keyword ? '검색 결과가 없어요.' : '추가로 연결할 안건이 없어요.'}
            </S.Empty>
          ) : null}
        </fieldset>
      </S.Content>
    </S.Page>
  )
}
