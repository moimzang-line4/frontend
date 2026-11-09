import Button from '../Button'
import type { NewSchedule, ScheduleCategory } from '../../types/home/schedule'
import * as S from '../../styles/home/HomeDialog.styles'

type Props = { initialDate: string; onSubmit: (schedule: NewSchedule) => void }

export default function ScheduleForm({ initialDate, onSubmit }: Props) {
  return (
    <S.Form onSubmit={event => {
      event.preventDefault()
      const form = event.currentTarget
      const data = new FormData(form)
      const title = String(data.get('title') ?? '').trim()
      if (!title) {
        const input = form.elements.namedItem('title') as HTMLInputElement
        input.setCustomValidity('일정 이름을 입력해주세요.')
        input.reportValidity()
        return
      }
      onSubmit({ title, date: String(data.get('date')), category: String(data.get('category')) as ScheduleCategory, venue: String(data.get('venue') ?? '').trim() })
    }}>
      <S.Label>일정 이름<S.Input name="title" required maxLength={80} onInput={event => event.currentTarget.setCustomValidity('')} /></S.Label>
      <S.Label>날짜<S.Input name="date" type="date" required defaultValue={initialDate} min="1900-01-01" max="9999-12-31" /></S.Label>
      <S.Label>분류<S.Select name="category" defaultValue="performance"><option value="meeting">회의</option><option value="session">세션</option><option value="performance">공연</option><option value="newcomer">신입공연</option></S.Select></S.Label>
      <S.Label>장소<S.Input name="venue" maxLength={100} /></S.Label>
      <Button type="submit">등록</Button>
    </S.Form>
  )
}
