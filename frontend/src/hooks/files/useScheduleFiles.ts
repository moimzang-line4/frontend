import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteFile, listFiles, uploadFile } from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'
import { rememberFileDeletion } from './useFileDeletion'
import { filesChangeEvent, forgetFileBlob, loadFilePolicy, toScheduleFile, toServerCategory } from '../../utils/files/remote'
import { getApiErrorMessage, unwrap } from '../../utils/members/mapper'
import type { FileCategory, ScheduleFile } from '../../types/files/file'

const REQUEST = { timeout: 15000 }
const UPLOAD_REQUEST = { timeout: 120000 }
const PAGE_SIZE = 100
const MAX_PAGES = 50

// 문서함 전체는 'documents:…', 일정 자료는 일정 ID
const scheduleIdOf = (scopeId: string) => (/^\d+$/.test(scopeId) ? Number(scopeId) : undefined)

export const filesKey = (termId: number, scopeId: string) => ['files', termId, scopeId] as const

// 기수 문서함 / 일정 자료 목록 + 업로드·삭제
export default function useScheduleFiles(scopeId: string) {
  const { group } = useOnboarding()
  const termId = group?.termId
  const hasTerm = typeof termId === 'number' && Number.isSafeInteger(termId) && termId > 0
  const queryClient = useQueryClient()
  const key = filesKey(hasTerm ? termId : 0, scopeId)
  const scheduleId = scheduleIdOf(scopeId)

  const query = useQuery({
    queryKey: key,
    enabled: hasTerm,
    staleTime: 10_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const files: ScheduleFile[] = []
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const response = await listFiles(termId as number, { category: 'ALL', sort: 'LATEST', scheduleId, size: PAGE_SIZE, cursor }, { ...REQUEST, signal })
        const data = unwrap(response.data, '자료를 불러오지 못했어요.')
        // 장부 원본 파일(LEDGER_FILE)은 장부 탭에서 따로 보여줌
        files.push(...(data.files ?? []).map(item => toScheduleFile(item, scopeId)).filter((file): file is ScheduleFile => file !== null))
        if (!data.nextCursor) break
        cursor = data.nextCursor
      }
      return files
    },
  })

  // 삭제 되돌리기 등 다른 곳에서 바뀌면 다시 불러오기
  useEffect(() => {
    const refresh = () => { void queryClient.invalidateQueries({ queryKey: ['files'] }) }
    window.addEventListener(filesChangeEvent, refresh)
    return () => window.removeEventListener(filesChangeEvent, refresh)
  }, [queryClient])

  async function upload(selected: File[], category: FileCategory) {
    if (!hasTerm) throw new Error('선택한 기수 정보가 없어요.')
    if (!selected.length) throw new Error('첨부할 파일을 선택해주세요.')

    const policy = await loadFilePolicy().catch(() => null)
    for (const file of selected) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (policy?.extensions.length && !policy.extensions.includes(ext)) {
        throw new Error(`${ext ? `.${ext}` : '이 형식의'} 파일은 첨부할 수 없어요.`)
      }
      if (policy?.maxSize && file.size > policy.maxSize) {
        throw new Error(`파일 하나당 최대 ${Math.floor(policy.maxSize / 1024 / 1024)}MB까지 첨부할 수 있어요.`)
      }
    }

    try {
      for (const file of selected) {
        const response = await uploadFile(termId, { name: file.name, category: toServerCategory[category], scheduleId }, { file }, UPLOAD_REQUEST)
        unwrap(response.data, '업로드하지 못했어요.')
      }
    } catch (caught) {
      throw new Error(getApiErrorMessage(caught, '업로드하지 못했어요. 다시 시도해주세요.'))
    } finally {
      await queryClient.invalidateQueries({ queryKey: ['files'] })
    }
  }

  // 삭제 후 5초 동안 되돌리기 가능 (서버 소프트 삭제 → 복구)
  async function remove(file: ScheduleFile) {
    if (file.scheduleId !== scopeId) throw new Error('이 범위의 파일이 아니에요.')
    try {
      const response = await deleteFile(Number(file.id), REQUEST)
      if (response.data.success !== true) throw new Error(response.data.message || '파일을 삭제하지 못했어요.')
    } catch (caught) {
      throw new Error(getApiErrorMessage(caught, '파일을 삭제하지 못했어요.'))
    }
    forgetFileBlob(file.id)
    rememberFileDeletion(file)
    await queryClient.invalidateQueries({ queryKey: ['files'] })
  }

  return {
    files: query.data ?? [],
    loading: hasTerm && query.isLoading,
    error: !hasTerm ? '선택한 기수 정보가 없어요.' : query.error ? (query.error as Error).message : '',
    reload: async () => { await query.refetch() },
    upload,
    remove,
  }
}
