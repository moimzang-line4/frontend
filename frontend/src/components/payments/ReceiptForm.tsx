import { useState } from 'react'
import OptionSheet from '../OptionSheet'
import type { ReceiptField, ReceiptFieldKey, ReceiptForm as ReceiptFormValues } from '../../types/payments/receipt'
import { ROUND_OPTIONS } from '../../constants/payments/receipt'
import * as S from '../../styles/payments/ReceiptForm.styles'

type Props = {
  fields: readonly ReceiptField[]
  values: ReceiptFormValues
  onChange: (key: ReceiptFieldKey, value: string) => void
}

// 피그마: 영수증 인식 결과 / 직접 등록의 입력 카드 (라벨 | 값 한 줄씩)
export default function ReceiptForm({ fields, values, onChange }: Props) {
  const [roundOpen, setRoundOpen] = useState(false)

  return (
    <S.Card>
      {fields.map(field => {
        const id = `receipt-${field.key}`
        return (
          <S.Row key={field.key}>
            <S.Label htmlFor={id}>
              {field.label}
              {field.required && <S.Required aria-hidden="true"> *</S.Required>}
            </S.Label>

            {field.key === 'round' ? (
              <S.SelectButton
                id={id}
                type="button"
                aria-haspopup="listbox"
                $empty={!values.round}
                onClick={() => setRoundOpen(true)}
              >
                <span>{values.round || field.placeholder}</span>
                <S.Chevron width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </S.Chevron>
              </S.SelectButton>
            ) : (
              <S.Input
                id={id}
                required={field.required}
                inputMode={field.inputMode}
                placeholder={field.placeholder}
                value={values[field.key]}
                onChange={event => onChange(
                  field.key,
                  field.inputMode === 'numeric' ? event.target.value.replace(/[^\d,]/g, '') : event.target.value,
                )}
              />
            )}
          </S.Row>
        )
      })}

      {roundOpen && (
        <OptionSheet
          title="차수 선택"
          options={ROUND_OPTIONS}
          selected={values.round as (typeof ROUND_OPTIONS)[number] | ''}
          onSelect={option => onChange('round', option)}
          onClose={() => setRoundOpen(false)}
        />
      )}
    </S.Card>
  )
}
