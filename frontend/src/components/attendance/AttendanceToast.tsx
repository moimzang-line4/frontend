import StatusToast from '../common/StatusToast'

type Props = {
  title: string
  description: string
  onClose: () => void
}

// 현장 인원 추가 완료 안내 (3초 뒤 자동으로 닫힘)
export default function AttendanceToast(props: Props) {
  return <StatusToast {...props} autoCloseMs={3000} />
}
