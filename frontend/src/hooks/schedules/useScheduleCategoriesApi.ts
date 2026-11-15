import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import {
  getListCategories1QueryKey,
  useCreateCategory1,
  useListCategories1,
} from '../../api/generated'

import type { ScheduleCategoryResponse } from '../../api/models/scheduleCategoryResponse'
import type { CategoryOption } from '../../types/schedules/schedule'

import useOnboarding from '../onboarding/useOnboarding'

function toOption(item: ScheduleCategoryResponse): CategoryOption {
  if (
    typeof item.categoryId !== 'number' ||
    !Number.isSafeInteger(item.categoryId) ||
    item.categoryId <= 0 ||
    typeof item.name !== 'string' ||
    !item.name.trim()
  ) {
    throw new Error('카테고리 정보를 확인할 수 없어요.')
  }

  return {
    id: String(item.categoryId),
    label: item.name,
    kind: 'custom',
  }
}

function getErrorMessage(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message

    if (typeof message === 'string' && message.trim()) {
      return message
    }

    return caught.response
      ? '카테고리 요청을 처리하지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '카테고리 요청을 처리하지 못했어요.'
}

export default function useScheduleCategoriesApi() {
  const { group } = useOnboarding()
  const queryClient = useQueryClient()

  const [pending, setPending] = useState(false)
  const busy = useRef(false)

  const termId = group?.termId

  const hasTermId =
    typeof termId === 'number' &&
    Number.isSafeInteger(termId) &&
    termId > 0

  const query = useListCategories1(hasTermId ? termId : 0, {
    query: {
      enabled: hasTermId,
      staleTime: 30_000,
      retry: 1,

      select: response => {
        const body = response.data

        if (
          body.success !== true ||
          !Array.isArray(body.data?.categories)
        ) {
          throw new Error(
            body.message || '카테고리를 불러오지 못했어요.',
          )
        }

        return body.data.categories.map(toOption)
      },
    },

    axios: {
      timeout: 15000,
    },
  })

  const mutation = useCreateCategory1({
    mutation: {
      retry: false,
    },
    axios: {
      timeout: 15000,
    },
  })

  async function addCategory(label: string) {
    if (busy.current) return

    if (!hasTermId) {
      throw new Error('선택한 기수 ID가 없어요.')
    }

    const name = label.trim()

    if (!name || name.length > 50) {
      throw new Error('카테고리 이름을 1~50자로 입력해주세요.')
    }

    const existing = query.data?.find(
      category => category.label === name,
    )

    if (existing) return existing

    busy.current = true
    setPending(true)

    try {
      const response = await mutation.mutateAsync({
        termId,
        data: { name },
      })

      const body = response.data

      if (body.success !== true || !body.data) {
        throw new Error(
          body.message || '카테고리를 추가하지 못했어요.',
        )
      }

      const option = toOption(body.data)

      await queryClient.invalidateQueries({
        queryKey: getListCategories1QueryKey(termId),
      })

      return option
    } catch (caught) {
      throw new Error(getErrorMessage(caught))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  const caught: unknown = query.error

  return {
    categories: query.data ?? [],
    loading: query.isLoading,
    refreshing: query.isFetching,
    pending,
    errorMessage: !hasTermId
      ? '선택한 기수 ID가 없어요.'
      : caught
        ? getErrorMessage(caught)
        : '',
    canRetry: hasTermId,
    reload: query.refetch,
    addCategory,
  }
}