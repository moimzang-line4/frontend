import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams, useLocation} from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'

import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import MeetingCategorySheet from '../../components/meetings/MeetingCategorySheet'
import useMeetingCategoriesApi from '../../hooks/meetings/useMeetingCategoriesApi'

import {
  addAgenda,
  deleteAgenda,
  deleteMeeting,
  getGetMeetingDetailQueryKey,
  updateAgendaContent,
  updateMeeting,
  useGetMeetingDetail,
} from '../../api/generated'

import {
  meetingError,
  readServerMeeting,
} from '../../utils/meetings/serverMeeting'

import type { ServerMeeting } from '../../utils/meetings/serverMeeting'

import calendarIcon from '../../assets/meetings/calendar.svg'
import chevronIcon from '../../assets/meetings/form-chevron.svg'

import * as S from '../../styles/meetings/MeetingPage.styles'

const Content = styled(S.Content)`
  padding-top: 24px;
`

const Fields = styled.fieldset`
  display: contents;

  &:disabled button {
    cursor: default;
  }
`

type DraftAgenda = {
  key: string
  id?: number
  content: string
}

function Editor({ meeting }: { meeting: ServerMeeting }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const categoriesApi = useMeetingCategoriesApi()
  const location = useLocation()

const returnTo = (
  location.state as { returnTo?: unknown } | null
)?.returnTo

  const [title, setTitle] = useState(meeting.title)
  const [date, setDate] = useState(meeting.meetingDate)
  const [attendees, setAttendees] = useState(meeting.attendees ?? '')
  const [categoryId, setCategoryId] = useState(meeting.categoryId)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const [agendas, setAgendas] = useState<DraftAgenda[]>(() =>
    meeting.agendas.map(item => ({
      key: String(item.agendaId),
      id: item.agendaId,
      content: item.content,
    })),
  )

  const busy = useRef(false)
  const removed = useRef(new Set<number>())

  const savedContents = useRef(
    new Map(
      meeting.agendas.map(item => [
        item.agendaId,
        item.content,
      ]),
    ),
  )

  const originalMeeting = useRef(meeting).current
  const finished = meeting.status === 'COMPLETED'

  const hasChanges =
    title.trim() !== originalMeeting.title.trim() ||
    date !== originalMeeting.meetingDate ||
    attendees.trim() !== (originalMeeting.attendees ?? '').trim() ||
    categoryId !== originalMeeting.categoryId ||
    agendas.length !== originalMeeting.agendas.length ||
    agendas.some((item, index) => {
      const original = originalMeeting.agendas[index]

      return (
        !original ||
        item.id !== original.agendaId ||
        item.content.trim() !== original.content.trim()
      )
    })

  const category = categoriesApi.categories.find(
    item => Number(item.id) === categoryId,
  )

  const backPath =
  typeof returnTo === 'string' &&
  /^\/schedules\/[1-9]\d*$/.test(returnTo)
    ? returnTo
    : meeting.status === 'COMPLETED'
      ? '/operations?type=minute&period=past'
      : '/operations?type=minute'

  // 아래에 기존 async function refresh()부터 이어집니다.

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetMeetingDetailQueryKey(meeting.meetingId),
      }),

      queryClient.invalidateQueries({
        queryKey: ['operation-records'],
      }),

      queryClient.invalidateQueries({
        predicate: query =>
          typeof query.queryKey[0] === 'string' &&
          /^https:\/\/api\.chungs\.store\/api\/terms\/\d+\/meetings$/.test(
            query.queryKey[0],
          ),
      }),
    ])
  }

  function removeAgenda(item: DraftAgenda) {
    if (pending || agendas.length <= 1) return

    if (item.id !== undefined) {
      removed.current.add(item.id)
    }

    setAgendas(current =>
      current.filter(agenda => agenda.key !== item.key),
    )
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (busy.current) return

    if (!title.trim() || title.trim().length > 100 || !date) {
      setError('회의 제목과 날짜를 확인해주세요.')
      return
    }

    if (
      typeof categoryId !== 'number' ||
      !Number.isSafeInteger(categoryId) ||
      categoryId <= 0
    ) {
      setError('카테고리를 선택해주세요.')
      return
    }

    if (
      attendees.length > 500 ||
      !agendas.length ||
      agendas.some(
        item => !item.content.trim() || item.content.trim().length > 100,
      )
    ) {
      setError('참석자는 500자, 각 안건은 1~100자로 입력해주세요.')
      return
    }

    busy.current = true
    setPending(true)
    setError('')

    const working = agendas.map(item => ({
      ...item,
      content: item.content.trim(),
    }))

    let succeeded = false

    try {
      const response = await updateMeeting(
        meeting.meetingId,
        {
          title: title.trim(),
          meetingDate: date,
          categoryId,
          attendees: attendees.trim(),
        },
        { timeout: 15000 },
      )

      if (
        response.data.success !== true ||
        response.data.data?.meetingId !== meeting.meetingId
      ) {
        throw new Error(
          response.data.message || '회의 정보를 수정하지 못했어요.',
        )
      }

      for (const item of working) {
        if (item.id === undefined) {
          const added = await addAgenda(
            meeting.meetingId,
            { content: item.content },
            { timeout: 15000 },
          )

          const id = added.data.data?.agendaId

          if (
            added.data.success !== true ||
            typeof id !== 'number' ||
            !Number.isSafeInteger(id) ||
            id <= 0
          ) {
            throw new Error(
              added.data.message || '안건을 추가하지 못했어요.',
            )
          }

          item.id = id
          savedContents.current.set(id, item.content)
        } else if (savedContents.current.get(item.id) !== item.content) {
          const updated = await updateAgendaContent(
            item.id,
            { content: item.content },
            { timeout: 15000 },
          )

          if (
            updated.data.success !== true ||
            updated.data.data?.agendaId !== item.id
          ) {
            throw new Error(
              updated.data.message || '안건을 수정하지 못했어요.',
            )
          }

          savedContents.current.set(item.id, item.content)
        }
      }

      for (const id of [...removed.current]) {
        const deleted = await deleteAgenda(id, {
          timeout: 15000,
        })

        if (deleted.data.success !== true) {
          throw new Error(
            deleted.data.message || '안건을 삭제하지 못했어요.',
          )
        }

        removed.current.delete(id)
        savedContents.current.delete(id)
      }

      succeeded = true
    } catch (caught) {
      setError(meetingError(caught))
    } finally {
      setAgendas(working)
      await refresh()

      busy.current = false
      setPending(false)
    }

    if (succeeded) {
      navigate(backPath, { replace: true })
    }
  }

  async function removeMeeting() {
  if (pending) return

  setPending(true)

  try {
    const response = await deleteMeeting(meeting.meetingId, {
      timeout: 15000,
    })

    if (response.data.success !== true) {
      throw new Error(
        response.data.message || '회의록을 삭제하지 못했어요.',
      )
    }

    await queryClient.cancelQueries({
      queryKey: getGetMeetingDetailQueryKey(meeting.meetingId),
    })

    navigate('/operations?type=minute', {
      replace: true,
    })

    queryClient.removeQueries({
      queryKey: getGetMeetingDetailQueryKey(meeting.meetingId),
    })

    await refresh()
  } catch (caught) {
    throw new Error(meetingError(caught))
  } finally {
    setPending(false)
  }
}

  return (
    <S.Page>
      <Header
        title="회의"
        onBack={() => {
          if (!pending) navigate(backPath)
        }}
      />

      <Content>
        <S.Form
          onSubmit={event => void submit(event)}
          aria-busy={pending}
        >
          <Fields disabled={pending || finished}>
            <S.Card>
              <S.Row>
                <label htmlFor="meeting-title">
                  회의 제목 <S.Required>*</S.Required>
                </label>

                <input
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

                <S.Picker>
                  <span>
                    <img
                      src={calendarIcon}
                      alt=""
                      width={20}
                      height={20}
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
                  id="meeting-date"
                  type="date"
                  required
                  value={date}
                  onClick={event => {
                    try {
                      event.currentTarget.showPicker?.()
                    } catch {
                      /* 브라우저 기본 선택창 사용 */
                    }
                  }}
                  onChange={event => setDate(event.target.value)}
                />
              </S.DateRow>

              <S.Row>
                <span id="meeting-category-label">
                  카테고리 <S.Required>*</S.Required>
                </span>

                <S.Category
                  type="button"
                  aria-labelledby="meeting-category-label meeting-category-value"
                  aria-haspopup="dialog"
                  aria-expanded={categoryOpen}
                  onClick={() => setCategoryOpen(true)}
                >
                  <span id="meeting-category-value">
                    {category?.label ??
                      (categoriesApi.loading ? '불러오는 중…' : '')}
                  </span>

                  <img
                    src={chevronIcon}
                    alt=""
                    width={21}
                    height={21}
                  />
                </S.Category>
              </S.Row>

              <S.Row>
                <label htmlFor="meeting-attendees">
                  참석자
                </label>

                <input
                  id="meeting-attendees"
                  maxLength={500}
                  value={attendees}
                  onChange={event => setAttendees(event.target.value)}
                />
              </S.Row>

              {agendas.map((item, index) => (
                <S.Agenda key={item.key}>
                  <S.AgendaHeading>
                    <label htmlFor={`agenda-${item.key}`}>
                      안건 {index + 1}{' '}
                      {index === 0 && <S.Required>*</S.Required>}
                    </label>

                    <S.Counter>
                      {!finished && index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeAgenda(item)}
                        >
                          삭제
                        </button>
                      )}

                      <span>{item.content.length}/100</span>
                    </S.Counter>
                  </S.AgendaHeading>

                  <S.Textarea
                    aria-label={`안건 ${index + 1}`}
                    id={`agenda-${item.key}`}
                    required
                    maxLength={100}
                    value={item.content}
                    onChange={event => {
                      const content = event.target.value

                      setAgendas(current =>
                        current.map(agenda =>
                          agenda.key === item.key
                            ? { ...agenda, content }
                            : agenda,
                        ),
                      )
                    }}
                  />
                </S.Agenda>
              ))}

              {!finished && (
  <S.AddWrap>
    <S.OutlineButton
      type="button"
      onClick={() =>
        setAgendas(current => [
          ...current,
          { key: crypto.randomUUID(), content: '' },
        ])
      }
    >
      + 안건 추가
    </S.OutlineButton>
  </S.AddWrap>
)}
            </S.Card>

            {(error || categoriesApi.errorMessage) && (
              <S.Error role="alert">
                {error || categoriesApi.errorMessage}
              </S.Error>
            )}

            {categoriesApi.errorMessage && categoriesApi.canRetry && (
              <S.OutlineButton
                type="button"
                onClick={() => void categoriesApi.reload()}
              >
                카테고리 다시 불러오기
              </S.OutlineButton>
            )}

           {!finished && (
  <>
    <S.Submit
  type="submit"
  disabled={pending || finished || !hasChanges}
>
  {pending ? '저장 중…' : '수정하기'}
</S.Submit>

    <S.OutlineButton
  type="button"
  $danger
  disabled={pending || finished}
  onClick={() => setDeleteOpen(true)}
>
  삭제하기
</S.OutlineButton>
  </>
)}
          </Fields>
        </S.Form>
      </Content>

      {categoryOpen && (
        <MeetingCategorySheet
          selectedId={
            categoryId === undefined
              ? undefined
              : String(categoryId)
          }
          onSelect={option => {
            setCategoryId(Number(option.id))
          }}
          onClose={() => setCategoryOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="회의록을 삭제할까요?"
        description="삭제한 회의록과 안건은 복구할 수 없어요."
        confirmText="삭제하기"
        onCancel={() => {
          if (!pending) setDeleteOpen(false)
        }}
        onConfirm={removeMeeting}
      />
    </S.Page>
  )
}

export default function MeetingDetailPage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()

  const id = Number(meetingId)

  const validId =
    !!meetingId &&
    /^\d+$/.test(meetingId) &&
    Number.isSafeInteger(id) &&
    id > 0

  const query = useGetMeetingDetail(validId ? id : 0, {
    query: {
      enabled: validId,
      retry: false,
      staleTime: 30_000,

      select: response => {
        const meeting = readServerMeeting(response)

        if (meeting.meetingId !== id) {
          throw new Error('회의 ID를 확인할 수 없어요.')
        }

        return meeting
      },
    },

    axios: {
      timeout: 15000,
    },
  })

  if (query.data) {
    return (
      <Editor
        key={query.data.meetingId}
        meeting={query.data}
      />
    )
  }

  return (
    <S.Page>
      <Header
        title="회의 만들기"
        onBack={() => navigate('/operations?type=minute')}
      />

      <S.Notice>
        {query.isLoading ? (
          <p role="status">
            회의록을 불러오는 중이에요.
          </p>
        ) : (
          <>
            <p role="alert">
              {!validId
                ? '올바른 회의 ID가 아니에요.'
                : query.error
                  ? meetingError(query.error)
                  : '회의록을 찾을 수 없어요.'}
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