import { Navigate } from 'react-router'

// 이전에 저장한 주소로 접근해도 직접 입력 화면으로 이동해요.
export default function LedgerUploadPage() {
  return <Navigate to="/files/ledger/initial" replace />
}
