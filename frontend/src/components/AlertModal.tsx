import { useEffect, useRef } from 'react'
import useAlert, { closeAlert } from '../hooks/useAlert'
import * as S from '../styles/AlertModal.styles'

// showAlert()로 띄우는 공통 안내 모달 (App에 한 번만 렌더링)
export default function AlertModal() {
  const alert = useAlert()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!alert) return
    buttonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAlert()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [alert])

  if (!alert) return null

  return (
    <S.Overlay onClick={closeAlert}>
      <S.Modal
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby={alert.description ? 'alert-description' : undefined}
        onClick={event => event.stopPropagation()}
      >
        <S.Title id="alert-title">{alert.title}</S.Title>
        {alert.description && <S.Description id="alert-description">{alert.description}</S.Description>}
        <S.ConfirmButton ref={buttonRef} type="button" onClick={closeAlert}>
          {alert.confirmText}
        </S.ConfirmButton>
      </S.Modal>
    </S.Overlay>
  )
}
