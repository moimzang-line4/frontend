import styled from 'styled-components'
import { Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router'

import MainLayout from './layouts/MainLayout'

import HomePage from './pages/home/HomePage'
import ScheduleCreatePage from './pages/schedules/ScheduleCreatePage'
import ScheduleDetailPage from './pages/schedules/ScheduleDetailPage'
import ScheduleEditPage from './pages/schedules/ScheduleEditPage'
import ScheduleOperationPage from './pages/schedules/ScheduleOperationPage'

import MemberListPage from './pages/members/MemberListPage'
import MemberCreatePage from './pages/members/MemberCreatePage'
import MemberLinkPage from './pages/members/MemberLinkPage'
import MemberRegisterPage from './pages/members/MemberRegisterPage'

import useMemberGroups from './hooks/members/useMemberGroups'

import type { MemberGroup, CreateMemberGroup } from './types/members/member'

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
      onSelect={(id) => navigate(`/members/${id}/link`)}
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
        navigate(`/members/${newGroup.id}/link`)
      }}
    />
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

  return (
    <MainLayout title="운영 공간">
      <Placeholder>
        운영 공간 페이지 준비 중입니다.
      </Placeholder>
    </MainLayout>
  )
}

export default function App() {
  const { groups, createGroup } = useMemberGroups()

  return (
    <Routes>
      {/* 홈 */}
      <Route path="/" element={<HomePage />} />

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

      {/* 등록 링크 관리 */}
      <Route
        element={
          <MainLayout
            title="등록 링크 관리"
            showBack
            showFooter
          />
        }
      >
        <Route
          path="/members/:id/link"
          element={<MemberLinkPage />}
        />
      </Route>

      {/* 부원 등록 폼 */}
      <Route
        path="/members/register/:id"
        element={<MemberRegisterPage />}
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
  )
}

const Placeholder = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: var(--color-muted);
`