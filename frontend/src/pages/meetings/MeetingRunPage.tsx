import { markMeetingStarted } from '../../utils/meetings/started'
import { meetingReturnTo } from '../../utils/meetings/returnTo'
import { useRef, useState } from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'

import {
  getGetMeetingDetailQueryKey,
  getListMeetingsQueryKey,
  useEndMeeting,
  useGetMeetingDetail,
  useUpdateAgendaContent,
} from '../../api/generated'

import {
  readServerMeeting as readMeeting,
  meetingError as errorMessage,
} from '../../utils/meetings/serverMeeting'

import useOnboarding from '../../hooks/onboarding/useOnboarding'

import * as S from '../../styles/meetings/MeetingRunPage.styles'

type MeetingData = ReturnType<typeof readMeeting>
type AgendaData = MeetingData['agendas'][number]

type Draft = {
  discussionNote: string
  decision: string
}

function MeetingRun({
  meeting,
  loadError,
}: {
  meeting: MeetingData
  loadError: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = meetingReturnTo(location.state)
  const queryClient = useQueryClient()
  const { group } = useOnboarding()

  const updateMutation = useUpdateAgendaContent({
    mutation: {
      retry: false,
    },

    axios: {
      timeout: 15000,
    },
  })

  const endMutation = useEndMeeting({
    mutation: {
      retry: false,
    },

    axios: {
      timeout: 15000,
    },
  })

  const [activeId, setActiveId] = useState<number | undefined>(
    () =>
      meeting.agendas.find(item => item.status !== 'COMPLETED')?.agendaId ??
      meeting.agendas[0]?.agendaId,
  )

  const [drafts, setDrafts] = useState<Record<number, Draft>>({})
  const [pending, setPending] = useState(false)
  const [stopOpen, setStopOpen] = useState(false)
  const [error, setError] = useState('')

  const busy = useRef(false)

  const agenda =
    meeting.agendas.find(item => item.agendaId === activeId) ??
    meeting.agendas[0]

  const finished = meeting.status === 'COMPLETED'

  const index = meeting.agendas.findIndex(
    item => item.agendaId === agenda?.agendaId,
  )

  const doneCount =
    meeting.progress?.doneCount ??
    meeting.agendas.filter(item => item.status === 'COMPLETED').length

  const totalCount = meeting.progress?.totalCount ?? meeting.agendas.length

  const percentage =
    meeting.progress?.percentage ??
    Math.round((doneCount / Math.max(totalCount, 1)) * 100)

  async function refreshMeeting() {
    await queryClient.invalidateQueries(
      {
        queryKey: getGetMeetingDetailQueryKey(meeting.meetingId),
      },
      {
        throwOnError: true,
      },
    )
  }

  async function refreshLists() {
    const tasks = [
      queryClient.invalidateQueries({
        queryKey: ['operation-records'],
      }),
    ]

    const termId = group?.termId

    if (
      typeof termId === 'number' &&
      Number.isSafeInteger(termId) &&
      termId > 0
    ) {
      tasks.push(
        queryClient.invalidateQueries({
          queryKey: getListMeetingsQueryKey(termId),
        }),
      )
    }

    await Promise.all(tasks)
  }

  async function persist(item: AgendaData, complete: boolean) {
    if (finished) return

    const draft = drafts[item.agendaId]

    if (!draft && (!complete || item.status === 'COMPLETED')) {
      return
    }

    const response = await updateMutation.mutateAsync({
      agendaId: item.agendaId,

      data: {
        discussionNote: draft?.discussionNote ?? item.discussionNote ?? '',

        decision: draft?.decision ?? item.decision ?? '',

        ...(complete ? { status: 'COMPLETED' as const } : {}),
      },
    })

    const body = response.data

    if (
      body.success !== true ||
      body.data?.agendaId !== item.agendaId ||
      (complete && body.data.status !== 'COMPLETED')
    ) {
      throw new Error(body.message || '안건을 저장하지 못했어요.')
    }

    markMeetingStarted(meeting.meetingId)
    await Promise.all([refreshMeeting(), refreshLists()])

    setDrafts(current => {
      const next = { ...current }

      delete next[item.agendaId]

      return next
    })
  }

  async function execute(task: () => Promise<void>, showInDialog = false) {
    if (busy.current) return

    busy.current = true
    setPending(true)
    setError('')

    try {
      await task()
    } catch (caught) {
      const message = errorMessage(caught)

      setError(message)

      if (showInDialog) {
        throw new Error(message)
      }
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  if (!agenda) {
    return (
      <S.Page>
        <Header title="회의 진행" />

        <S.Notice>
          <p>표시할 안건이 없어요.</p>
        </S.Notice>
      </S.Page>
    )
  }

  const draft = drafts[agenda.agendaId] ?? {
    discussionNote: agenda.discussionNote ?? '',
    decision: agenda.decision ?? '',
  }

  const nextAgenda = meeting.agendas.find(
    item => item.agendaId !== agenda.agendaId && item.status !== 'COMPLETED',
  )

  function change(key: keyof Draft, value: string) {
    markMeetingStarted(meeting.meetingId)
    setDrafts(current => ({
      ...current,

      [agenda.agendaId]: {
        ...(current[agenda.agendaId] ?? {
          discussionNote: agenda.discussionNote ?? '',
          decision: agenda.decision ?? '',
        }),

        [key]: value,
      },
    }))
  }

  async function complete() {
    await persist(agenda, true)

if (nextAgenda) {
  setActiveId(nextAgenda.agendaId)
  return
}

    const response = await endMutation
      .mutateAsync({
        meetingId: meeting.meetingId,
      })
      .catch(async caught => {
        await refreshMeeting()
        throw caught
      })

    if (
      response.data.success !== true ||
      response.data.data?.meetingId !== meeting.meetingId ||
      response.data.data.status !== 'COMPLETED'
    ) {
      throw new Error(response.data.message || '회의를 종료하지 못했어요.')
    }

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetMeetingDetailQueryKey(meeting.meetingId),
      }),

      refreshLists(),
    ])

    navigate(`/meetings/${meeting.meetingId}/review`, {
      replace: true,
      state: { returnTo },
    })
  }

  return (
    <S.Page>
      <Header
        title="회의 진행"
        onBack={() => {
          if (pending) return

          if (finished) {
            navigate(`/meetings/${meeting.meetingId}`)
          } else {
            setStopOpen(true)
          }
        }}
      />

      <S.Content>
        <S.Heading>
          <h2>{meeting.title}</h2>
          <p>{meeting.meetingDate}</p>
        </S.Heading>

        <S.ProgressCard>
          <div>
            <S.ProgressHeading>
              <h3>안건 진행률</h3>

              <span>
                {doneCount}/{totalCount} 완료
              </span>
            </S.ProgressHeading>

            <S.ProgressText>
              <span>
                {finished ? '종료된 회의' : `안건 ${index + 1} 논의 중`}
              </span>

              <strong>{percentage}%</strong>
            </S.ProgressText>
          </div>

          <S.Progress aria-label="안건 진행률" value={percentage} max={100} />
        </S.ProgressCard>

        <S.Tabs aria-label="안건 선택">
          {meeting.agendas.map((item, position) => (
            <S.Tab
              key={item.agendaId}
              type="button"
              $active={item.agendaId === agenda.agendaId}
              aria-pressed={item.agendaId === agenda.agendaId}
              disabled={pending}
              onClick={() => {
                if (item.agendaId === agenda.agendaId) return

                void execute(async () => {
                  await persist(agenda, false)
                  setActiveId(item.agendaId)
                })
              }}
            >
              안건 {position + 1}
            </S.Tab>
          ))}
        </S.Tabs>

        <S.AgendaCard>
          <S.AgendaHeading>
            <h3>
              안건 {index + 1} {index === 0 && <S.Required>*</S.Required>}
            </h3>

            <S.Status $done={agenda.status === 'COMPLETED'}>
              {agenda.status === 'COMPLETED' ? '완료' : '진행 중'}
            </S.Status>
          </S.AgendaHeading>

          <S.Preparation>{agenda.content}</S.Preparation>

          <S.Field>
            논의 내용
            <S.Textarea
              aria-label={`안건 ${index + 1} 논의 내용`}
              maxLength={10000}
              value={draft.discussionNote}
              readOnly={finished}
              disabled={pending}
              onChange={event => change('discussionNote', event.target.value)}
            />
          </S.Field>

          <S.Field>
            결정 사항
            <S.Textarea
              aria-label={`안건 ${index + 1} 결정 사항`}
              maxLength={10000}
              value={draft.decision}
              readOnly={finished}
              disabled={pending}
              onChange={event => change('decision', event.target.value)}
            />
          </S.Field>
        </S.AgendaCard>

        {(error || loadError) && (
          <S.Error role="alert">{error || loadError}</S.Error>
        )}

        {finished ? (
          <S.Primary
            type="button"
            onClick={() => navigate(`/meetings/${meeting.meetingId}`)}
          >
            회의 정보로 돌아가기
          </S.Primary>
        ) : (
          <>
            <S.Primary
              type="button"
              disabled={
                pending || (agenda.status === 'COMPLETED' && !!nextAgenda)
              }
              onClick={() => void execute(complete)}
            >
              {pending
                ? '저장 중…'
                : nextAgenda
                  ? agenda.status === 'COMPLETED'
                    ? '완료된 안건'
                    : '안건 완료하기'
                  : '회의종료·AI요약'}
            </S.Primary>

            <S.Secondary
              type="button"
              disabled={pending}
              onClick={() => setStopOpen(true)}
            >
              회의 중단하기
            </S.Secondary>
          </>
        )}
      </S.Content>

      <ConfirmDialog
        open={stopOpen}
        title="회의를 중단할까요?"
        description="작성한 논의 내용과 결정 사항을 저장하고 나갑니다. 나중에 회의를 이어갈 수 있어요."
        confirmText="중단하기"
        onCancel={() => {
          if (!pending) setStopOpen(false)
        }}
        onConfirm={() =>
          execute(async () => {
            await persist(agenda, false)

            navigate(returnTo, {
              replace: true,
            })
          }, true)
        }
      />
    </S.Page>
  )
}

export default function MeetingRunPage() {
  const { meetingId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const numericId = Number(meetingId)

  const validId =
    !!meetingId &&
    /^\d+$/.test(meetingId) &&
    Number.isSafeInteger(numericId) &&
    numericId > 0

  const query = useGetMeetingDetail(validId ? numericId : 0, {
    query: {
      enabled: validId,
      staleTime: 30_000,
      retry: false,
      select: readMeeting,
    },

    axios: {
      timeout: 15000,
    },
  })

  const meeting = query.data?.meetingId === numericId ? query.data : undefined

  if (!meeting) {
    return (
      <S.Page>
        <Header
          title="회의 진행"
          onBack={() => navigate('/operations?type=minute')}
        />

        <S.Notice>
          {query.isLoading ? (
            <p role="status">회의를 불러오는 중이에요.</p>
          ) : (
            <>
              <h1>회의를 불러오지 못했어요</h1>

              <p role="alert">
                {!validId
                  ? '올바른 회의 ID가 아니에요.'
                  : query.error
                    ? errorMessage(query.error)
                    : '회의 정보를 확인할 수 없어요.'}
              </p>

              {validId && (
                <S.OutlineButton
                  type="button"
                  disabled={query.isFetching}
                  onClick={() => void query.refetch()}
                >
                  다시 불러오기
                </S.OutlineButton>
              )}

              <Link to="/operations?type=minute">회의록 목록으로 이동</Link>
            </>
          )}
        </S.Notice>
      </S.Page>
    )
  }

  if (meeting.status === 'COMPLETED') {
    return (
      <Navigate
        to={`/meetings/${numericId}/review`}
        replace
        state={location.state}
      />
    )
  }

  return (
    <MeetingRun
      key={meeting.meetingId}
      meeting={meeting}
      loadError={query.error ? errorMessage(query.error) : ''}
    />
  )
}
