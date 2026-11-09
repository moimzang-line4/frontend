import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import * as S from '../../styles/home/HomeDialog.styles'

type Props = { title: string; children: ReactNode; onClose: () => void }

export default function HomeDialog({ title, children, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => { ref.current?.showModal() }, [])
  return (
    <S.Dialog ref={ref} aria-labelledby={titleId} onClose={onClose} onClick={event => {
      if (event.target === ref.current) {
        const rect = ref.current.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) ref.current.close()
      }
    }}>
      <S.Header><h2 id={titleId}>{title}</h2><S.Close type="button" aria-label="닫기" onClick={() => ref.current?.close()}>×</S.Close></S.Header>
      {children}
    </S.Dialog>
  )
}
