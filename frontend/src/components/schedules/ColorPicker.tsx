import { scheduleColors } from '../../constants/schedules/options'
import * as S from '../../styles/schedules/ScheduleCreatePage.styles'

type Props = { value: string; onChange: (color: string) => void }
export default function ColorPicker({ value, onChange }: Props) {
  return (
    <S.Field>
      <S.Label as="p" id="schedule-color-label">색상</S.Label>
      <S.Palette role="group" aria-labelledby="schedule-color-label">
        {scheduleColors.map(color => (
          <S.ColorButton type="button" key={color.value} $selected={value === color.value} aria-label={color.label} aria-pressed={value === color.value} onClick={() => onChange(color.value)}>
            <S.ColorImageSlot><img src={color.icon} alt="" /></S.ColorImageSlot>
          </S.ColorButton>
        ))}
      </S.Palette>
    </S.Field>
  )
}
