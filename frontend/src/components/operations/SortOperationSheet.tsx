import BottomSheet from '../BottomSheet'
import { sortLabels, sortOptions } from '../../constants/operations/sortOptions'
import checkIcon from '../../assets/operations/sort-check.svg'
import type { OperationSort } from '../../types/operations/operation'
import * as S from '../../styles/operations/SortOperationSheet.styles'

type Props = { selected: OperationSort; onSelect: (value: OperationSort) => void; onClose: () => void }
export default function SortOperationSheet({ selected, onSelect, onClose }: Props) {
  return <BottomSheet title="정렬 기준" onClose={onClose}>
    {close => <S.Options aria-label="정렬 옵션">
      {sortOptions.map(option => <S.Option key={option.value} type="button" $active={selected === option.value} aria-pressed={selected === option.value} onClick={() => close(() => onSelect(option.value))}>
        <span><strong>{sortLabels[option.value]}</strong><small>{option.description}</small></span>
        {selected === option.value && <img src={checkIcon} alt="" width={22} height={22} />}
      </S.Option>)}
    </S.Options>}
  </BottomSheet>
}
