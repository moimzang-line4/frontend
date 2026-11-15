import { useQuery } from '@tanstack/react-query'

import { getListMeetingsQueryKey, listMeetings } from '../../api/generated'
import type { MeetingSummaryResponse } from '../../api/models'

export default function useMeetingCardSummaries(termId: number | undefined) {
  const validId =
    typeof termId === 'number' && Number.isSafeInteger(termId) && termId > 0

  return useQuery({
    // 생성 훅의 Axios 응답 캐시와 분리하되, 기존 목록 무효화에 포함됩니다.
    queryKey: [...getListMeetingsQueryKey(termId ?? 0), 'card-summaries'],
    enabled: validId,
    staleTime: 30_000,
    retry: false,
    queryFn: async ({ signal }) => {
      if (!validId || termId === undefined) {
        throw new Error('조회할 기수를 선택해주세요.')
      }

      const meetings = new Map<number, MeetingSummaryResponse>()
      const cursors = new Set<string>()
      let cursor: string | undefined

      do {
        const response = await listMeetings(
          termId,
          { size: 100, ...(cursor ? { cursor } : {}) },
          { signal, timeout: 15000 },
        )
        const body = response.data

        if (body.success !== true || !Array.isArray(body.data?.meetings)) {
          throw new Error(body.message || '회의록 정보를 불러오지 못했어요.')
        }

        for (const meeting of body.data.meetings) {
          if (
            typeof meeting.meetingId !== 'number' ||
            !Number.isSafeInteger(meeting.meetingId) ||
            meeting.meetingId <= 0 ||
            typeof meeting.title !== 'string' ||
            typeof meeting.meetingDate !== 'string' ||
            (meeting.status !== 'IN_PROGRESS' && meeting.status !== 'COMPLETED')
          ) {
            throw new Error('서버의 회의록 정보를 확인할 수 없어요.')
          }

          meetings.set(meeting.meetingId, meeting)
        }

        cursor = body.data.nextCursor || undefined

        if (cursor) {
          if (cursors.has(cursor)) {
            throw new Error('회의록 목록의 다음 페이지를 확인할 수 없어요.')
          }
          cursors.add(cursor)
        }
      } while (cursor)

      return meetings
    },
  })
}
