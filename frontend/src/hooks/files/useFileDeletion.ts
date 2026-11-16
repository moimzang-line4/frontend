import { create } from 'zustand'
import type { ScheduleFile } from '../../types/files/file'
import { restoreFile } from '../../api/generated'
import { notifyFilesChanged } from '../../utils/files/remote'
import { getApiErrorMessage } from '../../utils/members/mapper'

type DeletionState = {
  file: ScheduleFile | null
  token: string
  expiresAt: number
  restoring: boolean
  error: string
}

export const useFileDeletion = create<DeletionState>(() => ({
  file: null,
  token: '',
  expiresAt: 0,
  restoring: false,
  error: '',
}))

let timer: ReturnType<typeof setTimeout> | undefined

export function clearFileDeletion(token: string) {
  if (useFileDeletion.getState().token !== token) return
  clearTimeout(timer)
  useFileDeletion.setState({
    file: null,
    token: '',
    expiresAt: 0,
    restoring: false,
    error: '',
  })
}

export function rememberFileDeletion(file: ScheduleFile) {
  clearTimeout(timer)
  const token = crypto.randomUUID()
  useFileDeletion.setState({
    file,
    token,
    expiresAt: Date.now() + 5000,
    restoring: false,
    error: '',
  })
  timer = setTimeout(() => clearFileDeletion(token), 5000)
}

export async function undoFileDeletion(token: string) {
  const state = useFileDeletion.getState()
  if (state.token !== token || !state.file || state.restoring) return
  if (Date.now() >= state.expiresAt) {
    clearFileDeletion(token)
    return
  }
  useFileDeletion.setState({ restoring: true, error: '' })

  try {
    const response = await restoreFile(Number(state.file.id), { timeout: 15000 })
    if (response.data.success !== true) throw new Error(response.data.message || '파일을 복구하지 못했어요.')
    clearFileDeletion(token)
    notifyFilesChanged()
  } catch (cause) {
    if (useFileDeletion.getState().token !== token) return
    useFileDeletion.setState({
      restoring: false,
      error: getApiErrorMessage(cause, '파일을 복구하지 못했어요.'),
    })
  }
}
