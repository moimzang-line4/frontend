import styled from 'styled-components'
import { Route, Routes, useNavigate } from 'react-router'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/home/HomePage'

import MemberListPage from './pages/members/MemberListPage'
import MemberCreatePage from './pages/members/MemberCreatePage'
import useMemberGroups from './hooks/useMemberGroups'

import type { MemberGroup, CreateMemberGroup } from './types/member'

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
        createGroup(data)
        navigate('/members')
      }}
    />
  )
}

// 기존 페이지 유지
const pages = [
  { path: '/ai', title: 'AI' },
  { path: '/operations', title: '운영 공간' },
  { path: '/files', title: '자료실' },
  { path: '/groups/new', title: '그룹 만들기' },
]

export default function App() {
  const { groups, createGroup } = useMemberGroups()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
      <Route element={<MainLayout title="부원" showBack={false} headerAlign="left"/>}>
        <Route
          path="/members"
          element={<MemberListRoute groups={groups} />}
        />
      </Route>

      {/* 새 명단방 생성 */}
      <Route element={<MainLayout title="새 명단방 만들기" showBack />}>
        <Route
          path="/members/new"
          element={
            <MemberCreateRoute createGroup={createGroup} />
          }
        />
      </Route>

      {/* 404 페이지 */}
      <Route element={<MainLayout title="페이지를 찾을 수 없어요" />}>
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
