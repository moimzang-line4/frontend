import { useEffect, useRef, useState } from 'react'
import closeIcon from '../../assets/schedules/close.svg'
import checkIcon from '../../assets/schedules/check.svg'
import useCategories from '../../hooks/schedules/useCategories'
import type { CategoryOption } from '../../types/schedules/schedule'
import * as S from '../../styles/schedules/CategorySheet.styles'

type Props = { selectedId?: string; onSelect: (option: CategoryOption) => void; onClose: () => void }
export default function CategorySheet({ selectedId, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [closing, setClosing] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const { categories, addCategory } = useCategories()

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
  useEffect(() => { if (adding) nameRef.current?.focus() }, [adding])

  function choose(option: CategoryOption) {
    if (closing) return
    onSelect(option)
    setClosing(true)
  }

  return (
    <S.Sheet ref={ref} $closing={closing} aria-labelledby="category-sheet-title" onClose={onClose} onCancel={event => { event.preventDefault(); setClosing(true) }} onClick={event => {
      if (event.target !== ref.current) return
      const rect = ref.current.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setClosing(true)
    }}>
      <S.HandleRow aria-hidden="true" />
      <S.Header><h2 id="category-sheet-title">카테고리 선택</h2><S.CloseButton type="button" aria-label="닫기" onClick={() => setClosing(true)}><img src={closeIcon} alt="" width={20} height={20} /></S.CloseButton></S.Header>
      <S.Options aria-label="카테고리 목록">
        {categories.map(option => (
          <S.Option key={option.id} type="button" $selected={selectedId === option.id} aria-pressed={selectedId === option.id} onClick={() => choose(option)}>
            <span>{option.label}</span>{selectedId === option.id && <img src={checkIcon} alt="" width={22} height={22} />}
          </S.Option>
        ))}
      </S.Options>
      {adding ? <S.AddForm onSubmit={event => {
        event.preventDefault()
        const name = nameRef.current?.value.trim()
        if (!name) return
        try { choose(addCategory(name)) }
        catch { setError('카테고리를 저장하지 못했어요. 브라우저 저장 공간을 확인해주세요.') }
      }}>
        <input ref={nameRef} aria-label="새 카테고리 이름" placeholder="카테고리 이름" required maxLength={30} />
        <button type="submit">추가</button>
        <button type="button" onClick={() => setAdding(false)}>취소</button>
      </S.AddForm> : <S.AddButton type="button" onClick={() => setAdding(true)}>＋ 새 카테고리 추가</S.AddButton>}
      {error && <S.Error role="alert">{error}</S.Error>}
    </S.Sheet>
  )
}
