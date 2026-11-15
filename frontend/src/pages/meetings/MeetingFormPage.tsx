import { useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router'

import Header from '../../layouts/Header'
import CategorySheet from '../../components/meetings/MeetingCategorySheet'
import MeetingDetailPage from './MeetingDetailPage'

import { useGetSchedule } from '../../api/generated'
import useCreateServerMeeting from '../../hooks/meetings/useCreateServerMeeting'

import { newAgenda } from '../../utils/meetings/store'

import type { MeetingAgenda } from '../../types/meetings/meeting'
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
  sourceScheduleId,
}: {
  sourceScheduleId?: string
}) {
  const navigate = useNavigate()
  const { save, pending } = useCreateServerMeeting()

  const returnPath = sourceScheduleId
    ? `/schedules/${encodeURIComponent(sourceScheduleId)}`
    : '/operations?type=minute'

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  const [category, setCategory] = useState<CategoryOption | null>(null)
  const [participants, setParticipants] = useState('')

  const [agendas, setAgendas] = useState<MeetingAgenda[]>(
    () => [newAgenda()],
  )

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = !!(
    title.trim() &&
    date &&
    category &&
    agendas[0]?.preparation.trim()
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit || pending || !category) return

    setError('')

    try {
      await save({
        title,
        date,
        categoryId: category.id,
        participants,
        agendas: agendas.map(agenda => agenda.preparation),
        scheduleId: sourceScheduleId,
      })

      navigate(returnPath, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : '회의록을 저장하지 못했어요.',
      )
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
        <S.Form
          onSubmit={event => void submit(event)}
          aria-busy={pending}
        >
          <fieldset
            disabled={pending}
            style={{ display: 'contents' }}
          >
            <S.Card>
              <S.Row>
                <label htmlFor="meeting-title">
                  회의 제목 <S.Required>*</S.Required>
                </label>

                <input
                  aria-label="회의 제목"
                  id="meeting-title"
                  required
                  maxLength={100}
                  value={title}
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
                  aria-label={`카테고리: ${category?.label ?? '선택해 주세요'}`}
                  aria-haspopup="dialog"
                  aria-expanded={categoryOpen}
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
                  maxLength={500}
                  value={participants}
                  onChange={event => setParticipants(event.target.value)}
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
                      {index === 0 && <S.Required>*</S.Required>}
                    </label>

                    <S.Counter>
                      {index > 0 && (
                        <>
                          <button
                            type="button"
                            aria-label={`안건 ${index + 1} 삭제`}
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
                    value={agenda.preparation}
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
              {pending ? '저장 중…' : '등록하기'}
            </S.Submit>
          </fieldset>
        </S.Form>
      </S.Content>

      {categoryOpen && (
        <CategorySheet
          selectedId={category?.id}
          onSelect={setCategory}
          onClose={() => setCategoryOpen(false)}
        />
      )}
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

  const id = Number(sourceScheduleId)

  const validId =
    !!sourceScheduleId &&
    /^\d+$/.test(sourceScheduleId) &&
    Number.isSafeInteger(id) &&
    id > 0

  const query = useGetSchedule(validId ? id : 0, {
    query: {
      enabled: validId,
      retry: false,
    },

    axios: {
      timeout: 15000,
    },
  })

  if (
    sourceScheduleId &&
    (
      !validId ||
      query.isLoading ||
      query.isError ||
      query.data?.data.success !== true ||
      query.data.data.data?.scheduleId !== id
    )
  ) {
    return (
      <S.Page>
        <Header title="회의 만들기" />

        <S.Notice>
          {query.isLoading ? (
            <p role="status">
              일정을 불러오는 중이에요.
            </p>
          ) : (
            <>
              <p role="alert">
                연결할 일정을 불러오지 못했어요.
              </p>

              {validId && (
                <S.OutlineButton
                  type="button"
                  disabled={query.isFetching}
                  onClick={() => void query.refetch()}
                >
                  다시 불러오기
                </S.OutlineButton>
              )}

              <Link to="/operations?type=minute">
                회의록 목록으로 이동
              </Link>
            </>
          )}
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