import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as S from '../styles/BottomSheet.styles'

type Props = {
  title: string
  description?: ReactNode
  onClose: () => void
  children: ReactNode
}

// dialog 기반 공통 바텀시트 (열림/닫힘 애니메이션, 바깥 클릭·ESC 닫기)
export default function BottomSheet({ title, description, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    ref.current?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow }
  }, [])

  useEffect(() => {
    if (!closing) return
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180
    const timer = window.setTimeout(() => ref.current?.close(), delay)
    return () => window.clearTimeout(timer)
  }, [closing])

  return (
    <S.Sheet
      ref={ref}
      $closing={closing}
      aria-labelledby="bottom-sheet-title"
      onClose={onClose}
      onCancel={event => { event.preventDefault(); setClosing(true) }}
      onClick={event => {
        const dialog = ref.current
        if (!dialog || event.target !== dialog) return
        const rect = dialog.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setClosing(true)
      }}
    >
      <S.HandleRow aria-hidden="true" />
      <S.Header>
        <S.Title id="bottom-sheet-title">{title}</S.Title>
        <S.CloseButton type="button" aria-label="닫기" onClick={() => setClosing(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="#253F3B" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </S.CloseButton>
      </S.Header>
      {description && <S.Description>{description}</S.Description>}
      <S.Body>{children}</S.Body>
    </S.Sheet>
  )
}
