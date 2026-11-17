import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import {
  addOnSiteAttendee,
  checkInAttendee,
  getRoundAttendees,
  listRounds,
  removeAttendee,
} from '../../api/generated'
import { unwrap } from '../../utils/members/mapper'
import type { RoundAttendeeResponse } from '../../api/models/roundAttendeeResponse'
import type { NewParticipant, Participant } from '../../types/attendance/attendance'

const REQUEST = { timeout: 15000 }
const API_ORIGIN = 'https://api.chungs.store'

// TODO: Swagger에 반영되면 Orval 재생성 후 generated의 함수로 교체
// POST /api/rounds/{roundId}/attendees/import — 명단방 부원을 이 차수에 미출석으로 추가
type ImportAttendeesResponse = { success?: boolean; message?: string; data?: { addedCount?: number; skippedCount?: number } }
const importAttendees = (roundId: number, memberListId: number) =>
  axios.post<ImportAttendeesResponse>(`${API_ORIGIN}/api/rounds/${roundId}/attendees/import`, { memberListId }, REQUEST)
const PAGE_SIZE = 100
const MAX_PAGES = 50

export type AttendanceRound = { id: number; label: string }

export const roundsKey = (scheduleId: number) => ['schedule-rounds', scheduleId] as const
export const attendeesKey = (roundId: number) => ['round-attendees', roundId] as const

const isValidId = (id: number) => Number.isSafeInteger(id) && id > 0

function toParticipant(item: RoundAttendeeResponse): Participant {
  if (typeof item.attendeeId !== 'number') throw new Error('참가자 정보를 확인할 수 없어요.')
  const checkedAt = item.checkedInAt ? Date.parse(item.checkedInAt) : NaN
  return {
    id: String(item.attendeeId),
    name: item.name ?? '',
    department: item.affiliation ?? '',
    phone: '',
    extra: item.phoneLast4 || undefined,
    attendedAt: item.isCheckedIn ? (Number.isNaN(checkedAt) ? Date.now() : checkedAt) : null,
    onsite: false,
  }
}

// 일정의 차수 목록 (출석은 차수 단위)
export function useAttendanceRounds(scheduleId: number) {
  const query = useQuery({
    queryKey: roundsKey(scheduleId),
    enabled: isValidId(scheduleId),
    staleTime: 30_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const response = await listRounds(scheduleId, { ...REQUEST, signal })
      const data = unwrap(response.data, '차수 정보를 불러오지 못했어요.')
      return (data.rounds ?? [])
        .filter(round => typeof round.roundId === 'number')
        .map(round => ({ id: round.roundId as number, label: round.label || `${round.roundNo ?? ''}차` }))
    },
  })

  return {
    rounds: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : '',
    reload: query.refetch,
  }
}

// 차수 참가자 전체(100명씩 끝까지) + 출석 처리·제외·현장 추가
export default function useAttendanceApi(roundId: number) {
  const queryClient = useQueryClient()
  const key = attendeesKey(roundId)

  const query = useQuery({
    queryKey: key,
    enabled: isValidId(roundId),
    staleTime: 5_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const participants: Participant[] = []
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const response = await getRoundAttendees(roundId, { status: 'ALL', size: PAGE_SIZE, cursor }, { ...REQUEST, signal })
        const data = unwrap(response.data, '출석 명단을 불러오지 못했어요.')
        participants.push(...(data.attendees ?? []).map(toParticipant))
        if (!data.nextCursor) break
        cursor = data.nextCursor
      }
      return participants
    },
  })

  const participants = query.data ?? []

  const patch = (updater: (prev: Participant[]) => Participant[]) =>
    queryClient.setQueryData<Participant[]>(key, prev => updater(prev ?? []))

  // 화면을 먼저 바꾸고, 실패하면 서버 값으로 되돌림
  const setAttended = async (id: string, attended: boolean) => {
    patch(prev => prev.map(item => (item.id === id ? { ...item, attendedAt: attended ? Date.now() : null } : item)))
    try {
      const response = await checkInAttendee(roundId, Number(id), { isCheckedIn: attended }, REQUEST)
      unwrap(response.data, '출석 상태를 바꾸지 못했어요.')
    } catch (caught) {
      await queryClient.invalidateQueries({ queryKey: key })
      throw caught
    }
  }

  const removeParticipant = async (id: string) => {
    const response = await removeAttendee(roundId, Number(id), REQUEST)
    if (response.data.success !== true) throw new Error(response.data.message || '참가자를 제외하지 못했어요.')
    patch(prev => prev.filter(item => item.id !== id))
  }

  // 같은 이름이 있으면 'duplicate' (allowSameName으로 다시 요청해야 추가됨)
  const addParticipant = async (input: NewParticipant, allowSameName = false): Promise<'added' | 'duplicate'> => {
    try {
      const response = await addOnSiteAttendee(roundId, {
        name: input.name,
        affiliation: input.department,
        phoneLast4: input.extra,
        allowSameName,
      }, REQUEST)
      const data = unwrap(response.data, '인원을 추가하지 못했어요.')
      const added = toParticipant({ ...data, checkedInAt: undefined })
      // 방금 추가한 인원이 맨 위에 보이도록
      patch(prev => [added, ...prev.filter(item => item.id !== added.id)])
      return 'added'
    } catch (caught) {
      if (!allowSameName && isAxiosError(caught) && caught.response?.status === 409) return 'duplicate'
      throw caught
    }
  }

  // 명단방에서 불러오기: 이미 있는 부원은 서버가 건너뜀
  const importFromMemberList = async (memberListId: number) => {
    try {
      const response = await importAttendees(roundId, memberListId)
      const data = unwrap(response.data, '명단을 불러오지 못했어요.')
      return { added: data.addedCount ?? 0, skipped: data.skippedCount ?? 0 }
    } finally {
      await queryClient.invalidateQueries({ queryKey: key })
    }
  }

  return {
    participants,
    attendedCount: participants.filter(item => item.attendedAt !== null).length,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : '',
    reload: query.refetch,
    setAttended,
    removeParticipant,
    addParticipant,
    importFromMemberList,
  }
}
