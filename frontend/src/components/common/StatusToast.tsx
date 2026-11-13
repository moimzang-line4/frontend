import { useEffect } from 'react'
import * as S from '../../styles/common/StatusToast.styles'

type Props = {
  title: string
  description: string
  onClose: () => void
  aboveFooter?: boolean
  autoCloseMs?: number
}

export default function StatusToast({ title, description, onClose, aboveFooter = false, autoCloseMs }: Props) {
  useEffect(() => {
    if (!autoCloseMs) return
    const timer = window.setTimeout(onClose, autoCloseMs)
    return () => window.clearTimeout(timer)
  }, [autoCloseMs, onClose])
  return <S.Toast role="status" aria-live="polite" $aboveFooter={aboveFooter}>
    <S.Text><strong>{title}</strong><span>{description}</span></S.Text>
    <S.ConfirmButton type="button" onClick={onClose}>확인</S.ConfirmButton>
  </S.Toast>
}
