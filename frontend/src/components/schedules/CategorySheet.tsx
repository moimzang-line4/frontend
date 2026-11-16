import { useEffect, useRef, useState } from 'react'

import closeIcon from '../../assets/schedules/close.svg'
import checkIcon from '../../assets/schedules/check.svg'

import useScheduleCategoriesApi from '../../hooks/schedules/useScheduleCategoriesApi'
import type { CategoryOption } from '../../types/schedules/schedule'

import * as S from '../../styles/schedules/CategorySheet.styles'

type Props = {
  selectedId?: string
  selectedName?: string
  onSelect: (option: CategoryOption) => void
  onClose: () => void
}

export default function CategorySheet({
  selectedId,
  selectedName,
  onSelect,
  onClose,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const [closing, setClosing] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const categoriesApi = useScheduleCategoriesApi()
  const { categories, pending } = categoriesApi

  useEffect(() => {
    ref.current?.showModal()

    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    if (!closing) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const timer = window.setTimeout(() => {
      ref.current?.close()
    }, reduced ? 0 : 180)

    return () => window.clearTimeout(timer)
  }, [closing])

  useEffect(() => {
    if (adding) nameRef.current?.focus()
  }, [adding])

  function choose(option: CategoryOption) {
    if (closing) return

    onSelect(option)
    setClosing(true)
  }

  function close() {
    if (!pending) setClosing(true)
  }

  return (
    <S.Sheet
      ref={ref}
      $closing={closing}
      $empty={categories.length === 0}
      aria-labelledby="category-sheet-title"
      onClose={onClose}
      onCancel={event => {
        event.preventDefault()
        close()
      }}
      onClick={event => {
        const dialog = ref.current

        if (!dialog || event.target !== dialog) return

        const rect = dialog.getBoundingClientRect()

        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          close()
        }
      }}
    >
      <S.HandleRow aria-hidden="true" />

      <S.Header>
        <h2 id="category-sheet-title">카테고리 선택</h2>

        <S.CloseButton
          type="button"
          aria-label="닫기"
          disabled={pending}
          onClick={close}
        >
          <img
            src={closeIcon}
            alt=""
            width={20}
            height={20}
          />
        </S.CloseButton>
      </S.Header>

      {categoriesApi.loading ? (
        <S.EmptyState role="status">
          <strong>카테고리를 불러오는 중이에요.</strong>
        </S.EmptyState>
      ) : categoriesApi.errorMessage ? (
        <>
          <S.Error role="alert">
            {categoriesApi.errorMessage}
          </S.Error>

          {categoriesApi.canRetry && (
            <S.AddButton
              type="button"
              disabled={categoriesApi.refreshing}
              onClick={() => void categoriesApi.reload()}
            >
              다시 불러오기
            </S.AddButton>
          )}
        </>
      ) : categories.length === 0 ? (
        <S.EmptyState>
          <strong>등록된 카테고리가 없어요.</strong>
        </S.EmptyState>
      ) : (
        <S.Options aria-label="카테고리 목록">
          {categories.map(option => {
            const selected =
              selectedId === option.id ||
              selectedName === option.label

            return (
              <S.Option
                key={option.id}
                type="button"
                $selected={selected}
                aria-pressed={selected}
                disabled={pending}
                onClick={() => choose(option)}
              >
                <span>{option.label}</span>

                {selected && (
                  <img
                    src={checkIcon}
                    alt=""
                    width={22}
                    height={22}
                  />
                )}
              </S.Option>
            )
          })}
        </S.Options>
      )}

      {adding ? (
        <S.AddForm
          onSubmit={async event => {
            event.preventDefault()

            const name = nameRef.current?.value.trim()

            if (!name || pending) return

            setError('')

            try {
              const option = await categoriesApi.addCategory(name)

              if (option) choose(option)
            } catch (caught) {
              setError(
                caught instanceof Error
                  ? caught.message
                  : '카테고리를 추가하지 못했어요.',
              )
            }
          }}
        >
          <input
            ref={nameRef}
            aria-label="새 카테고리 이름"
            placeholder="카테고리 이름"
            required
            maxLength={50}
            disabled={pending}
          />

          <button type="submit" disabled={pending}>
            {pending ? '추가 중…' : '추가'}
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setAdding(false)
              setError('')
            }}
          >
            취소
          </button>
        </S.AddForm>
      ) : (
        <S.AddButton
          type="button"
          disabled={
            categoriesApi.loading ||
            !!categoriesApi.errorMessage ||
            closing
          }
          onClick={() => {
            setAdding(true)
            setError('')
          }}
        >
          ＋ 새 카테고리 추가
        </S.AddButton>
      )}

      {error && <S.Error role="alert">{error}</S.Error>}
    </S.Sheet>
  )
}