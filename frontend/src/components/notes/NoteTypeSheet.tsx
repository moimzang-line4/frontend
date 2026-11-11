import BottomSheet from '../BottomSheet'
import { noteTypes } from '../../constants/notes/noteTypes'
import type { NoteType } from '../../types/notes/operationNote'
import checkIcon from '../../assets/operations/sort-check.svg'
import * as S from '../../styles/notes/NotesPage.styles'

type Props = { selected?: NoteType; onSelect: (type: NoteType) => void; onClose: () => void }
export default function NoteTypeSheet({ selected, onSelect, onClose }: Props) {
  return <BottomSheet title="메모 유형" onClose={onClose}>
    {close => <S.TypeOptions>{noteTypes.map(type => <S.TypeOption key={type.value} type="button" $active={selected === type.value} aria-pressed={selected === type.value} onClick={() => close(() => onSelect(type.value))}>
      {type.label}{selected === type.value && <img src={checkIcon} alt="" width={22} height={22} />}
    </S.TypeOption>)}</S.TypeOptions>}
  </BottomSheet>
}
