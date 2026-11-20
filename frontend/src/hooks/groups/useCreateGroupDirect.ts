import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useCreateGroup } from '../../api/generated'
import useDemoGroup from './useDemoGroup'

export default function useCreateGroupDirect() {
  const { createGroup } = useDemoGroup()
  const mutation = useCreateGroup({
    mutation: { retry: false },
    axios: { timeout: 15000 },
  })
  const busy = useRef(false)
  const created = useRef<{
    groupId: number
    termId: number
    name: string
    generation: string
  } | null>(null)
  const [pending, setPending] = useState(false)
  const [createdOnServer, setCreatedOnServer] = useState(false)
  const [error, setError] = useState('')

  async function save(name: string, generation: string) {
    if (busy.current || !name.trim() || !generation.trim()) return false
    busy.current = true
    setPending(true)
    setError('')
    try {
      if (!created.current) {
        const response = await mutation.mutateAsync({
          data: { name: name.trim(), termName: generation.trim() },
        })
        const body = response.data
        if (body.success !== true)
          throw new Error(body.message || '그룹을 생성하지 못했어요.')
        const groupId = body.data?.groupId
        const termId = body.data?.termId
        if (
          typeof groupId !== 'number' ||
          !Number.isSafeInteger(groupId) ||
          groupId <= 0 ||
          typeof termId !== 'number' ||
          !Number.isSafeInteger(termId) ||
          termId <= 0
        ) {
          throw new Error('서버의 그룹 정보를 확인할 수 없어요.')
        }
        created.current = {
          groupId,
          termId,
          name: name.trim(),
          generation: generation.trim(),
        }
        setCreatedOnServer(true)
      }
      createGroup({ ...created.current, id: String(created.current.groupId) })
      return true
    } catch (caught) {
      setError(
        isAxiosError<{ message?: string }>(caught)
          ? caught.response?.data.message ||
              '그룹을 생성하지 못했어요. 네트워크 상태를 확인해주세요.'
          : caught instanceof Error
            ? caught.message
            : '그룹을 생성하지 못했어요.',
      )
      return false
    } finally {
      busy.current = false
      setPending(false)
    }
  }
  return { save, pending, error, createdOnServer }
}
