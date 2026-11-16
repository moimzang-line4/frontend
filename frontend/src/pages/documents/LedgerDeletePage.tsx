import { Navigate } from 'react-router'

// 장부 삭제는 지원하지 않아요. 예전 주소로 들어오면 장부 탭으로 돌아가요.
export default function LedgerDeletePage() {
  return <Navigate to="/files" replace state={{ tab: '장부' }} />
}
