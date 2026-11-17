import { useSyncExternalStore } from 'react'
import { useGetMeetingDetail } from '../../api/generated'
import {
  hasServerProgress,
  hasStartedLocally,
  subscribeMeetingStarted,
} from '../../utils/meetings/started'

export default function useMeetingStarted(id: number, knownEvidence?: boolean) {
  const local = useSyncExternalStore(subscribeMeetingStarted, () =>
    hasStartedLocally(id),
  )
  const query = useGetMeetingDetail(id, {
    query: {
      enabled:
        Number.isSafeInteger(id) && id > 0 && knownEvidence === undefined,
      staleTime: 30_000,
      retry: false,
    },
    axios: { timeout: 15000 },
  })
  const body = query.data?.data
  const meeting =
    body?.success === true && body.data?.meetingId === id
      ? body.data
      : undefined
  const server = meeting?.agendas && hasServerProgress(meeting.agendas)
  return {
    started: local || knownEvidence === true || server === true,
    known: local || knownEvidence !== undefined || !!meeting,
  }
}
