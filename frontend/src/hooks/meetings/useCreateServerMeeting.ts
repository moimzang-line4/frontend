import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { getListMeetingsQueryKey, useCreateMeeting } from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'
import { meetingError } from '../../utils/meetings/serverMeeting'

type Input = {
  title: string
  date: string
  categoryId: string
  participants: string
  agendas: string[]
  scheduleId?: string
}

export default function useCreateServerMeeting() {
  const { group } = useOnboarding()
  const client = useQueryClient()
  const mutation = useCreateMeeting({
    mutation: { retry: false },
    axios: { timeout: 15000 },
  })
  const busy = useRef(false)
  const created = useRef<{ key: string; id: number } | null>(null)
  const [pending, setPending] = useState(false)

  async function save(input: Input) {
    if (busy.current) throw new Error('회의록을 저장하고 있어요.')
    const termId = group?.termId
    const categoryId = Number(input.categoryId)
    const scheduleId =
      input.scheduleId === undefined ? undefined : Number(input.scheduleId)
    const agendas = input.agendas.map(content => content.trim()).filter(Boolean)

    if (
      typeof termId !== 'number' ||
      !Number.isSafeInteger(termId) ||
      termId <= 0
    ) {
      throw new Error('조회할 기수를 선택해주세요.')
    }
    if (!Number.isSafeInteger(categoryId) || categoryId <= 0)
      throw new Error('카테고리를 선택해주세요.')
    if (
      !input.title.trim() ||
      input.title.trim().length > 100 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.date)
    ) {
      throw new Error('회의 제목과 날짜를 확인해주세요.')
    }
    if (
      input.participants.trim().length > 500 ||
      !agendas.length ||
      agendas.some(content => content.length > 100)
    ) {
      throw new Error('참석자는 500자, 각 안건은 1~100자로 입력해주세요.')
    }
    if (
      scheduleId !== undefined &&
      (!/^\d+$/.test(input.scheduleId!) ||
        !Number.isSafeInteger(scheduleId) ||
        scheduleId <= 0)
    ) {
      throw new Error('연결할 일정 ID를 확인해주세요.')
    }

    const data = {
      title: input.title.trim(),
      meetingDate: input.date,
      categoryId,
      attendees: input.participants.trim(),
      agendas,
      ...(scheduleId === undefined ? {} : { scheduleId }),
    }
    const key = JSON.stringify({ termId, data })
    busy.current = true
    setPending(true)

    try {
      let id = created.current?.key === key ? created.current.id : undefined
      if (id === undefined) {
        const response = await mutation.mutateAsync({ termId, data })
        id = response.data.data?.meetingId
        if (
          response.data.success !== true ||
          typeof id !== 'number' ||
          !Number.isSafeInteger(id) ||
          id <= 0
        ) {
          throw new Error(
            response.data.message || '회의록을 생성하지 못했어요.',
          )
        }
        created.current = { key, id }
      }
      await Promise.all([
        client.invalidateQueries({ queryKey: ['operation-records', termId] }),
        client.invalidateQueries({ queryKey: getListMeetingsQueryKey(termId) }),
      ])
      return id
    } catch (caught) {
      throw new Error(meetingError(caught))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return { save, pending }
}
