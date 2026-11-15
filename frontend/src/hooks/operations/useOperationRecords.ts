import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

import { listOperationSpaces } from '../../api/generated'

import type { ListOperationSpacesSort } from '../../api/models/listOperationSpacesSort'
import type { ListOperationSpacesType } from '../../api/models/listOperationSpacesType'
import type {
  OperationFilter,
  OperationRecord,
  OperationSort,
} from '../../types/operations/operation'

import useOnboarding from '../onboarding/useOnboarding'

type RecordItem = Omit<OperationRecord, 'createdAt'>

const sortValues: Record<OperationSort, ListOperationSpacesSort> = {
  upcoming: 'UPCOMING',
  latest: 'LATEST',
  earliest: 'OLDEST',
  name: 'NAME',
}

const filterValues: Record<OperationFilter, ListOperationSpacesType> = {
  all: 'ALL',
  schedule: 'SCHEDULE',
  minute: 'MEETING',
}

export default function useOperationRecords() {
  const { group } = useOnboarding()
  const [params, setParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState<OperationSort>('latest')

  const past = params.get('period') === 'past'

  const requestedType = params.get('type')

  const filter: OperationFilter =
    requestedType === 'minute'
      ? 'minute'
      : requestedType === 'schedule'
        ? 'schedule'
        : 'all'

  const termId = group?.termId

  const hasTermId =
    typeof termId === 'number' &&
    Number.isSafeInteger(termId) &&
    termId > 0

  // 입력할 때마다 즉시 요청하지 않고 잠깐 기다려요.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setKeyword(query.trim())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [query])

  function setPast(value: boolean) {
    setParams(current => {
      const next = new URLSearchParams(current)

      if (value) next.set('period', 'past')
      else next.delete('period')

      return next
    }, { replace: true })
  }

  function setFilter(value: OperationFilter) {
    setParams(current => {
      const next = new URLSearchParams(current)

      if (value === 'all') next.delete('type')
      else next.set('type', value)

      return next
    }, { replace: true })
  }

  const result = useInfiniteQuery({
    queryKey: [
      'operation-records',
      termId,
      past,
      filter,
      keyword,
      sort,
    ],

    enabled: hasTermId,
    initialPageParam: undefined as string | undefined,
    staleTime: 30_000,
    retry: 1,

    queryFn: async ({ pageParam, signal }) => {
      if (!hasTermId) {
        throw new Error('선택한 기수 ID가 없어요.')
      }

      const response = await listOperationSpaces(
        termId,
        {
          status: past ? 'PAST' : 'ONGOING',
          type: filterValues[filter],
          keyword: keyword || undefined,
          sort: sortValues[sort],
          cursor: pageParam,
          size: 20,
        },
        {
          signal,
          timeout: 15000,
        },
      )

      const body = response.data

      if (
        body.success !== true ||
        !Array.isArray(body.data?.items)
      ) {
        throw new Error(
          body.message || '운영 기록을 불러오지 못했어요.',
        )
      }

      const records = body.data.items.map(
        (item): RecordItem => {
          if (
            typeof item.id !== 'number' ||
            !Number.isSafeInteger(item.id) ||
            item.id <= 0 ||
            typeof item.title !== 'string' ||
            typeof item.date !== 'string' ||
            (
              item.type !== 'SCHEDULE' &&
              item.type !== 'MEETING'
            ) ||
            (
              item.status !== 'ONGOING' &&
              item.status !== 'PAST'
            )
          ) {
            throw new Error(
              '서버의 운영 기록 정보를 확인할 수 없어요.',
            )
          }

          return {
            id: String(item.id),
            kind: item.type === 'SCHEDULE'
              ? 'schedule'
              : 'minute',
            title: item.title,
            date: item.date,
            past: item.status === 'PAST',
          }
        },
      )

      const nextCursor = body.data.nextCursor || undefined

      if (nextCursor && nextCursor === pageParam) {
        throw new Error('다음 목록 정보를 확인할 수 없어요.')
      }

      return {
        records,
        totalCount: body.data.totalCount,
        nextCursor,
      }
    },

    getNextPageParam: lastPage => lastPage.nextCursor,
  })

  const records =
    result.data?.pages.flatMap(page => page.records) ?? []

  const caught: unknown = result.error
  let errorMessage = ''

  if (!hasTermId) {
    errorMessage = '선택한 기수 ID가 없어요.'
  } else if (isAxiosError(caught)) {
    errorMessage = caught.response
      ? '운영 기록을 불러오지 못했어요.'
      : '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.'
  } else if (caught instanceof Error) {
    errorMessage = caught.message
  }

  return {
    records,
    totalCount:
      result.data?.pages[0]?.totalCount ?? records.length,

    past,
    setPast,
    filter,
    setFilter,
    query,
    setQuery,
    sort,
    setSort,

    loading: result.isLoading,
    refreshing: result.isFetching,
    loadingMore: result.isFetchingNextPage,
    hasMore: result.hasNextPage,
    canRetry: hasTermId,
    errorMessage,

    reload: result.refetch,
    loadMore: result.fetchNextPage,
  }
}