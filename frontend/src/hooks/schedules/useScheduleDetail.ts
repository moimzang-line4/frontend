import { isAxiosError } from 'axios'
import { useParams } from 'react-router'

import { useGetSchedule } from '../../api/generated'
import type { Schedule } from '../../types/schedules/schedule'
import { toScreenColor } from '../../utils/schedules/apiColors'

function parseDateTime(value: string | undefined) {
  if (!value) {
    throw new Error('일정 날짜가 없어요.')
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('일정 날짜를 확인할 수 없어요.')
  }

  const date = [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, '0'),
    String(parsed.getDate()).padStart(2, '0'),
  ].join('-')

  const time = [
    String(parsed.getHours()).padStart(2, '0'),
    String(parsed.getMinutes()).padStart(2, '0'),
  ].join(':')

  return { date, time }
}

function getCountdown(date: string) {
  const today = new Date()
  const [year, month, day] = date.split('-').map(Number)

  const days = Math.round(
    (
      Date.UTC(year, month - 1, day) -
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      )
    ) / 86_400_000,
  )

  if (days === 0) return 'D-DAY'
  if (days > 0) return `D-${days}`

  return `D+${Math.abs(days)}`
}

export default function useScheduleDetail() {
  const { scheduleId } = useParams<{ scheduleId: string }>()

  const numericId = Number(scheduleId)

  const validId =
    !!scheduleId &&
    /^\d+$/.test(scheduleId) &&
    Number.isSafeInteger(numericId) &&
    numericId > 0

  const query = useGetSchedule(validId ? numericId : 0, {
    query: {
      enabled: validId,
      staleTime: 30_000,
      retry: false,

      select: response => {
        const body = response.data

        if (body.success !== true || !body.data) {
          throw new Error(
            body.message || '일정 정보를 불러오지 못했어요.',
          )
        }

        const item = body.data

        if (
          item.scheduleId !== numericId ||
          typeof item.title !== 'string' ||
          !item.title.trim()
        ) {
          throw new Error('서버의 일정 정보를 확인할 수 없어요.')
        }

        const start = parseDateTime(item.startAt)
        const end = parseDateTime(item.endAt)

        const schedule: Schedule = {
          id: String(item.scheduleId),
          title: item.title,
          date: start.date,
          endDate: end.date,

          category: 'custom',
          categoryName: item.categoryName ?? undefined,
          calendarLabel: item.title,

          allDay: item.isAllDay,
          startTime: item.isAllDay ? undefined : start.time,
          endTime: item.isAllDay ? undefined : end.time,

          color: toScreenColor(item.color),
          venue: item.location ?? undefined,

          // 현재 운영 메뉴는 메모·출석·정산·자료 4개입니다.
          operationMenuCount: item.hasOperationSpace
            ? 4
            : undefined,
        }

        return schedule
      },
    },

    axios: {
      timeout: 15000,
    },
  })

  let errorMessage = ''
  const caught: unknown = query.error

  if (scheduleId && !validId) {
    errorMessage = '올바른 일정 ID가 아니에요.'
  } else if (caught) {
    if (isAxiosError(caught)) {
      if (caught.response?.status === 404) {
        errorMessage = '삭제되었거나 존재하지 않는 일정이에요.'
      } else {
        errorMessage = caught.response
          ? '일정 정보를 불러오지 못했어요.'
          : '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.'
      }
    } else if (caught instanceof Error) {
      errorMessage = caught.message
    } else {
      errorMessage = '일정 정보를 불러오지 못했어요.'
    }
  }

  const schedule = query.data

  return {
    schedule,
    countdown: schedule ? getCountdown(schedule.date) : '',
    loading: query.isLoading,
    refreshing: query.isFetching,
    errorMessage,
    reload: query.refetch,
  }
}