import BottomSheet from './BottomSheet'
import * as S from '../styles/OptionSheet.styles'

type Props<T extends string> = {
  title: string
  options: readonly T[]
  selected?: T | ''
  onSelect: (option: T) => void
  onClose: () => void
}

// 기본 <select> 대신 쓰는 바텀시트 선택 목록
export default function OptionSheet<T extends string>({ title, options, selected, onSelect, onClose }: Props<T>) {
  return (
    <BottomSheet title={title} onClose={onClose}>
      <S.Options role="listbox" aria-label={title}>
        {options.map(option => {
          const active = selected === option
          return (
            <S.Option
              key={option}
              type="button"
              role="option"
              aria-selected={active}
              $active={active}
              onClick={() => {
                onSelect(option)
                onClose()
              }}
            >
              {option}
              {active && (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M5 11.5l4 4 8-9" stroke="#367D70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </S.Option>
          )
        })}
      </S.Options>
    </BottomSheet>
  )
}
