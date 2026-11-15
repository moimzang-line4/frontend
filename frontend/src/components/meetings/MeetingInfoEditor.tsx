import { useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import {
  getGetMeetingDetailQueryKey,
  getListMeetingsQueryKey,
  useDeleteMeeting,
  useUpdateMeeting,
} from '../../api/generated'

import type { MeetingDetailResponse } from '../../api/models/meetingDetailResponse'

import ConfirmDialog from '../common/ConfirmDialog'
import MeetingCategorySheet from './MeetingCategorySheet'

import useOnboarding from '../../hooks/onboarding/useOnboarding'
import useMeetingCategoriesApi from '../../hooks/meetings/useMeetingCategoriesApi'

import calendarIcon from '../../assets/schedules/calendar.svg'
import chevronIcon from '../../assets/schedules/date-chevron.svg'

import * as S from '../../styles/meetings/MeetingPage.styles'

type Props = {
  meetingId: number
  meeting: MeetingDetailResponse
  onDeleted: () => void
}

function errorMessage(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message

    if (typeof message === 'string' && message.trim()) {
      return message
    }

    return caught.response
      ? '요청을 처리하지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '요청을 처리하지 못했어요.'
}

function openDatePicker(event: MouseEvent<HTMLInputElement>) {
  const input = event.currentTarget

  if (typeof input.showPicker !== 'function') return

  try {
    input.focus()
    input.showPicker()
    event.preventDefault()
  } catch {
    input.focus()
  }
}

export default function MeetingInfoEditor({
  meetingId,
  meeting,
  onDeleted,
}: Props) {
  const queryClient = useQueryClient()
  const { group } = useOnboarding()
  const categoriesApi = useMeetingCategoriesApi()

  const updateMutation = useUpdateMeeting({
    mutation: { retry: false },
    axios: { timeout: 15000 },
  })

  const deleteMutation = useDeleteMeeting({
    mutation: { retry: false },
    axios: { timeout: 15000 },
  })

  const [title, setTitle] = useState(meeting.title ?? '')
  const [date, setDate] = useState(meeting.meetingDate ?? '')
  const [attendees, setAttendees] = useState(
    meeting.attendees ?? '',
  )
  const [categoryId, setCategoryId] = useState<number | null>(
    meeting.categoryId ?? null,
  )

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const busy = useRef(false)

  const category = categoriesApi.categories.find(
    item => item.id === String(categoryId),
  )

  async function refreshLists() {
    const tasks = [
      queryClient.invalidateQueries({
        queryKey: ['operation-records'],
      }),
    ]

    const termId = group?.termId

    if (
      typeof termId === 'number' &&
      Number.isSafeInteger(termId) &&
      termId > 0
    ) {
      tasks.push(
        queryClient.invalidateQueries({
          queryKey: getListMeetingsQueryKey(termId),
        }),
      )
    }

    await Promise.all(tasks)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (busy.current || !title.trim() || !date) return

    busy.current = true
    setPending(true)
    setError('')

    try {
      const response = await updateMutation.mutateAsync({
        meetingId,
        data: {
          title: title.trim(),
          meetingDate: date,
          categoryId: categoryId ?? undefined,
          attendees: attendees.trim(),
        },
      })

      const body = response.data

      if (
        body.success !== true ||
        body.data?.meetingId !== meetingId
      ) {
        throw new Error(
          body.message || '회의 정보를 수정하지 못했어요.',
        )
      }

      await Promise.all([
        refreshLists(),
        queryClient.invalidateQueries({
          queryKey: getGetMeetingDetailQueryKey(meetingId),
        }),
      ])
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  async function remove() {
    if (busy.current) return

    busy.current = true
    setPending(true)

    try {
      const response = await deleteMutation.mutateAsync({
        meetingId,
      })

      if (response.data.success !== true) {
        throw new Error(
          response.data.message || '회의를 삭제하지 못했어요.',
        )
      }

      const queryKey = getGetMeetingDetailQueryKey(meetingId)

      await queryClient.cancelQueries({
        queryKey,
        exact: true,
      })

      queryClient.removeQueries({
        queryKey,
        exact: true,
      })

      // 목록을 갱신하고 상세 화면에서 나갑니다.
      void refreshLists()
      onDeleted()
    } catch (caught) {
      // 기존 ConfirmDialog 안에 오류가 표시돼요.
      throw new Error(errorMessage(caught))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <>
      <S.Form onSubmit={submit}>
        <S.Card>
          <S.Row>
            <label htmlFor="edit-meeting-title">
              회의 제목 <S.Required>*</S.Required>
            </label>

            <input
              id="edit-meeting-title"
              required
              maxLength={100}
              value={title}
              disabled={pending}
              onChange={event => setTitle(event.target.value)}
            />
          </S.Row>

          <S.DateRow>
            <label htmlFor="edit-meeting-date">
              회의 날짜 <S.Required>*</S.Required>
            </label>

            <S.Picker aria-hidden="true">
              <span>
                <img
                  src={calendarIcon}
                  alt=""
                  width={18}
                  height={18}
                />
                {date || '날짜 선택'}
              </span>

              <img
                src={chevronIcon}
                alt=""
                width={21}
                height={21}
              />
            </S.Picker>

            <S.DateInput
              id="edit-meeting-date"
              aria-label="회의 날짜"
              type="date"
              required
              value={date}
              disabled={pending}
              onClick={openDatePicker}
              onChange={event => setDate(event.target.value)}
            />
          </S.DateRow>

          <S.Row>
            <span>카테고리</span>

            <S.Category
              type="button"
              aria-label={`카테고리: ${
                category?.label ?? '선택해 주세요'
              }`}
              aria-haspopup="dialog"
              aria-expanded={categoryOpen}
              disabled={pending || categoriesApi.loading}
              onClick={() => setCategoryOpen(true)}
            >
              {categoriesApi.loading
                ? '불러오는 중…'
                : category?.label ?? '선택해 주세요'}

              <img
                src={chevronIcon}
                alt=""
                width={21}
                height={21}
              />
            </S.Category>
          </S.Row>

          <S.Row>
            <label htmlFor="edit-meeting-attendees">
              참석자
            </label>

            <input
              id="edit-meeting-attendees"
              maxLength={500}
              value={attendees}
              disabled={pending}
              onChange={event =>
                setAttendees(event.target.value)
              }
            />
          </S.Row>
        </S.Card>

        {error && <S.Error role="alert">{error}</S.Error>}

        <S.Submit
          type="submit"
          disabled={!title.trim() || !date || pending}
        >
          {pending ? '처리 중…' : '수정하기'}
        </S.Submit>

        <S.OutlineButton
          type="button"
          $danger
          disabled={pending}
          onClick={() => setDeleteOpen(true)}
        >
          회의록 삭제하기
        </S.OutlineButton>
      </S.Form>

      {categoryOpen && (
        <MeetingCategorySheet
          selectedId={
            categoryId === null
              ? undefined
              : String(categoryId)
          }
          selectedName={category?.label}
          onSelect={option => {
            setCategoryId(Number(option.id))
          }}
          onClose={() => setCategoryOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="회의록을 삭제할까요?"
        description="회의록과 안건의 논의 내용·결정 사항이 함께 삭제되며 복구할 수 없어요."
        confirmText="삭제하기"
        onCancel={() => {
          if (!pending) setDeleteOpen(false)
        }}
        onConfirm={remove}
      />
    </>
  )
}