import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import {
  getListNotesQueryKey,
  listNotes,
} from '../../api/generated'

import type { NoteResponse } from '../../api/models/noteResponse'
import type { NoteResponseType } from '../../api/models/noteResponseType'

import type {
  NoteType,
  OperationNote,
} from '../../types/notes/operationNote'

const apiTypes: Record<NoteType | 'all', string> = {
  all: 'ALL',
  general: 'GENERAL',
  todo: 'TODO',
  decision: 'DECISION',
  idea: 'IDEA',
}

const screenTypes: Record<NoteResponseType, NoteType> = {
  GENERAL: 'general',
  TODO: 'todo',
  DECISION: 'decision',
  IDEA: 'idea',
}

function toNote(
  item: NoteResponse,
  scheduleId: string,
): OperationNote {
  if (
    typeof item.noteId !== 'number' ||
    !Number.isSafeInteger(item.noteId) ||
    item.noteId <= 0 ||
    (
      item.type !== 'GENERAL' &&
      item.type !== 'TODO' &&
      item.type !== 'DECISION' &&
      item.type !== 'IDEA'
    ) ||
    typeof item.title !== 'string' ||
    typeof item.content !== 'string' ||
    (
      item.assignee != null &&
      typeof item.assignee !== 'string'
    ) ||
    typeof item.createdAt !== 'string' ||
    !Number.isFinite(Date.parse(item.createdAt)) ||
    typeof item.updatedAt !== 'string' ||
    !Number.isFinite(Date.parse(item.updatedAt))
  ) {
    throw new Error(
      '서버의 운영 메모 정보를 확인할 수 없어요.',
    )
  }

  return {
    id: String(item.noteId),
    scheduleId,
    type: screenTypes[item.type],
    title: item.title,
    content: item.content,
    assignee: item.assignee ?? '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function getError(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message

    if (typeof message === 'string' && message.trim()) {
      return message
    }

    return caught.response
      ? '운영 메모를 불러오지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '운영 메모를 불러오지 못했어요.'
}

export default function useServerOperationNotes(
  scheduleId: string,
  type: NoteType | 'all',
  search: string,
) {
  const id = Number(scheduleId)

  const validId =
    /^\d+$/.test(scheduleId) &&
    Number.isSafeInteger(id) &&
    id > 0

  const [keyword, setKeyword] = useState(search.trim())

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setKeyword(search.trim())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  const result = useQuery({
    queryKey: [
      ...getListNotesQueryKey(validId ? id : 0),
      'screen-list',
      type,
      keyword,
    ],

    enabled: validId,
    staleTime: 30_000,
    retry: false,

    queryFn: async ({ signal }) => {
      const notes = new Map<string, OperationNote>()
      const cursors = new Set<string>()

      let cursor: string | undefined
      let totalCount: number | undefined

      do {
        const response = await listNotes(
          validId ? id : 0,
          {
            type: apiTypes[type],
            keyword: keyword || undefined,
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
          !Array.isArray(body.data?.notes)
        ) {
          throw new Error(
            body.message || '운영 메모를 불러오지 못했어요.',
          )
        }

        if (totalCount === undefined) {
          totalCount = body.data.totalCount
        }

        for (const item of body.data.notes) {
          const note = toNote(item, scheduleId)
          notes.set(note.id, note)
        }

        cursor = body.data.nextCursor || undefined

        if (cursor) {
          if (cursors.has(cursor)) {
            throw new Error(
              '다음 메모 목록을 확인할 수 없어요.',
            )
          }

          cursors.add(cursor)
        }
      } while (cursor)

      // 기존 화면의 최신 수정순 정렬을 유지합니다.
      const items = [...notes.values()].sort(
        (a, b) =>
          b.updatedAt.localeCompare(a.updatedAt) ||
          a.title.localeCompare(b.title, 'ko'),
      )

      return {
        notes: items,
        totalCount: totalCount ?? items.length,
      }
    },
  })

  return {
    notes: result.data?.notes ?? [],
    totalCount: result.data?.totalCount ?? 0,
    loading: result.isLoading,
    refreshing: result.isFetching,

    errorMessage: !validId
      ? '올바른 일정 ID가 아니에요.'
      : result.error
        ? getError(result.error)
        : '',

    reload: result.refetch,
  }
}