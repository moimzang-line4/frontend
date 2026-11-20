import { useRef, useState } from 'react'
import axios, { isAxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { getGroup } from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'
import type { DemoGroup } from '../../types/groups/demoGroup'

type Summary = {
  groupId: number
  name: string
  currentTermId?: number | null
  currentTermName?: string | null
}
const validId = (id: unknown): id is number =>
  typeof id === 'number' && Number.isSafeInteger(id) && id > 0
function message(caught: unknown) {
  if (isAxiosError<{ message?: string }>(caught))
    return (
      caught.response?.data.message ||
      '동아리를 불러오지 못했어요. 다시 시도해주세요.'
    )
  return caught instanceof Error
    ? caught.message
    : '동아리를 불러오지 못했어요.'
}

export default function useGroupSwitcher() {
  const onboarding = useOnboarding()
  const groups = onboarding.groups ?? []
  const ids = [
    ...new Set(
      [...groups.map(group => group.groupId), onboarding.group?.groupId].filter(
        validId,
      ),
    ),
  ]
  const busy = useRef(false)
  const [pending, setPending] = useState(false)
  const [saveError, setSaveError] = useState('')
  const query = useQuery({
    queryKey: ['known-groups', ids],
    enabled: ids.length > 0,
    staleTime: 30_000,
    retry: false,
    queryFn: async ({ signal }) => {
      const summaries: Summary[] = []
      // The server accepts at most 50 saved IDs per request, not an unscoped group directory.
      for (let offset = 0; offset < ids.length; offset += 50) {
        const requested = ids.slice(offset, offset + 50)
        const response = await axios.get<{
          success?: boolean
          message?: string
          data?: { groups?: Summary[] }
        }>('https://api.chungs.store/api/groups', {
          params: { ids: requested.join(',') },
          signal,
          timeout: 15000,
        })
        const body = response.data
        if (body.success !== true || !Array.isArray(body.data?.groups))
          throw new Error(body.message || '동아리 목록을 확인할 수 없어요.')
        for (const item of body.data.groups) {
          if (
            !validId(item.groupId) ||
            !requested.includes(item.groupId) ||
            typeof item.name !== 'string' ||
            !item.name.trim()
          ) {
            throw new Error('동아리 목록 정보를 확인할 수 없어요.')
          }
          summaries.push(item)
        }
      }
      return summaries
    },
  })

  async function select(groupId: number) {
    if (busy.current || groupId === onboarding.group?.groupId) return
    const summary = query.data?.find(item => item.groupId === groupId)
    if (!summary) return
    busy.current = true
    setPending(true)
    setSaveError('')
    try {
      const response = await getGroup(groupId, { timeout: 15000 })
      const body = response.data
      const detail = body.data
      if (
        body.success !== true ||
        detail?.groupId !== groupId ||
        typeof detail.name !== 'string' ||
        !detail.name.trim() ||
        !Array.isArray(detail.terms)
      ) {
        throw new Error(
          body.message || '선택한 동아리 정보를 확인할 수 없어요.',
        )
      }
      const terms = detail.terms.flatMap(item =>
        validId(item.termId) &&
        typeof item.name === 'string' &&
        item.name.trim()
          ? [{ termId: item.termId, name: item.name }]
          : [],
      )
      const saved = groups.find(item => item.groupId === groupId)
      const term =
        terms.find(item => item.termId === saved?.termId) ??
        terms.find(item => item.termId === summary.currentTermId) ??
        terms.at(-1)
      if (!term) throw new Error('선택한 동아리에 조회할 기수가 없어요.')
      const next: DemoGroup = {
        id: String(groupId),
        groupId,
        termId: term.termId,
        name: detail.name,
        shortName: detail.name,
        generation: term.name,
        description: saved?.description ?? '',
        ownerId: saved?.ownerId ?? 'me',
        members: saved?.members ?? [
          { id: 'me', name: '나', profile: '모임장' },
        ],
      }
      onboarding.update({ completed: true, group: next })
      return true
    } catch (caught) {
      setSaveError(message(caught))
      return false
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return {
    groups: query.data ?? [],
    pending,
    loading: query.isLoading,
    error: saveError || (query.error ? message(query.error) : ''),
    reload: query.refetch,
    refreshing: query.isFetching,
    select,
  }
}
