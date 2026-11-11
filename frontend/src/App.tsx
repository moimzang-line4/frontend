import styled from 'styled-components'
import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router'

import MainLayout from './layouts/MainLayout'

import HomePage from './pages/home/HomePage'
import OperationsPage from './pages/operations/OperationsPage'
import SettingsPage from './pages/settings/SettingsPage'
import OperatorsPage from './pages/settings/OperatorsPage'
import InviteLinkPage from './pages/settings/InviteLinkPage'
import GroupEditPage from './pages/settings/GroupEditPage'
import GroupSelectionPage from './pages/groups/GroupSelectionPage'
import useDemoGroup from './hooks/groups/useDemoGroup'
import ScheduleCreatePage from './pages/schedules/ScheduleCreatePage'
import ScheduleDetailPage from './pages/schedules/ScheduleDetailPage'
import ScheduleEditPage from './pages/schedules/ScheduleEditPage'
import ScheduleOperationPage from './pages/schedules/ScheduleOperationPage'
import AttendancePage from './pages/attendance/AttendancePage'
import PaymentsPage from './pages/payments/PaymentsPage'
import ReceiptCameraPage from './pages/payments/ReceiptCameraPage'
import ReceiptResultPage from './pages/payments/ReceiptResultPage'

import MemberListPage from './pages/members/MemberListPage'
import MemberCreatePage from './pages/members/MemberCreatePage'
import MemberLinkPage from './pages/members/MemberLinkPage'
import MemberRegisterPage from './pages/members/MemberRegisterPage'
import MemberDetailPage from './pages/members/MemberDetailPage'
import MemberAddPage from './pages/members/MemberAddPage'
import MemberEditPage from './pages/members/MemberEditPage'

import useMemberGroups from './hooks/members/useMemberGroups'
import useMembers from './hooks/members/useMembers'

import type { MemberGroup, CreateMemberGroup } from './types/members/member'
import AlertModal from './components/AlertModal'
import { showAlert } from './hooks/useAlert'

const MeetingFormPage = lazy(() => import('./pages/meetings/MeetingFormPage'))
const MeetingRunPage = lazy(() => import('./pages/meetings/MeetingRunPage'))

// 부원 명단 목록 라우트
function MemberListRoute({
  groups,
}: {
  groups: MemberGroup[]
}) {
  const navigate = useNavigate()

  return (
    <MemberListPage
      groups={groups}
      onCreate={() => navigate('/members/new')}
      onSelect={(id) => navigate(`/members/${id}`)}
    />
  )
}

// 새 명단방 생성 라우트
function MemberCreateRoute({
  createGroup,
}: {
  createGroup: (data: CreateMemberGroup) => MemberGroup
}) {
  const navigate = useNavigate()

  return (
    <MemberCreatePage
      onSubmit={(data) => {
        const newGroup = createGroup(data)
        navigate(`/members/${newGroup.id}/link`, { replace: true })
      }}
    />
  )
}

// 명단방(:id) 하위 화면 공통 레이아웃: URL의 id로 명단방을 찾아 화면에 넘겨줌
function MemberGroupRoute({
  groups,
  title,
  showFooter = true,
  children,
}: {
  groups: MemberGroup[]
  title?: string
  showFooter?: boolean
  children: (group: MemberGroup) => ReactNode
}) {
  const { id } = useParams<{ id: string }>()
  const group = groups.find((item) => item.id === Number(id))

  if (!group) {
    return (
      <MainLayout title="명단방을 찾을 수 없어요">
        <Placeholder>삭제되었거나 존재하지 않는 명단방이에요.</Placeholder>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title={title ?? group.name}
      showBack
      showFooter={showFooter}
    >
      {children(group)}
    </MainLayout>
  )
}

// 기존 페이지 유지
const pages = [
  { path: '/ai', title: 'AI' },
  { path: '/files', title: '자료실' },
  { path: '/groups/new', title: '그룹 만들기' },
]

function OperationsRoute() {
  const [params] = useSearchParams()
  const eventId = params.get('event')

  if (eventId) {
    return (
      <Navigate
        to={`/schedules/${encodeURIComponent(eventId)}`}
        replace
      />
    )
  }

  return <OperationsPage />
}

function GroupHomeRoute() {
  const { isMember } = useDemoGroup()
  return isMember ? <HomePage /> : <Navigate to="/groups" replace />
}

export default function App() {
  const { groups: savedGroups, createGroup, updateGroup, deleteGroup } = useMemberGroups()
  const {
    getMembersByGroup,
    countByGroup,
    getMember,
    addMember,
    editMember,
    deleteMember,
    deleteMembersByGroup,
  } = useMembers()

  // 등록 인원은 실제 부원 데이터 기준으로 계산
  const groups = savedGroups.map((group) => ({
    ...group,
    memberCount: countByGroup(group.id),
  }))

  const handleDeleteGroup = (id: number) => {
    deleteMembersByGroup(id)
    deleteGroup(id)
  }

  return (
    <>
    <Routes>
      {/* 홈 */}
      <Route path="/" element={<GroupHomeRoute />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/operators" element={<OperatorsPage />} />
      <Route path="/settings/invite" element={<InviteLinkPage />} />
      <Route path="/settings/group" element={<GroupEditPage />} />
      <Route path="/groups" element={<GroupSelectionPage />} />
      <Route path="/groups/join/:groupId" element={<GroupSelectionPage />} />

      <Route path="/meetings/new" element={<Suspense fallback={<Placeholder>회의록을 불러오는 중이에요.</Placeholder>}><MeetingFormPage /></Suspense>} />
      <Route path="/meetings/:meetingId" element={<Suspense fallback={<Placeholder>회의록을 불러오는 중이에요.</Placeholder>}><MeetingFormPage /></Suspense>} />
      <Route path="/meetings/:meetingId/run" element={<Suspense fallback={<Placeholder>회의록을 불러오는 중이에요.</Placeholder>}><MeetingRunPage /></Suspense>} />

      {/* 일정 관리 */}
      <Route
        path="/schedules/new"
        element={<ScheduleCreatePage />}
      />

      <Route
        path="/schedules/:scheduleId"
        element={<ScheduleDetailPage />}
      />

      <Route
        path="/schedules/:scheduleId/edit"
        element={<ScheduleEditPage />}
      />

      {/* 운영 메뉴 > 참석·출석 (다른 메뉴보다 먼저 매칭됨) */}
      <Route
        path="/schedules/:scheduleId/operations/attendance"
        element={<AttendancePage />}
      />

      {/* 운영 메뉴 > 정산·입금 */}
      <Route path="/schedules/:scheduleId/operations/payments" element={<PaymentsPage tab="receipts" />} />
      <Route path="/schedules/:scheduleId/operations/payments/members" element={<PaymentsPage tab="members" />} />
      <Route path="/schedules/:scheduleId/operations/payments/notice" element={<PaymentsPage tab="notice" />} />
      <Route path="/schedules/:scheduleId/operations/payments/receipts/camera" element={<ReceiptCameraPage />} />
      <Route path="/schedules/:scheduleId/operations/payments/receipts/new" element={<ReceiptResultPage key="scan" mode="scan" />} />
      <Route path="/schedules/:scheduleId/operations/payments/receipts/manual" element={<ReceiptResultPage key="manual" mode="manual" />} />

      <Route
        path="/schedules/:scheduleId/operations/:menuId"
        element={<ScheduleOperationPage />}
      />

      <Route
        path="/operations"
        element={<OperationsRoute />}
      />

      {/* 기존 페이지 */}
      {pages.map(({ path, title }) => (
        <Route
          key={path}
          element={
            <MainLayout
              title={title}
              showBack={path !== '/'}
            />
          }
        >
          <Route
            path={path}
            element={
              <Placeholder>
                {title} 페이지 준비 중입니다.
              </Placeholder>
            }
          />
        </Route>
      ))}

      {/* 부원 명단 목록 */}
      <Route
        element={
          <MainLayout
            title="부원"
            showBack={false}
            headerAlign="left"
          />
        }
      >
        <Route
          path="/members"
          element={
            <MemberListRoute groups={groups} />
          }
        />
      </Route>

      {/* 새 명단방 생성 */}
      <Route
        element={
          <MainLayout
            title="새 명단방 만들기"
            showBack
            showFooter={false}
          />
        }
      >
        <Route
          path="/members/new"
          element={
            <MemberCreateRoute createGroup={createGroup} />
          }
        />
      </Route>

      {/* 부원 등록 폼 */}
      <Route
        path="/members/register/:id"
        element={<MemberRegisterPage groups={groups} onAdd={addMember} />}
      />

      {/* 탭 1. 명단 조회 */}
      <Route
        path="/members/:id"
        element={
          <MemberGroupRoute groups={groups}>
            {(group) => (
              <MemberDetailPage
                group={group}
                members={getMembersByGroup(group.id)}
                onDeleteGroup={handleDeleteGroup}
              />
            )}
          </MemberGroupRoute>
        }
      />

      {/* 탭 2. 링크 관리 */}
      <Route
        path="/members/:id/link"
        element={
          <MemberGroupRoute groups={groups} title="등록 링크 관리">
            {(group) => <MemberLinkPage group={group} />}
          </MemberGroupRoute>
        }
      />

      {/* 탭 3. 명단방 수정 */}
      <Route
        path="/members/:id/settings"
        element={
          <MemberGroupRoute groups={groups} title="명단방 수정" showFooter={false}>
            {(group) => (
              <MemberCreatePage
                key={group.id}
                groupId={group.id}
                initialValues={{
                  name: group.name,
                  deadline: group.deadline ?? '',
                  fields: group.fields ?? [],
                }}
                submitText="저장하기"
                onSubmit={(data) => {
                  updateGroup(group.id, data)
                  showAlert('명단방 정보가 저장되었어요.')
                }}
              />
            )}
          </MemberGroupRoute>
        }
      />

      {/* 부원 추가 */}
      <Route
        path="/members/:id/add"
        element={
          <MemberGroupRoute groups={groups} title="부원 추가" showFooter={false}>
            {(group) => (
              <MemberAddPage group={group} onAdd={addMember} />
            )}
          </MemberGroupRoute>
        }
      />

      {/* 부원 정보 수정 */}
      <Route
        path="/members/:id/edit/:memberId"
        element={
          <MemberGroupRoute groups={groups} title="부원 정보 수정" showFooter={false}>
            {(group) => (
              <MemberEditPage
                group={group}
                getMember={getMember}
                onEdit={editMember}
                onDelete={deleteMember}
              />
            )}
          </MemberGroupRoute>
        }
      />

      {/* 404 페이지 */}
      <Route
        element={
          <MainLayout title="페이지를 찾을 수 없어요" />
        }
      >
        <Route
          path="*"
          element={<p>주소를 확인해주세요.</p>}
        />
      </Route>
    </Routes>
    <AlertModal />
    </>
  )
}

const Placeholder = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: var(--color-muted);
`
