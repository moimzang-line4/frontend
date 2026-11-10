import BottomSheet from '../BottomSheet'
import * as S from '../../styles/settings/ManagementPage.styles'

type Props = {
  name: string
  onClose: () => void
  onAction: (action: 'remove' | 'transfer') => void
}
export default function OperatorActionSheet({ name, onClose, onAction }: Props) {
  return <BottomSheet title={name} onClose={onClose}>
    {close => <S.SheetActions>
      <button type="button" onClick={() => close(() => onAction('transfer'))}>모임장으로 권한 변경</button>
      <button type="button" onClick={() => close(() => onAction('remove'))}>내보내기</button>
    </S.SheetActions>}
  </BottomSheet>
}
