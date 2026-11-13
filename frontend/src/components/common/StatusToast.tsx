import { useEffect, useEffectEvent } from 'react'
import * as S from '../../styles/common/StatusToast.styles'

type Props = {
  title: string
  description: string
  onClose: () => void
  aboveFooter?: boolean
  autoCloseMs?: number
  showProgress?: boolean
}

export default function StatusToast({ title, description, onClose, aboveFooter = false, autoCloseMs, showProgress = false }: Props) {
  const close = useEffectEvent(onClose)
  useEffect(() => {
    if (!autoCloseMs) return
    const timer = window.setTimeout(() => close(), autoCloseMs)
    return () => window.clearTimeout(timer)
  }, [autoCloseMs])
  return <S.Toast role="status" aria-live="polite" $aboveFooter={aboveFooter}>
    <S.Text><strong>{title}</strong><span>{description}</span></S.Text>
    <S.ConfirmButton type="button" onClick={onClose}>확인</S.ConfirmButton>
    {showProgress && autoCloseMs && <S.Progress key={autoCloseMs} $duration={autoCloseMs} aria-hidden="true" />}
  </S.Toast>
}
