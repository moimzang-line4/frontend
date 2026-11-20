import calendarIcon from '../../assets/schedules/calendar.svg'
import dateChevron from '../../assets/schedules/date-chevron.svg'
import timeChevron from '../../assets/schedules/time-chevron.svg'
import * as S from '../../styles/schedules/ScheduleCreatePage.styles'

type Props = {
  label: '시작' | '종료'
  date: string
  time: string
  allDay: boolean
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}
export default function DateTimeRow({ label, date, time, allDay, onDateChange, onTimeChange }: Props) {
  return (
    <S.DateRow>
      <span>{label}<S.Required aria-hidden="true">*</S.Required></span>
      <S.Picker>
        <S.PickerText $filled={Boolean(date)}>
          <img src={calendarIcon} alt="" width={18} height={18} />
          <span>{date ? date.replaceAll('-', '.') : '날짜 선택'}</span>
        </S.PickerText>
        <img src={dateChevron} alt="" width={21} height={21} />
        <S.NativePicker type="date" aria-label={`${label} 날짜`} value={date} min="1900-01-01" max="9999-12-31" required onChange={event => onDateChange(event.target.value)} onClick={event => {
          try { event.currentTarget.showPicker?.() } catch { /* Native keyboard input remains available. */ }
        }} />
      </S.Picker>
      <S.Picker $disabled={allDay}>
        <S.PickerText $filled={!allDay && Boolean(time)}><span>{allDay ? '종일' : time || '시간 선택'}</span></S.PickerText>
        <img src={timeChevron} alt="" width={14} height={14} />
        <S.NativePicker type="time" aria-label={`${label} 시간`} value={time} disabled={allDay} required={false} onChange={event => onTimeChange(event.target.value)} onClick={event => {
          try { event.currentTarget.showPicker?.() } catch { /* Native keyboard input remains available. */ }
        }} />
      </S.Picker>
    </S.DateRow>
  )
}
