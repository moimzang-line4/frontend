import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import MainLayout from '../../layouts/MainLayout'
import MemberListPage from './MemberListPage'
import MemberCreatePage from './MemberCreatePage'
import MemberLinkPage from './MemberLinkPage'
import MemberDetailPage from './MemberDetailPage'
import MemberAddPage from './MemberAddPage'
import MemberEditPage from './MemberEditPage'

import { useMemberList, useMemberLists } from '../../hooks/members/useMemberListsApi'
import useMembersApi from '../../hooks/members/useMembersApi'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage, toOperatorFields } from '../../utils/members/mapper'
import type { MemberGroup } from '../../types/members/member'

// 불러오는 중 / 실패 안내 (다시 시도 버튼 포함)
function Status({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <StatusBox role={onRetry ? 'alert' : 'status'}>
      <p>{message}</p>
      {onRetry && <button type="button" onClick={onRetry}>다시 불러오기</button>}
    </StatusBox>
  )
}

// 부원 명단 목록
export function MemberListRoute() {
  const navigate = useNavigate()
  const { groups, loading, error, reload } = useMemberLists()

  if (loading) return <Status message="명단방을 불러오는 중이에요." />
  if (error) return <Status message={error} onRetry={() => void reload()} />

  return (
    <MemberListPage
      groups={groups}
      onCreate={() => navigate('/members/new')}
      onSelect={id => navigate(`/members/${id}`)}
    />
  )
}

// 새 명단방 생성
export function MemberCreateRoute() {
  const navigate = useNavigate()
  const { createGroup } = useMemberLists()

  return (
    <MemberCreatePage
      onSubmit={async data => {
        try {
          const id = await createGroup(data)
          navigate(`/members/${id}/link`, { replace: true })
        } catch (caught) {
          showAlert(getApiErrorMessage(caught, '명단방을 만들지 못했어요.'))
        }
      }}
    />
  )
}

type GroupApi = ReturnType<typeof useMemberList>

// 명단방(:id) 하위 화면 공통: URL id로 명단방 상세를 불러와 넘겨줌
function MemberGroupRoute({
  title,
  showFooter = true,
  children,
}: {
  title?: string
  showFooter?: boolean
  children: (group: MemberGroup, api: GroupApi) => ReactNode
}) {
  const { id } = useParams<{ id: string }>()
  const api = useMemberList(Number(id))
  const { group, loading, error, reload } = api

  if (loading || !group) {
    return (
      <MainLayout title={title ?? '부원 명단'} showBack showFooter={showFooter}>
        {loading
          ? <Status message="명단방을 불러오는 중이에요." />
          : <Status message={error || '삭제되었거나 존재하지 않는 명단방이에요.'} onRetry={() => void reload()} />}
      </MainLayout>
    )
  }

  return (
    <MainLayout title={title ?? group.name} showBack showFooter={showFooter}>
      {children(group, api)}
    </MainLayout>
  )
}

// 탭 1. 명단 조회
function DetailContent({ group, api }: { group: MemberGroup; api: GroupApi }) {
  const { members, loading, error, reload } = useMembersApi(group.id)

  if (loading) return <Status message="부원 명단을 불러오는 중이에요." />
  if (error) return <Status message={error} onRetry={() => void reload()} />

  return (
    <MemberDetailPage
      group={group}
      members={members}
      onDeleteGroup={async () => {
        try {
          await api.deleteGroup()
          return true
        } catch (caught) {
          showAlert(getApiErrorMessage(caught, '명단방을 삭제하지 못했어요.'))
          return false
        }
      }}
    />
  )
}

export function MemberDetailRoute() {
  return <MemberGroupRoute>{(group, api) => <DetailContent group={group} api={api} />}</MemberGroupRoute>
}

// 탭 2. 링크 관리
export function MemberLinkRoute() {
  return <MemberGroupRoute title="등록 링크 관리">{group => <MemberLinkPage group={group} />}</MemberGroupRoute>
}

// 탭 3. 명단방 수정
export function MemberSettingsRoute() {
  return (
    <MemberGroupRoute title="명단방 수정" showFooter={false}>
      {(group, api) => (
        <MemberCreatePage
          key={group.id}
          groupId={group.id}
          initialValues={{ name: group.name, deadline: group.deadline ?? '', fields: group.fields ?? [] }}
          submitText="저장하기"
          onSubmit={async data => {
            try {
              await api.updateGroup(data)
              showAlert('명단방 정보가 저장되었어요.')
            } catch (caught) {
              showAlert(getApiErrorMessage(caught, '명단방을 저장하지 못했어요.'))
            }
          }}
        />
      )}
    </MemberGroupRoute>
  )
}

// 부원 추가 (운영진 API는 학번·파트·학년을 저장하지 않아 폼에서 숨김)
function AddContent({ group }: { group: MemberGroup }) {
  const { addMember } = useMembersApi(group.id)
  return <MemberAddPage group={{ ...group, fields: toOperatorFields(group.fields) }} onAdd={(_, data) => addMember(data)} />
}

export function MemberAddRoute() {
  return <MemberGroupRoute title="부원 추가" showFooter={false}>{group => <AddContent group={group} />}</MemberGroupRoute>
}

// 부원 정보 수정
function EditContent({ group }: { group: MemberGroup }) {
  const { loading, error, reload, getMember, editMember, deleteMember } = useMembersApi(group.id)

  if (loading) return <Status message="부원 정보를 불러오는 중이에요." />
  if (error) return <Status message={error} onRetry={() => void reload()} />

  return (
    <MemberEditPage
      group={{ ...group, fields: toOperatorFields(group.fields) }}
      getMember={getMember}
      onEdit={editMember}
      onDelete={deleteMember}
    />
  )
}

export function MemberEditRoute() {
  return <MemberGroupRoute title="부원 정보 수정" showFooter={false}>{group => <EditContent group={group} />}</MemberGroupRoute>
}

const StatusBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding-top: 8px;

  p {
    font-size: 14px;
    line-height: 20px;
    color: var(--color-muted);
  }

  button {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary-strong);
    cursor: pointer;
  }
`
