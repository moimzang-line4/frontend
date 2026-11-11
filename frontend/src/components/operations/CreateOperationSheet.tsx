import BottomSheet from '../BottomSheet'
import calendarIcon from '../../assets/operations/calendar-plus.svg'
import fileIcon from '../../assets/operations/file-pen.svg'
import chevron from '../../assets/operations/choice-chevron.svg'
import * as S from '../../styles/operations/OperationsPage.styles'

type Props = { onClose: () => void; onSchedule: () => void; onMinute: () => void }
export default function CreateOperationSheet({ onClose, onSchedule, onMinute }: Props) {
  return <BottomSheet title="만들기" onClose={onClose}>
    {close => <S.CreateChoices>
      <S.Choice type="button" onClick={() => close(onSchedule)}>
        <S.ChoiceIcon><img src={calendarIcon} alt="" width={24} height={24} /></S.ChoiceIcon>
        <span><strong>일정 및 운영 공간 생성하기</strong><small>일정을 등록하면 운영 공간이 함께 만들어져요.</small></span>
        <img src={chevron} alt="" width={16} height={16} />
      </S.Choice>
      <S.Choice type="button" onClick={() => close(onMinute)}>
        <S.ChoiceIcon><img src={fileIcon} alt="" width={24} height={24} /></S.ChoiceIcon>
        <span><strong>회의록 작성하기</strong><small>일정 없이 회의록만 작성할 수 있어요.</small></span>
        <img src={chevron} alt="" width={16} height={16} />
      </S.Choice>
    </S.CreateChoices>}
  </BottomSheet>
}
