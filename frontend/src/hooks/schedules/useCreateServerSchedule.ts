import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  createCategory1,
  getListCategories1QueryKey,
  getListSchedulesQueryKey,
  getListUpcomingSchedulesQueryKey,
  listCategories1,
  useCreateSchedule,
} from '../../api/generated'

import type { NewSchedule } from '../../types/schedules/schedule'

import useOnboarding from '../onboarding/useOnboarding'
import { toApiColor } from '../../utils/schedules/apiColors'

function validId(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0
  )
}

export async function findOrCreateCategory(
  termId: number,
  name: string,
) {
  const response = await listCategories1(termId, {
    timeout: 15000,
  })

  const body = response.data

  if (
    body.success !== true ||
    !Array.isArray(body.data?.categories)
  ) {
    throw new Error(
      body.message || '카테고리를 불러오지 못했어요.',
    )
  }

  const existing = body.data.categories.find(
    category => category.name === name,
  )

  if (existing) {
    if (!validId(existing.categoryId)) {
      throw new Error('카테고리 ID를 확인할 수 없어요.')
    }

    return existing.categoryId
  }

  const created = await createCategory1(
    termId,
    { name },
    { timeout: 15000 },
  )

  if (
    created.data.success !== true ||
    !validId(created.data.data?.categoryId)
  ) {
    throw new Error(
      created.data.message || '카테고리를 생성하지 못했어요.',
    )
  }

  return created.data.data.categoryId
}

export default function useCreateServerSchedule() {
  const { group } = useOnboarding()
  const queryClient = useQueryClient()

  const mutation = useCreateSchedule({
    mutation: {
      retry: false,
    },
    axios: {
      timeout: 15000,
    },
  })

  const [pending, setPending] = useState(false)
  const busy = useRef(false)

  const created = useRef<{
    key: string
    scheduleId: number
  } | null>(null)

  async function save(
    input: NewSchedule,
    selectedCategoryName?: string,
  ) {
    if (busy.current) return

    const termId = group?.termId

    if (!validId(termId)) {
      throw new Error('선택한 기수 ID가 없어요.')
    }

    busy.current = true
    setPending(true)

    try {
      const key = JSON.stringify({
        termId,
        input,
        selectedCategoryName,
      })

      let scheduleId = created.current?.key === key
        ? created.current.scheduleId
        : undefined

      if (!scheduleId) {
        const categoryName = selectedCategoryName?.trim()

        const categoryId = categoryName
          ? await findOrCreateCategory(termId, categoryName)
          : undefined

        const startTime = input.allDay
          ? '00:00:00'
          : `${input.startTime}:00`

        const endTime = input.allDay
          ? '23:59:59'
          : `${input.endTime}:00`

        const response = await mutation.mutateAsync({
          termId,
          data: {
            title: input.title.trim(),
            color: toApiColor(input.color),
            categoryId,
            isAllDay: Boolean(input.allDay),
            startAt: `${input.date}T${startTime}`,
            endAt: `${input.endDate ?? input.date}T${endTime}`,
            location: input.venue?.trim() || undefined,
            createOperationSpace: input.createOperationSpace,
          },
        })

        const body = response.data

        if (
          body.success !== true ||
          !validId(body.data?.scheduleId)
        ) {
          throw new Error(
            body.message || '일정 생성 결과를 확인할 수 없어요.',
          )
        }

        scheduleId = body.data.scheduleId

        created.current = {
          key,
          scheduleId,
        }
      }

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
          queryKey: getListCategories1QueryKey(termId),
        }),
        queryClient.invalidateQueries({
  queryKey: ['operation-records', termId],
}),
      ])

      return scheduleId
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