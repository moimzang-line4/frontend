import { isAxiosError } from 'axios'
import type { getMeetingDetail } from '../../api/generated'

export function meetingError(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message

    if (typeof message === 'string' && message.trim()) return message
    if (caught.response?.status === 404)
      return '삭제되었거나 존재하지 않는 회의록이에요.'
    return caught.response
      ? '요청을 처리하지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error ? caught.message : '요청을 처리하지 못했어요.'
}

export function readServerMeeting(
  response: Awaited<ReturnType<typeof getMeetingDetail>>,
) {
  const body = response.data
  const data = body.data

  if (
    body.success !== true ||
    !data ||
    typeof data.meetingId !== 'number' ||
    !Number.isSafeInteger(data.meetingId) ||
    data.meetingId <= 0 ||
    typeof data.title !== 'string' ||
    typeof data.meetingDate !== 'string' ||
    !Array.isArray(data.agendas) ||
    data.agendas.length === 0 ||
    (data.status !== 'IN_PROGRESS' && data.status !== 'COMPLETED')
  ) {
    throw new Error(body.message || '회의 정보를 확인할 수 없어요.')
  }

  const agendas = data.agendas
    .map(item => {
      if (
        typeof item.agendaId !== 'number' ||
        !Number.isSafeInteger(item.agendaId) ||
        item.agendaId <= 0 ||
        typeof item.content !== 'string' ||
        (item.status !== 'PENDING' &&
          item.status !== 'IN_PROGRESS' &&
          item.status !== 'COMPLETED')
      ) {
        throw new Error('안건 정보를 확인할 수 없어요.')
      }
      return {
        ...item,
        agendaId: item.agendaId,
        content: item.content,
        status: item.status,
      }
    })
    .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))

  return {
    ...data,
    meetingId: data.meetingId,
    title: data.title,
    meetingDate: data.meetingDate,
    status: data.status,
    agendas,
  }
}

export type ServerMeeting = ReturnType<typeof readServerMeeting>
