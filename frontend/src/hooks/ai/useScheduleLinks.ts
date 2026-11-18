import { useQuery } from '@tanstack/react-query'
import { listSchedules } from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'

export type ScheduleLink = { id: number; title: string }

const MAX_PAGES = 20

const ymd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// AI 답변에 나온 일정 이름을 이동 버튼으로 바꾸기 위한 기수 일정 목록 (앞뒤 1년)
export default function useScheduleLinks() {
  const { group } = useOnboarding()
  const termId = group?.termId
  const hasTerm = typeof termId === 'number' && Number.isSafeInteger(termId) && termId > 0

  const query = useQuery({
    queryKey: ['ai-schedule-links', termId],
    enabled: hasTerm,
    staleTime: 60_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const now = new Date()
      const from = ymd(new Date(now.getFullYear() - 1, now.getMonth(), 1))
      const to = ymd(new Date(now.getFullYear() + 1, now.getMonth() + 1, 0))
      const links: ScheduleLink[] = []
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const response = await listSchedules(termId as number, { from, to, size: 100, cursor }, { signal, timeout: 15000 })
        const data = response.data.data
        if (response.data.success !== true || !data) break
        for (const item of data.schedules ?? []) {
          if (typeof item.scheduleId === 'number' && item.title?.trim()) links.push({ id: item.scheduleId, title: item.title.trim() })
        }
        if (!data.nextCursor) break
        cursor = data.nextCursor
      }
      return links
    },
  })

  return query.data ?? []
}
