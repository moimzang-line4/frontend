import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { isAxiosError } from 'axios'
import useCreateServerSchedule from '../../hooks/schedules/useCreateServerSchedule'

import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import ColorPicker from '../../components/schedules/ColorPicker'
import DateTimeRow from '../../components/schedules/DateTimeRow'
import CategorySheet from '../../components/schedules/CategorySheet'

import useScheduleForm from '../../hooks/schedules/useScheduleForm'
import type { Schedule } from '../../types/schedules/schedule'

import * as S from '../../styles/schedules/ScheduleCreatePage.styles'
import useServerScheduleActions from '../../hooks/schedules/useServerScheduleActions'

export default function ScheduleCreatePage({
  initialSchedule,
}: {
  initialSchedule?: Schedule
}) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const serverSchedule = useCreateServerSchedule()

  const {
    draft,
    update,
    canSubmit,
    invalidRange,
    toSchedule,
  } = useScheduleForm(initialSchedule, params.get('date'))
  
  const scheduleActions = useServerScheduleActions()

const busy =
  serverSchedule.pending ||
  scheduleActions.pending

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState('')

  return (
    <S.Page>
      <Header
        title={initialSchedule ? '일정 수정' : '일정 등록'}
      />

      <S.Form
        id="schedule-create-form"
        onSubmit={async event => {
  event.preventDefault()

  if (busy) return

  const schedule = toSchedule()

  if (!schedule) return

  setError('')

  try {
    if (initialSchedule) {
      const saved = await scheduleActions.save(
        initialSchedule,
        schedule,
        draft.category?.label,
      )

      if (!saved) return

      navigate(
        `/schedules/${encodeURIComponent(initialSchedule.id)}`,
        { replace: true },
      )

      return
    }

    const scheduleId = await serverSchedule.save(
      schedule,
      draft.category?.label,
    )

    if (!scheduleId) return

    navigate(
      `/?date=${schedule.date}`,
      { replace: true },
    )
  } catch (caught) {
    if (isAxiosError<{ message?: unknown }>(caught)) {
      const message = caught.response?.data?.message

      setError(
        typeof message === 'string' && message.trim()
          ? message
          : caught.response
            ? '일정을 저장하지 못했어요.'
            : '서버에 연결하지 못했어요.',
      )
    } else {
      setError(
        caught instanceof Error
          ? caught.message
          : '일정을 저장하지 못했어요.',
      )
    }
  }
}}
      >
        <S.Field>
          <S.Label htmlFor="schedule-title">
            제목
            <S.Required aria-hidden="true">*</S.Required>
          </S.Label>

          <S.Input
            id="schedule-title"
            aria-label="제목"
            required
            maxLength={80}
            placeholder="일정 제목을 입력해 주세요"
            value={draft.title}
            onChange={event => update('title', event.target.value)}
          />
        </S.Field>

        <ColorPicker
          value={draft.color}
          onChange={color => update('color', color)}
        />

        <S.CategoryButton
          type="button"
          aria-haspopup="dialog"
          aria-expanded={categoryOpen}
          aria-label={`카테고리 (필수): ${
            draft.category?.label ?? '선택해 주세요'
          }`}
          onClick={() => setCategoryOpen(true)}
        >
          <span>카테고리<S.Required aria-hidden="true">*</S.Required></span>

          <S.CategoryValue $chosen={Boolean(draft.category)}>
            {draft.category?.label ?? '선택해 주세요'} ▾
          </S.CategoryValue>
        </S.CategoryButton>

        <S.DateCard aria-label="일정 일시">
          <S.ToggleRow>
            <span>종일</span>

            <S.Switch
              type="button"
              role="switch"
              aria-label="종일"
              aria-checked={draft.allDay}
              $checked={draft.allDay}
              onClick={() => update('allDay', !draft.allDay)}
            />
          </S.ToggleRow>

          <S.Divider />

          <DateTimeRow
            label="시작"
            date={draft.date}
            time={draft.startTime}
            allDay={draft.allDay}
            onDateChange={value => update('date', value)}
            onTimeChange={value => update('startTime', value)}
          />

          <DateTimeRow
            label="종료"
            date={draft.endDate}
            time={draft.endTime}
            allDay={draft.allDay}
            onDateChange={value => update('endDate', value)}
            onTimeChange={value => update('endTime', value)}
          />

          <S.Description>
            시간은 선택 사항이에요. 모두 비우면 종일 일정으로 등록돼요.
            한쪽만 입력하면 빈 시작은 00:00, 빈 종료는 23:59로 저장돼요.
          </S.Description>

          {invalidRange && (
            <S.Error role="alert">
              종료 일시는 시작 일시보다 빠를 수 없어요.
            </S.Error>
          )}
        </S.DateCard>

        <S.Field>
          <S.Label htmlFor="schedule-venue">
            장소
          </S.Label>

          <S.Input
            id="schedule-venue"
            maxLength={100}
            placeholder="장소를 입력해 주세요 (선택)"
            value={draft.venue}
            onChange={event => update('venue', event.target.value)}
          />
        </S.Field>

        <S.OperationCard aria-label="운영 공간 옵션">
          <S.ToggleRow>
            <span>운영 공간 함께 만들기</span>

            <S.Switch
              type="button"
              role="switch"
              aria-label="운영 공간 함께 만들기"
              aria-checked={draft.createOperationSpace}
              $checked={draft.createOperationSpace}
              onClick={() =>
                update(
                  'createOperationSpace',
                  !draft.createOperationSpace,
                )
              }
              disabled={
  busy ||
  (
    !!initialSchedule &&
    initialSchedule.operationMenuCount !== undefined
  )
}
            />
          </S.ToggleRow>

          <S.Description>
            일정을 등록하면 이 일정의 운영 공간이 함께 만들어져요.
            <br />
            등록 전에는 운영 공간이 생성되지 않아요.
          </S.Description>
        </S.OperationCard>

        {initialSchedule && (
          <S.DeleteButton
            type="button"
            disabled={busy}
            onClick={() => setDeleteOpen(true)}
          >
            일정 삭제하기
          </S.DeleteButton>
        )}

        {error && (
          <S.Error role="alert">
            {error}
          </S.Error>
        )}
      </S.Form>

      <S.ActionBar>
        <S.SubmitButton
  type="submit"
  form="schedule-create-form"
  disabled={!canSubmit || busy}
>
  {busy
    ? '저장 중…'
    : initialSchedule
      ? '수정하기'
      : '일정 등록하기'}
</S.SubmitButton>
      </S.ActionBar>

      <ConfirmDialog
  open={deleteOpen}
  title="일정을 삭제할까요?"
  description={<>일정과 연결된 운영 데이터,<br />이 일정에서 만든 회의록도 함께 삭제돼요.</>}
  confirmText="삭제하기"
  onCancel={() => {
    if (!busy) setDeleteOpen(false)
  }}
  onConfirm={async () => {
    if (!initialSchedule || busy) return

    const deleted = await scheduleActions.remove(
      initialSchedule.id,
    )

    if (!deleted) return

    navigate('/', { replace: true })
  }}
/>

      {categoryOpen && (
        <CategorySheet
  selectedId={draft.category?.id}
  selectedName={draft.category?.label}
  onSelect={category => update('category', category)}
  onClose={() => setCategoryOpen(false)}
/>
      )}
    </S.Page>
  )
}