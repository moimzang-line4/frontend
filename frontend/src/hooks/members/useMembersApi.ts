import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addMember as addMemberRequest,
  deleteMember as deleteMemberRequest,
  listMembers,
  updateMember as updateMemberRequest,
} from '../../api/generated'
import { toMemberInfo, toMemberRequest, unwrap } from '../../utils/members/mapper'
import { memberListKey } from './useMemberListsApi'
import type { MemberFormValues, MemberInfo } from '../../types/members/memberInfo'

const REQUEST = { timeout: 15000 }
const PAGE_SIZE = 100
const MAX_PAGES = 50

export const membersKey = (memberListId: number) => ['members', memberListId] as const

// 명단방의 부원 전체 (100명씩 끝까지 불러오기) + 추가·수정·삭제
export default function useMembersApi(memberListId: number) {
  const queryClient = useQueryClient()
  const valid = Number.isSafeInteger(memberListId) && memberListId > 0

  const query = useQuery({
    queryKey: membersKey(memberListId),
    enabled: valid,
    staleTime: 10_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const members: MemberInfo[] = []
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const response = await listMembers(memberListId, { size: PAGE_SIZE, cursor }, { ...REQUEST, signal })
        const data = unwrap(response.data, '부원 명단을 불러오지 못했어요.')
        members.push(...(data.members ?? []).map(item => toMemberInfo(item, memberListId)))
        if (!data.nextCursor) break
        cursor = data.nextCursor
      }
      return members
    },
  })

  // 부원 수가 바뀌면 명단방 정보(등록 인원)도 새로
  const refresh = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: membersKey(memberListId) }),
    queryClient.invalidateQueries({ queryKey: memberListKey(memberListId) }),
    queryClient.invalidateQueries({ queryKey: ['member-lists'] }),
  ])

  const addMember = async (data: MemberFormValues) => {
    const response = await addMemberRequest(memberListId, toMemberRequest(data), REQUEST)
    unwrap(response.data, '부원을 추가하지 못했어요.')
    await refresh()
  }

  const editMember = async (memberId: number, data: MemberFormValues) => {
    const response = await updateMemberRequest(memberId, toMemberRequest(data), REQUEST)
    if (response.data.success !== true) throw new Error(response.data.message || '부원 정보를 저장하지 못했어요.')
    await refresh()
  }

  const deleteMember = async (memberId: number) => {
    const response = await deleteMemberRequest(memberId, REQUEST)
    if (response.data.success !== true) throw new Error(response.data.message || '부원을 삭제하지 못했어요.')
    await refresh()
  }

  return {
    members: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : '',
    reload: query.refetch,
    getMember: (memberId: number) => query.data?.find(member => member.id === memberId),
    addMember,
    editMember,
    deleteMember,
  }
}
