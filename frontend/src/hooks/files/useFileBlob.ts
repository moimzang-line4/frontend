import { useEffect, useState } from 'react'
import { fetchFileBlob } from '../../utils/files/remote'
import type { ScheduleFile } from '../../types/files/file'

// 서버에서 파일 내용을 받아오기 (enabled가 false면 받지 않음)
export default function useFileBlob(file: ScheduleFile | undefined, enabled = true) {
  const [state, setState] = useState<{ id?: string; blob?: Blob; error?: string }>({})

  useEffect(() => {
    if (!file || !enabled) return
    let active = true
    fetchFileBlob(file)
      .then(blob => { if (active) setState({ id: file.id, blob }) })
      .catch(cause => {
        if (active) setState({ id: file.id, error: cause instanceof Error ? cause.message : '파일을 불러오지 못했어요.' })
      })
    return () => { active = false }
  }, [file, enabled])

  const current = file && state.id === file.id ? state : {}
  return {
    blob: current.blob,
    error: current.error ?? '',
    loading: Boolean(file && enabled && !current.blob && !current.error),
  }
}
