import type { SelectHTMLAttributes } from 'react'
import caretIcon from '../../assets/operations/caret.svg'
import * as S from '../../styles/common/DropdownSelect.styles'

type Props = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'value' | 'multiple' | 'size'
> & {
  'aria-label': string
  value: string
  options: readonly { value: string; label: string }[]
  variant?: 'generation' | 'inline'
}

export default function DropdownSelect({
  value,
  options,
  variant = 'generation',
  ...props
}: Props) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? ''

  return (
    <S.Control $variant={variant}>
      <S.Value $variant={variant} aria-hidden="true">
        {selectedLabel}
      </S.Value>
      <S.Caret
        $variant={variant}
        src={caretIcon}
        alt=""
        width={12}
        height={12}
      />
      <S.NativeSelect {...props} value={value} title={selectedLabel}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </S.NativeSelect>
    </S.Control>
  )
}
