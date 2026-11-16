import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMemberList,
  deleteMemberList,
  getMemberList,
  listMemberLists,
  updateMemberList,
} from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'
import { toCollectRequest, toCreateRequest, toDeadlineRequest, toMemberGroup, unwrap } from '../../utils/members/mapper'
import type { CreateMemberGroup, MemberGroup } from '../../types/members/member'

const REQUEST = { timeout: 15000 }

export const memberListsKey = (termId: number) => ['member-lists', termId] as const
export const memberListKey = (memberListId: number) => ['member-list', memberListId] as const

function useTermId() {
  const { group } = useOnboarding()
  const termId = group?.termId
  return typeof termId === 'number' && Number.isSafeInteger(termId) && termId > 0 ? termId : null
}

// 명단방 목록 + 생성
export function useMemberLists() {
  const termId = useTermId()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: memberListsKey(termId ?? 0),
    enabled: termId !== null,
    staleTime: 30_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const response = await listMemberLists(termId as number, { ...REQUEST, signal })
      const data = unwrap(response.data, '명단방을 불러오지 못했어요.')
      return (data.memberLists ?? []).map(toMemberGroup)
    },
  })

  const createGroup = async (form: CreateMemberGroup): Promise<MemberGroup['id']> => {
    if (termId === null) throw new Error('선택한 기수 정보가 없어요.')
    const response = await createMemberList(termId, toCreateRequest(form), REQUEST)
    const data = unwrap(response.data, '명단방을 만들지 못했어요.')
    if (typeof data.memberListId !== 'number') throw new Error('명단방을 만들지 못했어요.')
    await queryClient.invalidateQueries({ queryKey: memberListsKey(termId) })
    return data.memberListId
  }

  return {
    groups: query.data ?? [],
    loading: query.isLoading,
    error: termId === null ? '선택한 기수 정보가 없어요.' : query.error ? (query.error as Error).message : '',
    reload: query.refetch,
    createGroup,
  }
}

// 명단방 상세(링크·수집 항목 포함) + 수정·삭제
export function useMemberList(memberListId: number) {
  const termId = useTermId()
  const queryClient = useQueryClient()
  const valid = Number.isSafeInteger(memberListId) && memberListId > 0

  const query = useQuery({
    queryKey: memberListKey(memberListId),
    enabled: valid,
    staleTime: 10_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const response = await getMemberList(memberListId, { ...REQUEST, signal })
      return toMemberGroup(unwrap(response.data, '명단방을 불러오지 못했어요.'))
    },
  })

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: memberListKey(memberListId) }),
      termId !== null ? queryClient.invalidateQueries({ queryKey: memberListsKey(termId) }) : undefined,
    ])
  }

  const updateGroup = async (form: CreateMemberGroup) => {
    const response = await updateMemberList(memberListId, {
      name: form.name,
      registerDeadline: toDeadlineRequest(form.deadline),
      ...toCollectRequest(form.fields),
    }, REQUEST)
    if (response.data.success !== true) throw new Error(response.data.message || '명단방을 저장하지 못했어요.')
    await refresh()
  }

  const deleteGroup = async () => {
    const response = await deleteMemberList(memberListId, REQUEST)
    if (response.data.success !== true) throw new Error(response.data.message || '명단방을 삭제하지 못했어요.')
    queryClient.removeQueries({ queryKey: memberListKey(memberListId) })
    queryClient.removeQueries({ queryKey: ['members', memberListId] })
    if (termId !== null) await queryClient.invalidateQueries({ queryKey: memberListsKey(termId) })
  }

  return {
    group: query.data,
    loading: query.isLoading,
    error: !valid ? '존재하지 않는 명단방이에요.' : query.error ? (query.error as Error).message : '',
    reload: query.refetch,
    refresh,
    updateGroup,
    deleteGroup,
  }
}
