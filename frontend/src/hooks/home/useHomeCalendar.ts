import { useMemo, useState } from 'react'
import { isAxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

import {
  listSchedules,
  useListUpcomingSchedules,
} from '../../api/generated'

import type { ScheduleSummaryResponse } from '../../api/models/scheduleSummaryResponse'
import type { UpcomingScheduleResponse } from '../../api/models/upcomingScheduleResponse'
import type { Schedule } from '../../types/schedules/schedule'

import useTodayDate from './useTodayDate'
import useOnboarding from '../onboarding/useOnboarding'

type BasicScheduleResponse = Pick<
  ScheduleSummaryResponse,
  'scheduleId' | 'title' | 'startAt' | 'categoryName' | 'location'
>

// 서버 데이터를 기존 화면에서 사용하는 형태로 바꿔요.
function toSchedule(item: BasicScheduleResponse): Schedule {
  if (
    typeof item.scheduleId !== 'number' ||
    !Number.isSafeInteger(item.scheduleId) ||
    item.scheduleId <= 0 ||
    typeof item.title !== 'string' ||
    !item.title.trim() ||
    typeof item.startAt !== 'string'
  ) {
    throw new Error('서버의 일정 정보를 확인할 수 없어요.')
  }

  const start = new Date(item.startAt)

  if (Number.isNaN(start.getTime())) {
    throw new Error('일정 시작 날짜를 확인할 수 없어요.')
  }

  const date = [
    start.getFullYear(),
    String(start.getMonth() + 1).padStart(2, '0'),
    String(start.getDate()).padStart(2, '0'),
  ].join('-')

  const startTime = [
    String(start.getHours()).padStart(2, '0'),
    String(start.getMinutes()).padStart(2, '0'),
  ].join(':')

  return {
    id: String(item.scheduleId),
    title: item.title,
    date,
    startTime,
    category: 'custom',
    categoryName: item.categoryName ?? undefined,
    calendarLabel: item.title,
    venue: item.location ?? undefined,
  }
}

function toCalendarSchedule(item: ScheduleSummaryResponse): Schedule {
  const schedule = toSchedule(item)

  let endDate: string | undefined
  let endTime: string | undefined

  if (item.endAt) {
    const end = new Date(item.endAt)

    if (Number.isNaN(end.getTime())) {
      throw new Error('일정 종료 날짜를 확인할 수 없어요.')
    }

    endDate = [
      end.getFullYear(),
      String(end.getMonth() + 1).padStart(2, '0'),
      String(end.getDate()).padStart(2, '0'),
    ].join('-')

    endTime = [
      String(end.getHours()).padStart(2, '0'),
      String(end.getMinutes()).padStart(2, '0'),
    ].join(':')
  }

  return {
    ...schedule,
    allDay: item.isAllDay,
    color: item.color ?? undefined,
    startTime: item.isAllDay ? undefined : schedule.startTime,
    endTime: item.isAllDay ? undefined : endTime,
    endDate,
  }
}

function toUpcomingSchedule(item: UpcomingScheduleResponse): Schedule {
  return {
    ...toSchedule(item),
    operationMenuCount: item.operationMenuCount,
  }
}

function errorMessage(caught: unknown) {
  if (!caught) return ''

  if (isAxiosError(caught)) {
    return caught.response
      ? '일정을 불러오지 못했어요.'
      : '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.'
  }

  return caught instanceof Error
    ? caught.message
    : '일정을 불러오지 못했어요.'
}

async function fetchCalendarSchedules(
  termId: number,
  from: string,
  to: string,
  signal: AbortSignal,
): Promise<Schedule[]> {
  const schedules: Schedule[] = []
  const visited = new Set<string>()

  let cursor: string | undefined

  while (true) {
    const response = await listSchedules(
      termId,
      {
        from,
        to,
        size: 100,
        cursor,
      },
      {
        signal,
        timeout: 15000,
      },
    )

    const body = response.data

    if (
      body.success !== true ||
      !Array.isArray(body.data?.schedules)
    ) {
      throw new Error(
        body.message || '일정 목록 응답을 확인할 수 없어요.',
      )
    }

    schedules.push(...body.data.schedules.map(toCalendarSchedule))

    const nextCursor = body.data.nextCursor

    if (!nextCursor) break

    if (visited.has(nextCursor)) {
      throw new Error('다음 일정 목록을 불러오지 못했어요.')
    }

    visited.add(nextCursor)
    cursor = nextCursor
  }

  return schedules
}

export default function useHomeCalendar() {
  const today = useTodayDate()
  const { group } = useOnboarding()
  const [searchParams] = useSearchParams()

  const dateParam = searchParams.get('date')

  const initialDate =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : today

  const [month, setMonth] = useState(() => {
    const [year, monthNumber] = initialDate.split('-').map(Number)
    return new Date(year, monthNumber - 1, 1)
  })

  const [selectedDate, setSelectedDate] = useState(initialDate)

  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`

  const from = `${prefix}-01`
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  const to = `${prefix}-${String(lastDay).padStart(2, '0')}`

  const termId = group?.termId

  const hasTermId =
    typeof termId === 'number' &&
    Number.isSafeInteger(termId) &&
    termId > 0

  const calendarQuery = useQuery({
    queryKey: ['home-calendar', termId, from, to],
    enabled: hasTermId,
    staleTime: 30_000,
    retry: 1,

    queryFn: ({ signal }) => {
      if (!hasTermId) {
        throw new Error('선택한 기수 ID가 없어요.')
      }

      return fetchCalendarSchedules(termId, from, to, signal)
    },
  })

  const upcomingQuery = useListUpcomingSchedules(
    hasTermId ? termId : 0,
    { limit: 5 },
    {
      query: {
        enabled: hasTermId,
        staleTime: 30_000,
        retry: 1,

        select: response => {
          const body = response.data

          if (
            body.success !== true ||
            !Array.isArray(body.data?.schedules)
          ) {
            throw new Error(
              body.message || '다가오는 일정을 확인할 수 없어요.',
            )
          }

          return body.data.schedules.map(toUpcomingSchedule)
        },
      },

      axios: {
        timeout: 15000,
      },
    },
  )

  const days = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1).getDay()
    const cells = Math.ceil((firstDay + lastDay) / 7) * 7

    return Array.from({ length: cells }, (_, index) => {
      const day = index - firstDay + 1

      return day > 0 && day <= lastDay
        ? {
            day,
            date: `${prefix}-${String(day).padStart(2, '0')}`,
          }
        : null
    })
  }, [year, monthIndex, lastDay, prefix])

  function changeMonth(offset: number) {
    setMonth(current =>
      new Date(
        current.getFullYear(),
        current.getMonth() + offset,
        1,
      ),
    )
  }

  async function reload() {
    await Promise.all([
      calendarQuery.refetch(),
      upcomingQuery.refetch(),
    ])
  }

  return {
    year,
    monthIndex,
    days,
    today,
    selectedDate,
    setSelectedDate,
    changeMonth,

    groupName: group?.shortName || group?.name || '',
    schedules: calendarQuery.data ?? [],
    upcoming: upcomingQuery.data ?? [],

    loading: calendarQuery.isLoading || upcomingQuery.isLoading,
    refreshing: calendarQuery.isFetching || upcomingQuery.isFetching,

    errorMessage: !hasTermId
      ? '선택한 기수 ID가 없어요.'
      : errorMessage(calendarQuery.error) ||
        errorMessage(upcomingQuery.error),

    canRetry: hasTermId,
    reload,
  }
}