import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import {
  getGetMeetingDetailQueryKey,
  useUpdateAgendaContent,
} from '../../api/generated'

import type { MeetingAgendaDetailResponse } from '../../api/models/meetingAgendaDetailResponse'

import * as S from '../../styles/meetings/MeetingPage.styles'

type Props = {
  meetingId: number
  agenda: MeetingAgendaDetailResponse
  index: number
}

function errorMessage(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message

    if (typeof message === 'string' && message.trim()) {
      return message
    }

    return caught.response
      ? '안건을 저장하지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '안건을 저장하지 못했어요.'
}

export default function MeetingAgendaEditor({
  meetingId,
  agenda,
  index,
}: Props) {
  const queryClient = useQueryClient()

  const mutation = useUpdateAgendaContent({
    mutation: {
      retry: false,
    },
    axios: {
      timeout: 15000,
    },
  })

  const [discussion, setDiscussion] = useState(
    agenda.discussionNote ?? '',
  )
  const [decision, setDecision] = useState(
    agenda.decision ?? '',
  )
  const [pending, setPending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const busy = useRef(false)
  const completed = agenda.status === 'COMPLETED'

  async function save(complete: boolean) {
    if (busy.current) return

    const agendaId = agenda.agendaId

    if (
      typeof agendaId !== 'number' ||
      !Number.isSafeInteger(agendaId) ||
      agendaId <= 0
    ) {
      setError('안건 ID를 확인할 수 없어요.')
      return
    }

    busy.current = true
    setPending(true)
    setSaved(false)
    setError('')

    try {
      const response = await mutation.mutateAsync({
        agendaId,
        data: {
          discussionNote: discussion,
          decision,

          // 일반 저장은 상태를 바꾸지 않아요.
          ...(complete
            ? { status: 'COMPLETED' as const }
            : {}),
        },
      })

      const body = response.data

      if (
        body.success !== true ||
        body.data?.agendaId !== agendaId ||
        (
          complete &&
          body.data.status !== 'COMPLETED'
        )
      ) {
        throw new Error(
          body.message || '안건 저장 결과를 확인할 수 없어요.',
        )
      }

      await queryClient.invalidateQueries({
        queryKey: getGetMeetingDetailQueryKey(meetingId),
      })

      setSaved(true)
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <S.RunCard>
      <S.RunHeading>
        <h3>안건 {index + 1}</h3>

        <S.Status $done={completed}>
          {completed
            ? '완료'
            : agenda.status === 'IN_PROGRESS'
              ? '진행 중'
              : '대기'}
        </S.Status>
      </S.RunHeading>

      <S.Preparation>
        {agenda.content}
      </S.Preparation>

      <S.RunField>
        논의 내용

        <S.Textarea
          aria-label={`안건 ${index + 1} 논의 내용`}
          value={discussion}
          maxLength={10000}
          disabled={pending}
          onChange={event => {
            setDiscussion(event.target.value)
            setSaved(false)
          }}
        />
      </S.RunField>

      <S.RunField>
        결정 사항

        <S.Textarea
          aria-label={`안건 ${index + 1} 결정 사항`}
          value={decision}
          maxLength={10000}
          disabled={pending}
          onChange={event => {
            setDecision(event.target.value)
            setSaved(false)
          }}
        />
      </S.RunField>

      <S.RunField>
        <S.OutlineButton
          type="button"
          disabled={pending}
          onClick={() => void save(false)}
        >
          {pending ? '처리 중…' : '저장하기'}
        </S.OutlineButton>

        <S.Submit
          type="button"
          disabled={pending || completed}
          onClick={() => void save(true)}
        >
          {completed ? '완료된 안건' : '안건 완료'}
        </S.Submit>
      </S.RunField>

      {saved && (
        <S.ProgressText role="status">
          저장됐어요.
        </S.ProgressText>
      )}

      {error && (
        <S.Error role="alert">{error}</S.Error>
      )}
    </S.RunCard>
  )
}