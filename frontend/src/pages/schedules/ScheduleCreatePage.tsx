import { useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import ColorPicker from '../../components/schedules/ColorPicker'
import DateTimeRow from '../../components/schedules/DateTimeRow'
import CategorySheet from '../../components/schedules/CategorySheet'
import useScheduleForm from '../../hooks/schedules/useScheduleForm'
import useSchedules from '../../hooks/schedules/useSchedules'
import type { Schedule } from '../../types/schedules/schedule'
import * as S from '../../styles/schedules/ScheduleCreatePage.styles'

export default function ScheduleCreatePage({ initialSchedule }: { initialSchedule?: Schedule }) {
  const navigate = useNavigate()
  const { draft, update, canSubmit, invalidRange, toSchedule } = useScheduleForm(initialSchedule)
  const { addSchedule, updateSchedule, deleteSchedule } = useSchedules()
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState('')
  return (
    <S.Page>
      <Header title={initialSchedule ? '일정 수정' : '일정 등록'} />
      <S.Form id="schedule-create-form" onSubmit={event => {
        event.preventDefault()
        const schedule = toSchedule()
        if (!schedule) return
        try {
          if (initialSchedule) {
            updateSchedule(initialSchedule.id, schedule)
            navigate(`/schedules/${encodeURIComponent(initialSchedule.id)}`, { replace: true })
          } else {
            addSchedule(schedule)
            navigate(`/?date=${schedule.date}`, { replace: true })
          }
        } catch { setError('일정을 저장하지 못했어요. 브라우저 저장 공간을 확인하고 다시 시도해주세요.') }
      }}>
        <S.Field>
          <S.Label htmlFor="schedule-title">제목<S.Required aria-hidden="true">*</S.Required></S.Label>
          <S.Input id="schedule-title" aria-label="제목" required maxLength={80} placeholder="일정 제목을 입력해 주세요" value={draft.title} onChange={event => update('title', event.target.value)} />
        </S.Field>
        <ColorPicker value={draft.color} onChange={color => update('color', color)} />
        <S.CategoryButton type="button" aria-haspopup="dialog" aria-expanded={categoryOpen} aria-label={`카테고리: ${draft.category?.label ?? '선택해 주세요'}`} onClick={() => setCategoryOpen(true)}>
          <span>카테고리</span><S.CategoryValue $chosen={Boolean(draft.category)}>{draft.category?.label ?? '선택해 주세요'} ▾</S.CategoryValue>
        </S.CategoryButton>
        <S.DateCard aria-label="일정 일시">
          <S.ToggleRow><span>종일</span><S.Switch type="button" role="switch" aria-label="종일" aria-checked={draft.allDay} $checked={draft.allDay} onClick={() => update('allDay', !draft.allDay)} /></S.ToggleRow>
          <S.Divider />
          <DateTimeRow label="시작" date={draft.date} time={draft.startTime} allDay={draft.allDay} onDateChange={value => update('date', value)} onTimeChange={value => update('startTime', value)} />
          <DateTimeRow label="종료" date={draft.endDate} time={draft.endTime} allDay={draft.allDay} onDateChange={value => update('endDate', value)} onTimeChange={value => update('endTime', value)} />
          {invalidRange && <S.Error role="alert">종료 일시는 시작 일시보다 빠를 수 없어요.</S.Error>}
        </S.DateCard>
        <S.Field>
          <S.Label htmlFor="schedule-venue">장소</S.Label>
          <S.Input id="schedule-venue" maxLength={100} placeholder="장소를 입력해 주세요 (선택)" value={draft.venue} onChange={event => update('venue', event.target.value)} />
        </S.Field>
        <S.OperationCard aria-label="운영 공간 옵션">
          <S.ToggleRow><span>운영 공간 함께 만들기</span><S.Switch type="button" role="switch" aria-label="운영 공간 함께 만들기" aria-checked={draft.createOperationSpace} $checked={draft.createOperationSpace} onClick={() => update('createOperationSpace', !draft.createOperationSpace)} /></S.ToggleRow>
          <S.Description>일정을 등록하면 이 일정의 운영 공간이 함께 만들어져요.<br />등록 전에는 운영 공간이 생성되지 않아요.</S.Description>
        </S.OperationCard>
        {initialSchedule && <S.DeleteButton type="button" onClick={() => setDeleteOpen(true)}>일정 삭제하기</S.DeleteButton>}
        {error && <S.Error role="alert">{error}</S.Error>}
      </S.Form>
      <S.ActionBar><S.SubmitButton type="submit" form="schedule-create-form" disabled={!canSubmit}>{initialSchedule ? '수정하기' : '일정 등록하기'}</S.SubmitButton></S.ActionBar>
      <ConfirmDialog open={deleteOpen} title="일정을 삭제할까요?" description="삭제한 일정은 복구할 수 없어요." confirmText="삭제하기" onCancel={() => setDeleteOpen(false)} onConfirm={() => {
        if (!initialSchedule) return
        deleteSchedule(initialSchedule.id)
        navigate('/', { replace: true })
      }} />
      {categoryOpen && <CategorySheet selectedId={draft.category?.id} onSelect={category => update('category', category)} onClose={() => setCategoryOpen(false)} />}
    </S.Page>
  )
}
