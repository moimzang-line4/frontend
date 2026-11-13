import { useCallback, useEffect, useRef, useState } from 'react'
import { deleteFile, readFiles, saveFiles } from '../../utils/files/storage'
import type { FileCategory, ScheduleFile } from '../../types/files/file'

export default function useScheduleFiles(scheduleId: string) {
  const [files, setFiles] = useState<ScheduleFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const revision = useRef({ value: 0 })
  const reload = useCallback(async () => {
    const version = ++revision.current.value
    try {
      const next = await readFiles(scheduleId)
      if (version === revision.current.value) { setFiles(next); setError('') }
    } catch (cause) {
      if (version === revision.current.value) setError(cause instanceof Error ? cause.message : '자료를 불러오지 못했어요.')
    } finally { if (version === revision.current.value) setLoading(false) }
  }, [scheduleId])
  useEffect(() => {
    const token = revision.current
    void Promise.resolve().then(reload)
    const refresh = () => { void reload() }
    window.addEventListener('focus', refresh)
    return () => { token.value++; window.removeEventListener('focus', refresh) }
  }, [reload])
  async function upload(selected: File[], category: FileCategory) {
    if (!selected.length) throw new Error('첨부할 파일을 선택해주세요.')
    if (selected.some(file => file.size > 50 * 1024 * 1024)) throw new Error('파일 하나당 최대 50MB까지 첨부할 수 있어요.')
    if ([...files.map(file => file.blob), ...selected].reduce((sum, file) => sum + file.size, 0) > 200 * 1024 * 1024) throw new Error('일정 하나당 최대 200MB까지 첨부할 수 있어요.')
    await saveFiles(selected.map(file => ({ id: crypto.randomUUID(), scheduleId, name: file.name, category, createdAt: Date.now(), blob: file })))
    await reload()
  }
  async function remove(file: ScheduleFile) {
    if (file.scheduleId !== scheduleId) throw new Error('이 일정의 파일이 아니에요.')
    await deleteFile(file.id)
    await reload()
  }
  return { files, loading, error, reload, upload, remove }
}
