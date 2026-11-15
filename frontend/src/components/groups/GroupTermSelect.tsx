import { useState } from 'react'

import DropdownSelect from '../common/DropdownSelect'
import useCurrentGroup from '../../hooks/groups/useCurrentGroup'
import useOnboarding from '../../hooks/onboarding/useOnboarding'

type Props = {
  'aria-label'?: string
}

export default function GroupTermSelect({
  'aria-label': ariaLabel = '조회할 기수',
}: Props) {
  const currentGroup = useCurrentGroup()
  const onboarding = useOnboarding()

  const [saveError, setSaveError] = useState('')

  const terms = (currentGroup.group?.terms ?? []).flatMap(term => {
    if (
      typeof term.termId !== 'number' ||
      !Number.isSafeInteger(term.termId) ||
      term.termId <= 0 ||
      typeof term.name !== 'string' ||
      !term.name.trim()
    ) {
      return []
    }

    return [{
      value: String(term.termId),
      label: term.name,
    }]
  })

  const savedTermId = onboarding.group?.termId

  const selectedValue = terms.some(
    term => term.value === String(savedTermId),
  )
    ? String(savedTermId)
    : ''

  const placeholder = currentGroup.loading
    ? '기수 불러오는 중…'
    : terms.length
      ? '기수를 선택해주세요'
      : '조회할 기수가 없어요'

  const options = selectedValue
    ? terms
    : [{ value: '', label: placeholder }, ...terms]

  function selectTerm(value: string) {
    const selected = terms.find(term => term.value === value)
    const group = onboarding.group

    if (!selected || !group) return

    setSaveError('')

    try {
      onboarding.update({
        group: {
          ...group,
          termId: Number(selected.value),
          generation: selected.label,
        },
      })
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : '선택한 기수를 저장하지 못했어요.',
      )
    }
  }

  const errorMessage = saveError || currentGroup.errorMessage

  return (
    <>
      <DropdownSelect
        aria-label={ariaLabel}
        value={selectedValue}
        options={options}
        disabled={
          currentGroup.loading ||
          !!currentGroup.errorMessage ||
          terms.length === 0
        }
        onChange={event => selectTerm(event.target.value)}
      />

      {errorMessage && (
        <p role="alert">{errorMessage}</p>
      )}

      {currentGroup.errorMessage && currentGroup.canRetry && (
        <button
          type="button"
          disabled={currentGroup.refreshing}
          onClick={() => void currentGroup.reload()}
        >
          {currentGroup.refreshing
            ? '불러오는 중…'
            : '기수 다시 불러오기'}
        </button>
      )}
    </>
  )
}