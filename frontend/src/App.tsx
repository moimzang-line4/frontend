import { Route, Routes } from 'react-router'
import MainLayout from './layouts/MainLayout'

// Temporary shells; replace each child with its feature page as it is built.
const pages = [
  { path: '/', title: '홈' },
  { path: '/members', title: '부원' },
  { path: '/ai', title: 'AI' },
  { path: '/operations', title: '운영 공간' },
  { path: '/files', title: '자료실' },
  { path: '/groups/new', title: '그룹 만들기' },
]

export default function App() {
  return (
    <Routes>
      {pages.map(({ path, title }) => (
        <Route key={path} element={<MainLayout title={title} showBack={path !== '/'} />}>
          <Route path={path} element={<p className="text-sm text-muted">{title} 페이지 준비 중입니다.</p>} />
        </Route>
      ))}
      <Route element={<MainLayout title="페이지를 찾을 수 없어요" />}>
        <Route path="*" element={<p>주소를 확인해주세요.</p>} />
      </Route>
    </Routes>
  )
}
