import { isAxiosError } from 'axios'
import { useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import AgendaAccordion from '../../components/meetings/AgendaAccordion'
import {
  deleteAgenda,
  generateSummary,
  updateSummary,
  useGetMeetingDetail,
  getGetMeetingDetailQueryKey,
} from '../../api/generated'
import type { getMeetingDetail } from '../../api/generated'
import {
  meetingError,
  readServerMeeting,
} from '../../utils/meetings/serverMeeting'
import type { ServerMeeting } from '../../utils/meetings/serverMeeting'
import { meetingReturnTo } from '../../utils/meetings/returnTo'
import * as S from '../../styles/meetings/MeetingReviewPage.styles'
import * as A from '../../styles/meetings/MeetingAttachments.styles'
import sparkle from '../../assets/navigation/ai.svg'

type Props = { editing?: boolean }

function Review({
  meeting,
  editing,
  loadError,
}: {
  meeting: ServerMeeting
  editing: boolean
  loadError: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const client = useQueryClient()
  const returnTo = meetingReturnTo(location.state, true)
  const origin = { returnTo }
  const base = `/meetings/${meeting.meetingId}`
  const [tab, setTab] = useState<'original' | 'summary'>('original')
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())
  const [draft, setDraft] = useState(meeting.summaryContent ?? '')
  const [saved, setSaved] = useState(meeting.summaryContent ?? '')
  const [originalOpen, setOriginalOpen] = useState(false)
  const [pending, setPending] = useState<'generate' | 'save' | 'delete' | null>(
    null,
  )
  const [error, setError] = useState('')
  const [regenerateOpen, setRegenerateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const busy = useRef(false)
  const summaryRef = useRef<HTMLTextAreaElement>(null)
  const hasSummary = !!meeting.summaryContent?.trim()
  const dirty = draft !== saved
  const showSummary = editing ? !originalOpen : tab === 'summary'
  const doneCount = meeting.agendas.filter(
    item => item.status === 'COMPLETED',
  ).length
  const queryKey = getGetMeetingDetailQueryKey(meeting.meetingId)

  function cacheSummary(
    summaryContent: string,
    summaryGeneratedAt = meeting.summaryGeneratedAt,
  ) {
    client.setQueryData<Awaited<ReturnType<typeof getMeetingDetail>>>(
      queryKey,
      current =>
        current
          ? {
              ...current,
              data: {
                ...current.data,
                data: {
                  ...current.data.data,
                  summaryContent,
                  summaryGeneratedAt,
                },
              },
            }
          : current,
    )
  }

  async function execute(action: 'generate' | 'save', inDialog = false) {
    if (busy.current || (action === 'save' && !draft.trim())) return
    busy.current = true
    setPending(action)
    setError('')
    try {
      if (action === 'generate') {
        // Explicit user action only. The backend also persists the generated summary.
        const response = await generateSummary(meeting.meetingId, {
          timeout: 120000,
        })
        const body = response.data
        const summary = body.data?.summaryContent
        if (body.success !== true) {
          throw new Error(body.message || 'AI 요약을 생성하지 못했어요.')
        }
        if (typeof summary !== 'string' || !summary.trim()) {
          throw new Error('AI 요약 결과가 비어 있어요. 다시 시도해주세요.')
        }
        cacheSummary(summary, body.data?.summaryGeneratedAt)
        setDraft(summary)
        setSaved(summary)
        setRegenerateOpen(false)
        if (!editing) navigate(`${base}/summary`, { state: origin })
      } else {
        const response = await updateSummary(
          meeting.meetingId,
          { summaryContent: draft },
          { timeout: 15000 },
        )
        if (
          response.data.success !== true ||
          response.data.data?.meetingId !== meeting.meetingId
        ) {
          throw new Error(response.data.message || '요약을 저장하지 못했어요.')
        }
        cacheSummary(draft)
        setSaved(draft)
        // A failed refresh must not turn a successful save into a duplicate mutation.
        void client.invalidateQueries({ queryKey })
        navigate(`${base}/review`, { replace: true, state: origin })
      }
    } catch (caught) {
      setError(meetingError(caught))
      if (inDialog) throw new Error(meetingError(caught))
    } finally {
      busy.current = false
      setPending(null)
    }
  }

  async function removeAgenda() {
    if (busy.current || deleteId === null) return
    if (meeting.agendas.length <= 1)
      throw new Error('안건은 최소 1개 남아 있어야 해요.')
    busy.current = true
    setPending('delete')
    try {
      const response = await deleteAgenda(deleteId, { timeout: 15000 })
      if (response.data.success !== true) {
        throw new Error(response.data.message || '안건을 삭제하지 못했어요.')
      }
      // Only update the UI after server confirmation. Existing AI summary stays intact.
      client.setQueryData<Awaited<ReturnType<typeof getMeetingDetail>>>(
        queryKey,
        current => {
          if (!current?.data.data) return current
          const agendas = current.data.data.agendas?.filter(
            item => item.agendaId !== deleteId,
          )
          const doneCount =
            agendas?.filter(item => item.status === 'COMPLETED').length ?? 0
          const totalCount = agendas?.length ?? 0
          return {
            ...current,
            data: {
              ...current.data,
              data: {
                ...current.data.data,
                agendas,
                progress: {
                  doneCount,
                  totalCount,
                  percentage: totalCount
                    ? Math.round((doneCount / totalCount) * 100)
                    : 0,
                },
              },
            },
          }
        },
      )
      setExpanded(current => {
        const next = new Set(current)
        next.delete(deleteId)
        return next
      })
      setDeleteId(null)
      await client.invalidateQueries({
        predicate: query => {
          const first = query.queryKey[0]
          return (
            first === 'operation-records' ||
            (typeof first === 'string' &&
              /\/api\/(?:meetings\/|terms\/\d+\/(?:meetings|agendas\/linkable)|schedules\/\d+\/agenda-links)/.test(
                first,
              ))
          )
        },
      })
    } catch (caught) {
      if (isAxiosError<{ code?: string }>(caught)) {
        if (caught.response?.data.code === 'MEETING_409_ALREADY_ENDED') {
          throw new Error('종료된 회의의 안건 삭제는 서버에서 제한하고 있어요.')
        }
        if (caught.response?.data.code === 'AGENDA_409_AT_LEAST_ONE_REQUIRED') {
          throw new Error('안건은 최소 1개 남아 있어야 해요.')
        }
      }
      throw new Error(meetingError(caught))
    } finally {
      busy.current = false
      setPending(null)
    }
  }

  function back() {
    if (busy.current) return
    if (editing && originalOpen) {
      setOriginalOpen(false)
      return
    }
    if (editing && dirty) {
      setLeaveOpen(true)
      return
    }
    navigate(editing ? `${base}/review` : returnTo, { state: origin })
  }

  return (
    <S.Page>
      <Header
        title={editing && !originalOpen ? 'AI 회의 요약' : '회의 정리'}
        onBack={back}
      />
      <S.Content aria-busy={!!pending}>
        {!editing && (
          <S.Ended>
            <h2>회의가 종료되었어요</h2>
            <p>
              {meeting.agendas.length}개 안건 중 {doneCount}개 논의 완료
            </p>
          </S.Ended>
        )}
        {!editing && hasSummary && (
          <A.Tabs aria-label="회의 기록 보기">
            <A.Tab
              type="button"
              $active={tab === 'original'}
              aria-pressed={tab === 'original'}
              onClick={() => setTab('original')}
            >
              회의 원본
            </A.Tab>
            <A.Tab
              type="button"
              $active={tab === 'summary'}
              aria-pressed={tab === 'summary'}
              onClick={() => setTab('summary')}
            >
              AI 요약
            </A.Tab>
          </A.Tabs>
        )}
        {(!showSummary || editing) && (
          <S.Heading>
            <h2>{meeting.title}</h2>
            <p>{meeting.meetingDate}</p>
          </S.Heading>
        )}
        {showSummary ? (
          <>
            <S.SummaryStatus>
              <strong>✓ 요약 완료</strong>
              <span>{meeting.agendas.length}개 안건을 하나로 정리했어요</span>
            </S.SummaryStatus>
            <S.SummaryCard>
              <S.SummaryHeading>
                <img src={sparkle} alt="" />
                <h3>회의 전체 요약</h3>
                <button
                  type="button"
                  disabled={!!pending}
                  onClick={() => {
                    if (!editing) navigate(`${base}/summary`, { state: origin })
                    else summaryRef.current?.focus()
                  }}
                >
                  수정
                </button>
              </S.SummaryHeading>
              <S.SummaryText
                ref={summaryRef}
                aria-label="회의 전체 요약"
                value={editing ? draft : (meeting.summaryContent ?? '')}
                readOnly={!editing}
                disabled={!!pending}
                onChange={event => setDraft(event.target.value)}
              />
              <S.Note>요약 내용은 직접 수정할 수 있어요.</S.Note>
            </S.SummaryCard>
          </>
        ) : (
          <>
            <S.RecordHeading>
              <h3>안건별 기록</h3>
              <button
                type="button"
                onClick={() =>
                  setExpanded(current =>
                    current.size === meeting.agendas.length
                      ? new Set()
                      : new Set(meeting.agendas.map(item => item.agendaId)),
                  )
                }
              >
                {expanded.size === meeting.agendas.length
                  ? '모두 접기'
                  : '모두 펼치기'}
              </button>
            </S.RecordHeading>
            <S.Records>
              {meeting.agendas.map((item, index) => (
                <AgendaAccordion
                  key={item.agendaId}
                  meeting={{
                    id: String(meeting.meetingId),
                    title: meeting.title,
                    date: meeting.meetingDate,
                    status: 'completed',
                  }}
                  agenda={{
                    id: String(item.agendaId),
                    preparation: item.content,
                    discussion: item.discussionNote ?? '',
                    decision: item.decision ?? '',
                    completed: item.status === 'COMPLETED',
                  }}
                  index={index}
                  onDelete={
                    !editing ? () => setDeleteId(item.agendaId) : undefined
                  }
                  deleteDisabled={!!pending || meeting.agendas.length <= 1}
                  expanded={expanded.has(item.agendaId)}
                  onToggle={() =>
                    setExpanded(current => {
                      const next = new Set(current)
                      if (next.has(item.agendaId)) next.delete(item.agendaId)
                      else next.add(item.agendaId)
                      return next
                    })
                  }
                />
              ))}
            </S.Records>
          </>
        )}
        {(error || loadError) && (
          <S.Error role="alert">{error || loadError}</S.Error>
        )}
        {pending === 'generate' && (
          <S.Hint role="status">
            AI가 회의를 요약하고 있어요. 잠시 기다려주세요.
          </S.Hint>
        )}
        {editing ? (
          originalOpen ? (
            <S.Primary type="button" onClick={() => setOriginalOpen(false)}>
              요약으로 돌아가기
            </S.Primary>
          ) : (
            <>
              <S.TextButton
                type="button"
                disabled={!!pending}
                onClick={() => setOriginalOpen(true)}
              >
                원본 회의록 보기 ›
              </S.TextButton>
              <S.Hint>저장 전 요약 내용을 확인해 주세요.</S.Hint>
              <S.Primary
                type="button"
                disabled={!!pending || !draft.trim()}
                onClick={() => void execute('save')}
              >
                {pending === 'save' ? '저장 중…' : '회의록 저장하기'}
              </S.Primary>
              <S.Regenerate
                type="button"
                disabled={!!pending}
                onClick={() =>
                  dirty ? setRegenerateOpen(true) : void execute('generate')
                }
              >
                다시 요약하기
              </S.Regenerate>
            </>
          )
        ) : hasSummary ? (
          <S.Primary type="button" onClick={() => navigate(returnTo)}>
            닫기
          </S.Primary>
        ) : (
          <S.Primary
            type="button"
            disabled={!!pending}
            onClick={() => void execute('generate')}
          >
            {pending === 'generate' ? 'AI 요약 중…' : 'AI로 요약하기'}
          </S.Primary>
        )}
      </S.Content>
      <ConfirmDialog
        open={deleteId !== null}
        title="안건을 삭제할까요?"
        description={
          hasSummary
            ? '삭제한 안건은 복구할 수 없어요. 기존 AI 요약은 유지되며, 다시 요약하기로 갱신할 수 있어요.'
            : '삭제한 안건은 복구할 수 없어요.'
        }
        confirmText="삭제하기"
        onCancel={() => {
          if (!pending) setDeleteId(null)
        }}
        onConfirm={removeAgenda}
      />
      <ConfirmDialog
        open={regenerateOpen}
        title="다시 요약할까요?"
        description="직접 수정한 요약은 새 AI 요약으로 바뀝니다. 원본 안건은 유지됩니다."
        confirmText="다시 요약하기"
        onCancel={() => {
          if (!pending) setRegenerateOpen(false)
        }}
        onConfirm={() => execute('generate', true)}
      />
      <ConfirmDialog
        open={leaveOpen}
        title="수정을 마칠까요?"
        description="저장하지 않은 요약 수정 내용은 사라집니다."
        confirmText="나가기"
        onCancel={() => setLeaveOpen(false)}
        onConfirm={() => navigate(`${base}/review`, { state: origin })}
      />
    </S.Page>
  )
}

export default function MeetingReviewPage({ editing = false }: Props) {
  const { meetingId = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const id = Number(meetingId)
  const valid = /^[1-9]\d*$/.test(meetingId) && Number.isSafeInteger(id)
  const query = useGetMeetingDetail(valid ? id : 0, {
    query: {
      enabled: valid,
      retry: false,
      staleTime: 30_000,
      select: readServerMeeting,
      refetchOnWindowFocus: !editing,
    },
    axios: { timeout: 15000 },
  })
  const meeting = query.data?.meetingId === id ? query.data : undefined
  if (!meeting)
    return (
      <S.Page>
        <Header
          title="회의 정리"
          onBack={() => navigate(meetingReturnTo(location.state, true))}
        />
        <S.Content>
          {query.isLoading ? (
            <p role="status">회의를 불러오는 중이에요.</p>
          ) : (
            <>
              <S.Error role="alert">
                {valid
                  ? meetingError(query.error)
                  : '올바른 회의 ID가 아니에요.'}
              </S.Error>
              {valid && (
                <S.OutlineButton
                  type="button"
                  disabled={query.isFetching}
                  onClick={() => void query.refetch()}
                >
                  다시 불러오기
                </S.OutlineButton>
              )}
            </>
          )}
        </S.Content>
      </S.Page>
    )
  if (meeting.status !== 'COMPLETED')
    return (
      <Navigate replace to={`/meetings/${id}/run`} state={location.state} />
    )
  if (editing && !meeting.summaryContent?.trim())
    return (
      <Navigate replace to={`/meetings/${id}/review`} state={location.state} />
    )
  return (
    <Review
      key={`${id}-${editing}`}
      meeting={meeting}
      editing={editing}
      loadError={query.error ? meetingError(query.error) : ''}
    />
  )
}
