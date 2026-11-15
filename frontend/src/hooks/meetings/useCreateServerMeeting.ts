import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  getListMeetingsQueryKey,
  useCreateMeeting,
} from '../../api/generated'

import useOnboarding from '../onboarding/useOnboarding'

type Input = {
  title: string
  date: string
  categoryId: number
  participants: string
  agendas: string[]
  scheduleId?: string
}

function validId(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0
  )
}

export default function useCreateServerMeeting() {
  const { group } = useOnboarding()
  const queryClient = useQueryClient()

  const [pending, setPending] = useState(false)
  const busy = useRef(false)

  const completed = useRef<{
    key: string
    meetingId: number
  } | null>(null)

  const mutation = useCreateMeeting({
    mutation: {
      retry: false,
    },
    axios: {
      timeout: 15000,
    },
  })

  async function save(input: Input) {
    if (busy.current) return

    const termId = group?.termId

    if (!validId(termId)) {
      throw new Error('선택한 기수 ID가 없어요.')
    }

    if (!validId(input.categoryId)) {
      throw new Error('회의 카테고리를 선택해주세요.')
    }

    const title = input.title.trim()

    if (!title || title.length > 100) {
      throw new Error('회의 제목을 1~100자로 입력해주세요.')
    }

    const date = new Date(`${input.date}T00:00:00Z`)

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== input.date
    ) {
      throw new Error('올바른 회의 날짜를 선택해주세요.')
    }

    const agendas = input.agendas
      .map(value => value.trim())
      .filter(Boolean)

    if (
      agendas.length === 0 ||
      agendas.some(value => value.length > 100)
    ) {
      throw new Error('안건을 1개 이상, 각각 100자 이내로 입력해주세요.')
    }

    if (input.participants.trim().length > 500) {
      throw new Error('참석자는 500자 이내로 입력해주세요.')
    }

    let scheduleId: number | undefined

    if (input.scheduleId) {
      const parsed = Number(input.scheduleId)

      if (
        !/^\d+$/.test(input.scheduleId) ||
        !validId(parsed)
      ) {
        throw new Error('연결할 일정 ID를 확인해주세요.')
      }

      scheduleId = parsed
    }

    const data = {
      title,
      meetingDate: input.date,
      categoryId: input.categoryId,
      attendees: input.participants.trim() || undefined,
      agendas,
      scheduleId,
    }

    const key = JSON.stringify({ termId, data })

    busy.current = true
    setPending(true)

    try {
      let meetingId =
        completed.current?.key === key
          ? completed.current.meetingId
          : undefined

      if (!meetingId) {
        const response = await mutation.mutateAsync({
          termId,
          data,
        })

        const body = response.data

        if (
          body.success !== true ||
          !validId(body.data?.meetingId)
        ) {
          throw new Error(
            body.message || '회의 생성 결과를 확인할 수 없어요.',
          )
        }

        meetingId = body.data.meetingId

        completed.current = {
          key,
          meetingId,
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['operation-records', termId],
        }),
        queryClient.invalidateQueries({
          queryKey: getListMeetingsQueryKey(termId),
        }),
      ])

      return meetingId
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return {
    save,
    pending,
  }
}