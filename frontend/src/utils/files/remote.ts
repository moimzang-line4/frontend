import { getDownloadUrl, getPolicy } from '../../api/generated'
import type { FileSummaryResponse } from '../../api/models/fileSummaryResponse'
import type { UploadFileCategory } from '../../api/models/uploadFileCategory'
import type { FileCategory, ScheduleFile } from '../../types/files/file'
import { unwrap } from '../members/mapper'

const API_ORIGIN = 'https://api.chungs.store'
const REQUEST = { timeout: 15000 }

// 파일 목록이 바뀌었을 때(삭제 되돌리기 등) 목록을 다시 불러오라는 신호
export const filesChangeEvent = 'moimzang:files-changed'
export const notifyFilesChanged = () => window.dispatchEvent(new Event(filesChangeEvent))

// 화면 분류 ↔ 서버 분류
export const toServerCategory: Record<FileCategory, UploadFileCategory> = {
  '활동 문서': 'ACTIVITY_DOC',
  '예산·회계': 'BUDGET_PLAN',
  활동사진: 'PHOTO',
}
const fromServerCategory: Record<string, FileCategory> = {
  ACTIVITY_DOC: '활동 문서',
  BUDGET_PLAN: '예산·회계',
  PHOTO: '활동사진',
}

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', mp3: 'audio/mpeg', txt: 'text/plain',
  csv: 'text/csv', json: 'application/json',
}

// 서버 파일 정보 → 화면 파일 (scopeId: 이 목록을 보는 범위. 삭제 알림을 범위별로 구분)
export function toScheduleFile(item: FileSummaryResponse, scopeId: string): ScheduleFile | null {
  if (typeof item.fileId !== 'number' || !item.name) return null
  const category = fromServerCategory[item.category ?? '']
  if (!category) return null
  const ext = (item.extension || item.name.split('.').pop() || '').replace(/^\./, '').toLowerCase()
  const name = item.name.toLowerCase().endsWith(`.${ext}`) || !ext ? item.name : `${item.name}.${ext}`
  const created = item.createdAt ? Date.parse(item.createdAt) : NaN
  return {
    id: String(item.fileId),
    scheduleId: scopeId,
    name,
    category,
    createdAt: Number.isNaN(created) ? 0 : created,
    size: item.size ?? 0,
    mimeType: MIME_BY_EXT[ext] ?? '',
  }
}

const absolute = (url: string) => new URL(url, API_ORIGIN).toString()

async function requestUrl(file: Pick<ScheduleFile, 'id'>, mode: 'PREVIEW' | 'DOWNLOAD') {
  const response = await getDownloadUrl(Number(file.id), { mode }, REQUEST)
  const data = unwrap(response.data, '파일 주소를 받지 못했어요.')
  if (!data.url) throw new Error('파일 주소를 받지 못했어요.')
  return absolute(data.url)
}

// 미리보기·썸네일·ZIP용 파일 내용 (한 번 받은 파일은 다시 받지 않음)
const blobCache = new Map<string, Promise<Blob>>()

export function fetchFileBlob(file: Pick<ScheduleFile, 'id' | 'mimeType'>) {
  const cached = blobCache.get(file.id)
  if (cached) return cached
  const request = (async () => {
    const response = await fetch(await requestUrl(file, 'PREVIEW'))
    if (!response.ok) throw new Error('파일을 불러오지 못했어요.')
    const blob = await response.blob()
    return blob.type || !file.mimeType ? blob : new Blob([blob], { type: file.mimeType })
  })()
  blobCache.set(file.id, request)
  request.catch(() => blobCache.delete(file.id))
  return request
}

export const forgetFileBlob = (id: string) => blobCache.delete(id)

// 서버가 내려주는 다운로드 주소로 바로 받기
export async function downloadRemoteFile(file: Pick<ScheduleFile, 'id' | 'name'>) {
  const anchor = document.createElement('a')
  anchor.href = await requestUrl(file, 'DOWNLOAD')
  anchor.download = file.name
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
}

// 업로드 정책(허용 확장자·최대 용량)
let policyRequest: Promise<{ extensions: string[]; maxSize: number }> | null = null

export function loadFilePolicy() {
  policyRequest ??= getPolicy(REQUEST)
    .then(response => {
      const data = unwrap(response.data, '업로드 정책을 불러오지 못했어요.')
      return {
        extensions: (data.allowedExtensions ?? []).map(ext => ext.replace(/^\./, '').toLowerCase()),
        maxSize: data.maxSizeBytes ?? 0,
      }
    })
    .catch(cause => {
      policyRequest = null
      throw cause
    })
  return policyRequest
}
