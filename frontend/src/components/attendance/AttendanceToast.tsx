import { useEffect } from 'react'
import * as S from '../../styles/attendance/AttendanceToast.styles'

type Props = {
  title: string
  description: string
  onClose: () => void
}

// 현장 인원 추가 완료 안내 (3초 뒤 자동으로 닫힘)
export default function AttendanceToast({ title, description, onClose }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000)
    return () => window.clearTimeout(timer)
  }, [onClose])

  return (
    <S.Toast role="status" aria-live="polite">
      <S.Text>
        <strong>{title}</strong>
        <span>{description}</span>
      </S.Text>
      <S.ConfirmButton type="button" onClick={onClose}>확인</S.ConfirmButton>
    </S.Toast>
  )
}
