import { hasServerProgress } from '../../utils/meetings/started'
import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import {
  getListMeetingsQueryKey,
  getListLinkedAgendasQueryKey,
  getListLinkableAgendasQueryKey,
  getMeetingDetail,
  listMeetings,
  listLinkedAgendas,
  unlinkAgenda,
} from '../../api/generated'

import type { MeetingAgendaDetailResponse } from '../../api/models/meetingAgendaDetailResponse'
import type { MeetingSummaryResponse } from '../../api/models/meetingSummaryResponse'

import type {
  Meeting,
  MeetingAgenda,
  MeetingStatus,
} from '../../types/meetings/meeting'

import useOnboarding from '../onboarding/useOnboarding'

export type AttachmentMeeting = Pick<
  Meeting,
  | 'id'
  | 'title'
  | 'date'
  | 'createdAt'
  | 'categoryName'
  | 'status'
  | 'agendas'
> & { started: boolean }

export type AgendaMeeting = Pick<
  Meeting,
  'id' | 'title' | 'date' | 'status'
>

function validId(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0
  )
}

function status(value: unknown): MeetingStatus {
  if (value === 'COMPLETED') return 'completed'
  if (value === 'IN_PROGRESS') return 'in-progress'

  throw new Error('회의 상태를 확인할 수 없어요.')
}

function agenda(
  item: MeetingAgendaDetailResponse,
): MeetingAgenda {
  if (
    !validId(item.agendaId) ||
    typeof item.content !== 'string' ||
    !['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(
      item.status ?? '',
    )
  ) {
    throw new Error('안건 정보를 확인할 수 없어요.')
  }

  return {
    id: String(item.agendaId),
    preparation: item.content,
    discussion: item.discussionNote ?? '',
    decision: item.decision ?? '',
    completed: item.status === 'COMPLETED',
  }
}

function message(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const text = caught.response?.data?.message

    if (typeof text === 'string' && text.trim()) {
      return text
    }

    return caught.response
      ? '회의록과 안건을 불러오지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '요청을 처리하지 못했어요.'
}

export default function useScheduleMeetingAttachments(
  scheduleId: string,
) {
  const { group } = useOnboarding()
  const client = useQueryClient()

  const busy = useRef(false)
  const [pending, setPending] = useState(false)

  const id = Number(scheduleId)
  const termId = group?.termId

  const enabled =
    /^\d+$/.test(scheduleId) &&
    validId(id) &&
    validId(termId)

  const queryKey = [
    ...getListMeetingsQueryKey(termId ?? 0),
    'schedule-attachments',
    scheduleId,
  ]

  const query = useQuery({
    queryKey,
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

      const linked = await listLinkedAgendas(id, options)
      const linkedBody = linked.data

      if (
        linkedBody.success !== true ||
        !Array.isArray(linkedBody.data?.links)
      ) {
        throw new Error(
          linkedBody.message ||
            '연결된 안건을 불러오지 못했어요.',
        )
      }

      const agendas = linkedBody.data.links.map(item => {
        if (
          !validId(item.linkId) ||
          !validId(item.meetingId) ||
          !validId(item.agendaId) ||
          typeof item.meetingTitle !== 'string' ||
          typeof item.meetingDate !== 'string' ||
          typeof item.agendaOrderNo !== 'number' ||
          !Number.isInteger(item.agendaOrderNo) ||
          item.agendaOrderNo < 0
        ) {
          throw new Error(
            '연결된 안건 정보를 확인할 수 없어요.',
          )
        }

        const meeting: AgendaMeeting = {
          id: String(item.meetingId),
          title: item.meetingTitle,
          date: item.meetingDate,
          status: status(item.meetingStatus),
        }

        return {
          linkId: item.linkId,
          meeting,
          index: item.agendaOrderNo,

          agenda: agenda({
            agendaId: item.agendaId,
            content: item.agendaContent,
            status: item.agendaStatus,
            discussionNote: item.discussionNote,
            decision: item.decision,
          }),
        }
      })

      const summaries = new Map<
        number,
        MeetingSummaryResponse
      >()

      const cursors = new Set<string>()
      let cursor: string | undefined

      do {
        const response = await listMeetings(
          termId,
          {
            scheduleId: id,
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
              '연결된 회의록을 불러오지 못했어요.',
          )
        }

        for (const item of body.data.meetings) {
          if (
            !validId(item.meetingId) ||
            typeof item.createdAt !== 'string' ||
            !Number.isFinite(Date.parse(item.createdAt))
          ) {
            throw new Error(
              '회의록 정보를 확인할 수 없어요.',
            )
          }

          summaries.set(item.meetingId, item)
        }

        cursor = body.data.nextCursor || undefined

        if (cursor) {
          if (cursors.has(cursor)) {
            throw new Error(
              '다음 회의록 목록을 확인할 수 없어요.',
            )
          }

          cursors.add(cursor)
        }
      } while (cursor)

      const meetings = await Promise.all(
        [...summaries.entries()].map(
          async (
            [meetingId, summary],
          ): Promise<AttachmentMeeting> => {
            const response = await getMeetingDetail(
              meetingId,
              options,
            )

            const body = response.data
            const item = body.data

            if (
              body.success !== true ||
              item?.meetingId !== meetingId ||
              typeof item.title !== 'string' ||
              typeof item.meetingDate !== 'string' ||
              !Array.isArray(item.agendas)
            ) {
              throw new Error(
                body.message ||
                  '회의 상세 정보를 확인할 수 없어요.',
              )
            }

            return {
              id: String(meetingId),
              title: item.title,
              date: item.meetingDate,
              createdAt: summary.createdAt!,
              categoryName: summary.categoryName ?? '',
              status: status(item.status),
              started: hasServerProgress(item.agendas),

              agendas: [...item.agendas]
                .sort(
                  (a, b) =>
                    (a.orderNo ?? 0) - (b.orderNo ?? 0),
                )
                .map(agenda),
            }
          },
        ),
      )

      return {
        meetings,
        agendas,
      }
    },
  })

  async function disconnect(linkId: number) {
    if (busy.current) {
      throw new Error('연결을 해제하고 있어요.')
    }

    if (!enabled || !validId(linkId)) {
      throw new Error('연결 정보를 확인해주세요.')
    }

    busy.current = true
    setPending(true)

    try {
      const response = await unlinkAgenda(
        id,
        linkId,
        { timeout: 15000 },
      )

      if (response.data.success !== true) {
        throw new Error(
          response.data.message ||
            '연결을 해제하지 못했어요.',
        )
      }

      await Promise.all([
        client.invalidateQueries({
          queryKey,
        }),

        client.invalidateQueries({
          queryKey: getListLinkedAgendasQueryKey(id),
        }),

        ...(validId(termId)
          ? [
              client.invalidateQueries({
                queryKey:
                  getListLinkableAgendasQueryKey(termId),
              }),
            ]
          : []),
      ])
    } catch (caught) {
      throw new Error(message(caught))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return {
    meetings: query.data?.meetings ?? [],
    agendas: query.data?.agendas ?? [],

    loading: query.isLoading,
    refreshing: query.isFetching,
    pending,

    errorMessage: !enabled
      ? '일정과 기수 ID를 확인해주세요.'
      : query.error
        ? message(query.error)
        : '',

    reload: query.refetch,
    disconnect,
  }
}