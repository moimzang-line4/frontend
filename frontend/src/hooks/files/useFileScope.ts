import { useState } from 'react'
import { useParams } from 'react-router'
import useDemoGroup from '../groups/useDemoGroup'
import useScheduleDetail from '../schedules/useScheduleDetail'

export default function useFileScope() {
  const { scheduleId } = useParams()
  const { schedule } = useScheduleDetail()
  const { group } = useDemoGroup()
  const [currentYear] = useState(() => String(new Date().getFullYear()))
  const year = group.name.match(/20\d{2}/)?.[0] ?? currentYear
  const generationLabel = `${group.generation} (${year})`

  if (scheduleId) {
    return {
      valid: !!schedule && schedule.operationMenuCount !== undefined,
      id: scheduleId,
      title: schedule?.title ?? '',
      listPath: `/schedules/${encodeURIComponent(scheduleId)}/operations/files`,
      documentView: false,
      generationLabel,
    }
  }

  return {
    valid: true,
    id: `documents:${group.id}:${group.generation}`,
    title: `${generationLabel} 자료실`,
    listPath: '/files',
    documentView: true,
    generationLabel,
  }
}
