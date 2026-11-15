import { useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { isAxiosError } from 'axios'
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router'

import { useGetSchedule } from '../../api/generated'

import Header from '../../layouts/Header'
import CategorySheet from '../../components/meetings/MeetingCategorySheet'
import ConfirmDialog from '../../components/common/ConfirmDialog'

import useMeetings from '../../hooks/meetings/useMeetings'
import useCreateServerMeeting from '../../hooks/meetings/useCreateServerMeeting'
import useMeetingCategoriesApi from '../../hooks/meetings/useMeetingCategoriesApi'
import MeetingDetailPage from './MeetingDetailPage'

import {
  meetingListPath,
  newAgenda,
} from '../../utils/meetings/store'

import type {
  Meeting,
  MeetingAgenda,
} from '../../types/meetings/meeting'
import type { CategoryOption } from '../../types/schedules/schedule'

import calendarIcon from '../../assets/schedules/calendar.svg'
import chevronIcon from '../../assets/schedules/date-chevron.svg'

import * as S from '../../styles/meetings/MeetingPage.styles'

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

function MeetingForm({
  meeting,
  sourceScheduleId,
}: {
  meeting?: Meeting
  sourceScheduleId?: string
}) {
  const navigate = useNavigate()

  const { update, remove } = useMeetings()
  const serverMeeting = useCreateServerMeeting()
  const { categories } = useMeetingCategoriesApi()

  const returnPath = sourceScheduleId
    ? `/schedules/${encodeURIComponent(sourceScheduleId)}`
    : meetingListPath(meeting)

  const [title, setTitle] = useState(meeting?.title ?? '')
  const [date, setDate] = useState(meeting?.date ?? '')

  const [category, setCategory] = useState<CategoryOption | null>(
    meeting?.categoryName
      ? categories.find(
          item => item.label === meeting.categoryName,
        ) ?? {
          id: meeting.categoryName,
          label: meeting.categoryName,
          kind: 'custom',
        }
      : null,
  )

  const [participants, setParticipants] = useState(
    meeting?.participants ?? '',
  )

  const [agendas, setAgendas] = useState<MeetingAgenda[]>(
    () => meeting?.agendas ?? [newAgenda()],
  )

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState('')

  const pending = serverMeeting.pending

  const canSubmit = Boolean(
    title.trim() &&
    date &&
    category &&
    agendas[0]?.preparation.trim(),
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit || pending || !category) return

    setError('')

    try {
      if (meeting) {
        // 수정 API는 다음 단계에서 연결합니다.
        update(meeting.id, {
          title: title.trim(),
          date,
          categoryName: category.label,
          participants: participants.trim(),
          agendas: agendas.map(agenda => ({
            ...agenda,
            preparation: agenda.preparation.trim(),
          })),
        })

        navigate(returnPath, { replace: true })
        return
      }

      const meetingId = await serverMeeting.save({
        title,
        date,
        categoryId: Number(category.id),
        participants,
        agendas: agendas.map(agenda => agenda.preparation),
        scheduleId: sourceScheduleId,
      })

      if (!meetingId) return

      navigate(
        sourceScheduleId
          ? `/schedules/${encodeURIComponent(sourceScheduleId)}`
          : '/operations?type=minute',
        { replace: true },
      )
    } catch (caught) {
      if (isAxiosError<{ message?: unknown }>(caught)) {
        const message = caught.response?.data?.message

        setError(
          typeof message === 'string' && message.trim()
            ? message
            : caught.response
              ? '회의를 저장하지 못했어요.'
              : '서버에 연결하지 못했어요.',
        )
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : '회의를 저장하지 못했어요.',
        )
      }
    }
  }

  return (
    <S.Page>
      <Header
        title="회의 만들기"
        onBack={() => {
          if (!pending) navigate(returnPath)
        }}
      />

      <S.Content>
        <S.Form onSubmit={submit}>
          <S.Card>
            <S.Row>
              <label htmlFor="meeting-title">
                회의 제목 <S.Required>*</S.Required>
              </label>

              <input
                aria-label="회의 제목"
                id="meeting-title"
                required
                maxLength={80}
                placeholder="회의 제목을 입력해주세요"
                value={title}
                disabled={pending}
                onChange={event => setTitle(event.target.value)}
              />
            </S.Row>

            <S.DateRow>
              <label htmlFor="meeting-date">
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
                aria-label="회의 날짜"
                id="meeting-date"
                type="date"
                required
                value={date}
                disabled={pending}
                onClick={openDatePicker}
                onChange={event => setDate(event.target.value)}
              />
            </S.DateRow>

            <S.Row>
              <span id="meeting-category-label">
                카테고리 <S.Required>*</S.Required>
              </span>

              <S.Category
                type="button"
                aria-label={`카테고리: ${
                  category?.label ?? '선택해 주세요'
                }`}
                aria-haspopup="dialog"
                aria-expanded={categoryOpen}
                disabled={pending}
                onClick={() => setCategoryOpen(true)}
              >
                {category?.label ?? ''}

                <img
                  src={chevronIcon}
                  alt=""
                  width={21}
                  height={21}
                />
              </S.Category>
            </S.Row>

            <S.Row>
              <label htmlFor="meeting-participants">
                참석자
              </label>

              <input
                id="meeting-participants"
                maxLength={300}
                placeholder="예: 김가은, 홍보팀"
                value={participants}
                disabled={pending}
                onChange={event =>
                  setParticipants(event.target.value)
                }
              />
            </S.Row>

            {agendas.map((agenda, index) => (
              <S.Agenda
                key={agenda.id}
                aria-label={`안건 ${index + 1}`}
              >
                <S.AgendaHeading>
                  <label htmlFor={`agenda-${agenda.id}`}>
                    안건 {index + 1}{' '}
                    {index === 0 && (
                      <S.Required>*</S.Required>
                    )}
                  </label>

                  <S.Counter>
                    {index > 0 && (
                      <>
                        <button
                          type="button"
                          aria-label={`안건 ${index + 1} 삭제`}
                          disabled={pending}
                          onClick={() =>
                            setAgendas(current =>
                              current.filter(
                                value => value.id !== agenda.id,
                              ),
                            )
                          }
                        >
                          삭제
                        </button>

                        <span>|</span>
                      </>
                    )}

                    <span>
                      {agenda.preparation.length}/100
                    </span>
                  </S.Counter>
                </S.AgendaHeading>

                <S.Textarea
                  aria-label={`안건 ${index + 1}`}
                  id={`agenda-${agenda.id}`}
                  required={index === 0}
                  maxLength={100}
                  placeholder="준비 사항, 아이디어, 결정 사항을 자유롭게 기록해 주세요."
                  value={agenda.preparation}
                  disabled={pending}
                  onChange={event =>
                    setAgendas(current =>
                      current.map(value =>
                        value.id === agenda.id
                          ? {
                              ...value,
                              preparation: event.target.value,
                            }
                          : value,
                      ),
                    )
                  }
                />
              </S.Agenda>
            ))}

            <S.AddWrap>
              <S.OutlineButton
                type="button"
                disabled={pending}
                onClick={() =>
                  setAgendas(current => [
                    ...current,
                    newAgenda(),
                  ])
                }
              >
                + 안건 추가
              </S.OutlineButton>
            </S.AddWrap>
          </S.Card>

          {error && (
            <S.Error role="alert">
              {error}
            </S.Error>
          )}

          <S.Submit
            type="submit"
            disabled={!canSubmit || pending}
          >
            {pending
              ? '저장 중…'
              : meeting
                ? '수정하기'
                : '등록하기'}
          </S.Submit>

          {meeting && (
            <S.OutlineButton
              type="button"
              $danger
              disabled={pending}
              onClick={() => setDeleteOpen(true)}
            >
              삭제하기
            </S.OutlineButton>
          )}
        </S.Form>
      </S.Content>

      {categoryOpen && (
        <CategorySheet
          selectedId={category?.id}
          selectedName={category?.label}
          onSelect={setCategory}
          onClose={() => setCategoryOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="회의록을 삭제할까요?"
        description="안건과 논의 내용도 함께 삭제되며 복구할 수 없어요."
        confirmText="삭제하기"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          // 삭제 API는 다음 단계에서 연결합니다.
          if (!meeting) return

          remove(meeting.id)

          navigate('/operations?type=minute', {
            replace: true,
          })
        }}
      />
    </S.Page>
  )
}

export default function MeetingFormPage() {
  const { meetingId } = useParams()

  return meetingId
    ? <MeetingDetailPage />
    : <NewMeetingRoute />
}

function NewMeetingRoute() {
  const [params] = useSearchParams()

  const sourceScheduleId =
    params.get('scheduleId') || undefined

  const numericScheduleId = Number(sourceScheduleId)

  const validScheduleId =
    !!sourceScheduleId &&
    /^\d+$/.test(sourceScheduleId) &&
    Number.isSafeInteger(numericScheduleId) &&
    numericScheduleId > 0

  const sourceQuery = useGetSchedule(
    validScheduleId ? numericScheduleId : 0,
    {
      query: {
        enabled: validScheduleId,
        retry: false,
      },
      axios: {
        timeout: 15000,
      },
    },
  )

  if (sourceScheduleId && sourceQuery.isLoading) {
    return (
      <S.Page>
        <Header title="회의 만들기" />

        <S.Notice>
          <p role="status">
            연결할 일정을 확인하는 중이에요.
          </p>
        </S.Notice>
      </S.Page>
    )
  }

  if (
    sourceScheduleId &&
    (
      !validScheduleId ||
      sourceQuery.isError ||
      sourceQuery.data?.data.success !== true ||
      sourceQuery.data?.data.data?.scheduleId !== numericScheduleId
    )
  ) {
    return (
      <S.Page>
        <Header title="회의 만들기" />

        <S.Notice>
          <h1>연결할 일정을 확인할 수 없어요</h1>

          <Link to="/operations?type=minute">
            회의록 목록으로 이동
          </Link>
        </S.Notice>
      </S.Page>
    )
  }

  return (
    <MeetingForm
      key={sourceScheduleId ?? 'new'}
      sourceScheduleId={sourceScheduleId}
    />
  )
}