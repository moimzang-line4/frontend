import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as S from '../../styles/common/ConfirmDialog.styles'

type Props = {
  open: boolean
  title: string
  description?: ReactNode
  children?: ReactNode
  confirmText?: string
  cancelText?: string
  hideCancel?: boolean
  tone?: 'danger' | 'primary'
  titleSize?: 18 | 20
  onCancel: () => void
  onConfirm: () => void | Promise<void>
}

export default function ConfirmDialog({ open, ...props }: Props) {
  return open ? <OpenDialog {...props} /> : null
}

function OpenDialog({ title, description, children, confirmText = '확인', cancelText = '취소', hideCancel = false, tone = 'danger', titleSize = 20, onCancel, onConfirm }: Omit<Props, 'open'>) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    const dialog = ref.current
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      mounted.current = false
      dialog?.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  async function confirm() {
    if (pending) return
    setPending(true)
    setError('')
    try { await onConfirm() }
    catch (cause) { if (mounted.current) setError(cause instanceof Error ? cause.message : '요청을 완료하지 못했어요. 다시 시도해주세요.') }
    finally { if (mounted.current) setPending(false) }
  }
  return (
    <S.Dialog ref={ref} role="alertdialog" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} aria-busy={pending} onCancel={event => {
      event.preventDefault()
      if (!pending) onCancel()
    }} onClick={event => {
      if (pending || event.target !== ref.current) return
      const rect = ref.current.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onCancel()
    }}>
      <S.Title id={titleId} $size={titleSize}>{title}</S.Title>
      {description && <S.Description id={descriptionId}>{description}</S.Description>}
      {children}
      {error && <S.Error role="alert">{error}</S.Error>}
      <S.Spacer aria-hidden="true" />
      <S.Actions>
        {!hideCancel && <S.Action type="button" $tone="cancel" disabled={pending} autoFocus onClick={onCancel}>{cancelText}</S.Action>}
        <S.Action type="button" $tone={tone} disabled={pending} autoFocus={hideCancel} onClick={() => void confirm()}>{pending ? '처리 중…' : confirmText}</S.Action>
      </S.Actions>
    </S.Dialog>
  )
}
