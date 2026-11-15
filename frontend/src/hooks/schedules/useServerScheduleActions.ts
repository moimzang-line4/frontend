import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import {
  getGetScheduleQueryKey,
  getListSchedulesQueryKey,
  getListUpcomingSchedulesQueryKey,
  useDeleteSchedule,
  useUpdateSchedule,
} from '../../api/generated'

import type { ScheduleUpdateRequest } from '../../api/models/scheduleUpdateRequest'
import type {
  NewSchedule,
  Schedule,
} from '../../types/schedules/schedule'

import useOnboarding from '../onboarding/useOnboarding'
import { findOrCreateCategory } from './useCreateServerSchedule'
import { toApiColor } from '../../utils/schedules/apiColors'

function validId(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0
  )
}

function getScheduleId(value: string) {
  const id = Number(value)

  if (!/^\d+$/.test(value) || !validId(id)) {
    throw new Error('올바른 일정 ID가 아니에요.')
  }

  return id
}

function requestError(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message

    if (typeof message === 'string' && message.trim()) {
      return new Error(message)
    }

    return new Error(
      caught.response
        ? '요청을 처리하지 못했어요.'
        : '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.',
    )
  }

  return caught instanceof Error
    ? caught
    : new Error('요청을 처리하지 못했어요.')
}

export default function useServerScheduleActions() {
  const { group } = useOnboarding()
  const queryClient = useQueryClient()

  const updateMutation = useUpdateSchedule({
    mutation: { retry: false },
    axios: { timeout: 15000 },
  })

  const deleteMutation = useDeleteSchedule({
    mutation: { retry: false },
    axios: { timeout: 15000 },
  })

  const [pending, setPending] = useState(false)
  const busy = useRef(false)

  async function refreshLists() {
    const termId = group?.termId

    if (!validId(termId)) return

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['home-calendar', termId],
      }),
      queryClient.invalidateQueries({
        queryKey: getListSchedulesQueryKey(termId),
      }),
      queryClient.invalidateQueries({
        queryKey: getListUpcomingSchedulesQueryKey(termId),
      }),
      queryClient.invalidateQueries({
  queryKey: ['operation-records', termId],
}),
    ])
  }

  async function save(
    initial: Schedule,
    input: NewSchedule,
    selectedCategoryName?: string,
  ) {
    if (busy.current) return false

    busy.current = true
    setPending(true)

    try {
      const scheduleId = getScheduleId(initial.id)

      const data: ScheduleUpdateRequest = {
        title: input.title.trim(),
        color: toApiColor(input.color),
        isAllDay: Boolean(input.allDay),

        startAt: `${input.date}T${
          input.allDay ? '00:00:00' : `${input.startTime}:00`
        }`,

        endAt: `${input.endDate ?? input.date}T${
          input.allDay ? '23:59:59' : `${input.endTime}:00`
        }`,

        // 빈 문자열은 서버에서 장소를 지우라는 의미예요.
        location: input.venue?.trim() ?? '',
      }

      const categoryName = selectedCategoryName?.trim()

      // 카테고리를 바꿨을 때만 서버 ID를 찾아 보내요.
      if (
        categoryName &&
        categoryName !== initial.categoryName
      ) {
        const termId = group?.termId

        if (!validId(termId)) {
          throw new Error('선택한 기수 ID가 없어요.')
        }

        data.categoryId = await findOrCreateCategory(
          termId,
          categoryName,
        )
      }

      // 운영 공간은 새로 켤 수 있지만,
      // 이미 있는 운영 공간을 끄는 요청은 보내지 않아요.
      if (
        initial.operationMenuCount === undefined &&
        input.createOperationSpace
      ) {
        data.createOperationSpace = true
      }

      // 메모는 현재 입력창이 없으므로 보내지 않아요.
      // PATCH는 생략한 필드를 유지합니다.
      const response = await updateMutation.mutateAsync({
        scheduleId,
        data,
      })

      if (
        response.data.success !== true ||
        response.data.data?.scheduleId !== scheduleId
      ) {
        throw new Error(
          response.data.message || '일정을 수정하지 못했어요.',
        )
      }

      await Promise.all([
        refreshLists(),
        queryClient.invalidateQueries({
          queryKey: getGetScheduleQueryKey(scheduleId),
        }),
      ])

      return true
    } catch (caught) {
      throw requestError(caught)
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  async function remove(id: string) {
    if (busy.current) return false

    busy.current = true
    setPending(true)

    try {
      const scheduleId = getScheduleId(id)

      const response = await deleteMutation.mutateAsync({
        scheduleId,
      })

      if (response.data.success !== true) {
        throw new Error(
          response.data.message || '일정을 삭제하지 못했어요.',
        )
      }

      const queryKey = getGetScheduleQueryKey(scheduleId)

      await queryClient.cancelQueries({
        queryKey,
        exact: true,
      })

      queryClient.removeQueries({
        queryKey,
        exact: true,
      })

      await refreshLists()

      return true
    } catch (caught) {
      throw requestError(caught)
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return {
    save,
    remove,
    pending,
  }
}