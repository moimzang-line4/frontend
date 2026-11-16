import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import {
  createNote,
  getListNotesQueryKey,
} from '../../api/generated'

import type { NoteCreateRequestType } from '../../api/models/noteCreateRequestType'

import type {
  NoteType,
  OperationNoteInput,
} from '../../types/notes/operationNote'

const apiTypes: Record<NoteType, NoteCreateRequestType> = {
  general: 'GENERAL',
  todo: 'TODO',
  decision: 'DECISION',
  idea: 'IDEA',
}

export default function useCreateServerNote(scheduleId: string) {
  const queryClient = useQueryClient()
  const busy = useRef(false)
  const [pending, setPending] = useState(false)

  async function save(input: OperationNoteInput) {
    if (busy.current) {
      throw new Error('메모를 저장하고 있어요.')
    }

    const id = Number(scheduleId)

    if (
      !/^\d+$/.test(scheduleId) ||
      !Number.isSafeInteger(id) ||
      id <= 0
    ) {
      throw new Error('올바른 일정 ID가 아니에요.')
    }

    const title = input.title.trim()
    const content = input.content.trim()
    const assignee = input.assignee.trim()

    if (!title || title.length > 100) {
      throw new Error('제목을 1~100자로 입력해주세요.')
    }

    if (!content || content.length > 100) {
      throw new Error('내용을 1~100자로 입력해주세요.')
    }

    if (assignee.length > 50) {
      throw new Error('담당자는 50자 이하로 입력해주세요.')
    }

    busy.current = true
    setPending(true)

    try {
      const response = await createNote(
        id,
        {
          type: apiTypes[input.type],
          title,
          content,
          ...(assignee ? { assignee } : {}),
        },
        {
          timeout: 15000,
        },
      )

      const body = response.data
      const noteId = body.data?.noteId

      if (
        body.success !== true ||
        typeof noteId !== 'number' ||
        !Number.isSafeInteger(noteId) ||
        noteId <= 0
      ) {
        throw new Error(
          body.message || '메모를 등록하지 못했어요.',
        )
      }

      await queryClient.invalidateQueries({
        queryKey: getListNotesQueryKey(id),
      })

      return noteId
    } catch (caught) {
      if (isAxiosError<{ message?: unknown }>(caught)) {
        const message = caught.response?.data?.message

        throw new Error(
          typeof message === 'string' && message.trim()
            ? message
            : caught.response
              ? '메모를 등록하지 못했어요.'
              : '서버에 연결하지 못했어요.',
        )
      }

      throw caught instanceof Error
        ? caught
        : new Error('메모를 등록하지 못했어요.')
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return { save, pending }
}