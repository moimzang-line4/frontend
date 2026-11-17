import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getListLinkableAgendasQueryKey,
  getListLinkedAgendasQueryKey,
  getListMeetingsQueryKey,
  listLinkableAgendas,
  listMeetings,
  linkAgendas,
} from '../../api/generated'

import type { MeetingLinkableAgendaResponse } from '../../api/models/meetingLinkableAgendaResponse'
import type { MeetingSummaryResponse } from '../../api/models/meetingSummaryResponse'
import type { MeetingAgenda } from '../../types/meetings/meeting'
import type { AgendaMeeting } from './useScheduleMeetingAttachments'

import useOnboarding from '../onboarding/useOnboarding'

export type CandidateAgenda = {
  agendaId: number
  meeting: AgendaMeeting
  categoryName: string
  index: number
  agenda: MeetingAgenda
}

function validId(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0
  )
}

function getError(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const text = caught.response?.data?.message

    if (typeof text === 'string' && text.trim()) {
      return text
    }

    return caught.response
      ? '안건 연결 요청을 처리하지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '요청을 처리하지 못했어요.'
}

export default function useAgendaLinkCandidates(
  scheduleId: string,
) {
  const { group } = useOnboarding()
  const client = useQueryClient()

  const [pending, setPending] = useState(false)
  const busy = useRef(false)

  const termId = group?.termId
  const id = Number(scheduleId)

  const enabled =
    /^\d+$/.test(scheduleId) &&
    validId(id) &&
    validId(termId)

  const query = useQuery({
    queryKey: [
      ...getListLinkableAgendasQueryKey(termId ?? 0),
      'selection-screen',
    ],

    enabled,
    staleTime: 0,
    retry: false,

    queryFn: async ({ signal }) => {
      if (!enabled || !validId(termId)) {
        throw new Error('일정과 기수 ID를 확인해주세요.')
      }

      const options = {
        signal,
        timeout: 15000,
      }

      const candidates = new Map<
        number,
        MeetingLinkableAgendaResponse
      >()

      let cursor: string | undefined
      const cursors = new Set<string>()

      do {
        const response = await listLinkableAgendas(
          termId,
          {
            size: 100,
            cursor,
          },
          options,
        )

        const body = response.data

        if (
          body.success !== true ||
          !Array.isArray(body.data?.agendas)
        ) {
          throw new Error(
            body.message ||
              '연결할 안건을 불러오지 못했어요.',
          )
        }

        for (const item of body.data.agendas) {
          if (!validId(item.agendaId)) {
            throw new Error(
              '안건 ID를 확인할 수 없어요.',
            )
          }

          candidates.set(item.agendaId, item)
        }

        cursor = body.data.nextCursor || undefined

        if (cursor) {
          if (cursors.has(cursor)) {
            throw new Error(
              '다음 안건 목록을 확인할 수 없어요.',
            )
          }

          cursors.add(cursor)
        }
      } while (cursor)

      if (!candidates.size) {
        return {
          agendas: [] as CandidateAgenda[],
        }
      }

      const summaries = new Map<
        number,
        MeetingSummaryResponse
      >()

      cursor = undefined
      cursors.clear()

      do {
        const response = await listMeetings(
          termId,
          {
            size: 100,
            cursor,
          },
          options,
        )

        const body = response.data

        if (
          body.success !== true ||
          !Array.isArray(body.data?.meetings)
        ) {
          throw new Error(
            body.message ||
              '회의 정보를 불러오지 못했어요.',
          )
        }

        for (const item of body.data.meetings) {
          if (validId(item.meetingId)) {
            summaries.set(item.meetingId, item)
          }
        }

        cursor = body.data.nextCursor || undefined

        if (cursor) {
          if (cursors.has(cursor)) {
            throw new Error(
              '다음 회의 목록을 확인할 수 없어요.',
            )
          }

          cursors.add(cursor)
        }
      } while (cursor)

      const agendas: CandidateAgenda[] = [
        ...candidates.entries(),
      ].map(([agendaId, item]) => {
        const summary =
          item.meetingId === undefined
            ? undefined
            : summaries.get(item.meetingId)

        if (
          !validId(item.meetingId) ||
          typeof item.content !== 'string' ||
          typeof item.orderNo !== 'number' ||
          !Number.isInteger(item.orderNo) ||
          item.orderNo < 0 ||
          ![
            'PENDING',
            'IN_PROGRESS',
            'COMPLETED',
          ].includes(item.status ?? '') ||
          !summary ||
          typeof summary.title !== 'string' ||
          typeof summary.meetingDate !== 'string' ||
          (
            summary.status !== 'IN_PROGRESS' &&
            summary.status !== 'COMPLETED'
          )
        ) {
          throw new Error(
            '안건의 회의 정보를 확인할 수 없어요. 다시 불러와주세요.',
          )
        }

        return {
          agendaId,

          meeting: {
            id: String(item.meetingId),
            title: summary.title,
            date: summary.meetingDate,
            status:
              summary.status === 'COMPLETED'
                ? 'completed'
                : 'in-progress',
          },

          categoryName: summary.categoryName ?? '',
          index: item.orderNo,

          agenda: {
            id: String(agendaId),
            preparation: item.content,
            discussion: item.discussionNote ?? '',
            decision: item.decision ?? '',
            completed: item.status === 'COMPLETED',
          },
        }
      })

      return { agendas }
    },
  })

  async function connect(agendaIds: number[]) {
    if (busy.current) {
      throw new Error('안건을 연결하고 있어요.')
    }

    if (!enabled || !validId(termId)) {
      throw new Error('일정과 기수 ID를 확인해주세요.')
    }

    const ids = [...new Set(agendaIds)]

    const available = new Set(
      query.data?.agendas.map(item => item.agendaId),
    )

    if (
      !ids.length ||
      ids.some(
        value =>
          !validId(value) ||
          !available.has(value),
      )
    ) {
      throw new Error(
        '연결할 안건을 다시 선택해주세요.',
      )
    }

    busy.current = true
    setPending(true)

    try {
      const response = await linkAgendas(
        id,
        {
          agendaIds: ids,
        },
        {
          timeout: 15000,
        },
      )

      const body = response.data

      if (body.success !== true) {
        throw new Error(
          body.message ||
            '안건을 연결하지 못했어요.',
        )
      }

      const links = body.data?.links

      if (
        !Array.isArray(links) ||
        links.length !== ids.length ||
        links.some(
          item =>
            !validId(item.linkId) ||
            !validId(item.agendaId) ||
            !ids.includes(item.agendaId),
        ) ||
        new Set(
          links.map(item => item.agendaId),
        ).size !== ids.length
      ) {
        throw new Error(
          '안건 연결 결과를 확인하지 못했어요. 목록을 다시 확인해주세요.',
        )
      }
    } catch (caught) {
      throw new Error(getError(caught))
    } finally {
      await Promise.all([
        client.invalidateQueries({
          queryKey:
            getListLinkableAgendasQueryKey(termId),
        }),

        client.invalidateQueries({
          queryKey:
            getListLinkedAgendasQueryKey(id),
        }),

        client.invalidateQueries({
          queryKey:
            getListMeetingsQueryKey(termId),
        }),
      ])

      busy.current = false
      setPending(false)
    }
  }

  return {
    agendas: query.data?.agendas ?? [],

    loading: query.isLoading,
    refreshing: query.isFetching,
    pending,

    errorMessage: !enabled
      ? '일정과 기수 ID를 확인해주세요.'
      : query.error
        ? getError(query.error)
        : '',

    reload: query.refetch,
    connect,
  }
}