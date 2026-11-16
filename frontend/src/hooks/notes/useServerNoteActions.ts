import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import {
  deleteNote,
  getListNotesQueryKey,
  updateNote,
} from '../../api/generated'

import type { NoteUpdateRequest } from '../../api/models/noteUpdateRequest'
import type { NoteUpdateRequestType } from '../../api/models/noteUpdateRequestType'

import type {
  NoteType,
  OperationNote,
  OperationNoteInput,
} from '../../types/notes/operationNote'

const apiTypes: Record<NoteType, NoteUpdateRequestType> = {
  general: 'GENERAL',
  todo: 'TODO',
  decision: 'DECISION',
  idea: 'IDEA',
}

function readId(value: string) {
  const id = Number(value)

  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    throw new Error('올바른 ID가 아니에요.')
  }

  return id
}

function getError(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message

    return typeof message === 'string' && message.trim()
      ? message
      : caught.response
        ? '메모 요청을 처리하지 못했어요.'
        : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '메모 요청을 처리하지 못했어요.'
}

export default function useServerNoteActions(scheduleId: string) {
  const queryClient = useQueryClient()
  const busy = useRef(false)
  const [pending, setPending] = useState(false)

  async function execute(task: () => Promise<void>) {
    if (busy.current) {
      throw new Error('메모 요청을 처리하고 있어요.')
    }

    busy.current = true
    setPending(true)

    try {
      await task()
    } catch (caught) {
      throw new Error(getError(caught))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  async function refresh() {
    const id = readId(scheduleId)

    await queryClient.invalidateQueries({
      queryKey: getListNotesQueryKey(id),
      refetchType: 'none',
    })
  }

  async function update(
    note: OperationNote,
    input: OperationNoteInput,
  ) {
    await execute(async () => {
      readId(scheduleId)

      if (note.scheduleId !== scheduleId) {
        throw new Error('현재 일정의 메모가 아니에요.')
      }

      const noteId = readId(note.id)

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

      const data: NoteUpdateRequest = {}

      if (input.type !== note.type) {
        data.type = apiTypes[input.type]
      }

      if (title !== note.title) {
        data.title = title
      }

      if (content !== note.content) {
        data.content = content
      }

      if (assignee !== note.assignee) {
        data.assignee = assignee
      }

      if (Object.keys(data).length === 0) return

      const response = await updateNote(
        noteId,
        data,
        { timeout: 15000 },
      )

      if (
        response.data.success !== true ||
        response.data.data?.noteId !== noteId
      ) {
        throw new Error(
          response.data.message || '메모를 수정하지 못했어요.',
        )
      }

      await refresh()
    })
  }

  async function remove(noteId: string) {
    await execute(async () => {
      readId(scheduleId)

      const response = await deleteNote(
        readId(noteId),
        { timeout: 15000 },
      )

      if (response.data.success !== true) {
        throw new Error(
          response.data.message || '메모를 삭제하지 못했어요.',
        )
      }

      await refresh()
    })
  }

  return {
    update,
    remove,
    pending,
  }
}