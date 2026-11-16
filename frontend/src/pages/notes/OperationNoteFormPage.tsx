import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'

import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import NoteTypeSheet from '../../components/notes/NoteTypeSheet'
import NoteUnavailable from '../../components/notes/NoteUnavailable'

import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useServerOperationNotes from '../../hooks/notes/useServerOperationNotes'
import useCreateServerNote from '../../hooks/notes/useCreateServerNote'
import useServerNoteActions from '../../hooks/notes/useServerNoteActions'

import { noteTypeInfo } from '../../constants/notes/noteTypes'

import type {
  NoteType,
  OperationNote,
} from '../../types/notes/operationNote'

import chevronIcon from '../../assets/notes/chevron-down.svg'

import * as S from '../../styles/notes/NotesPage.styles'

function NoteForm({
  scheduleId,
  note,
}: {
  scheduleId: string
  note?: OperationNote
}) {
  const navigate = useNavigate()

  const {
    save,
    pending: creating,
  } = useCreateServerNote(scheduleId)

  const {
    update,
    remove,
    pending: changing,
  } = useServerNoteActions(scheduleId)

  const pending = creating || changing

  const [type, setType] = useState<NoteType | undefined>(
    note?.type,
  )
  const [title, setTitle] = useState(note?.title ?? '')
  const [assignee, setAssignee] = useState(note?.assignee ?? '')
  const [content, setContent] = useState(note?.content ?? '')

  const [typeOpen, setTypeOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState('')

  const listPath =
    `/schedules/${encodeURIComponent(scheduleId)}/operations/notes`

  const canSubmit = !!(
    type &&
    title.trim() &&
    content.trim()
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!type || !canSubmit || pending) return

    setError('')

    try {
      const values = {
        type,
        title,
        assignee,
        content,
      }

      if (note) {
        await update(note, values)
      } else {
        await save(values)
      }

      navigate(listPath, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : '메모를 저장하지 못했어요.',
      )
    }
  }

  return (
    <S.Page>
      <Header
        title="메모 작성"
        onBack={() => {
          if (!pending) navigate(listPath)
        }}
      />

      <S.FormContent>
        <S.Form
          onSubmit={event => void submit(event)}
          aria-busy={pending}
        >
          <fieldset
            disabled={pending}
            style={{ display: 'contents' }}
          >
            <S.FormCard>
              <S.Row>
                <span>
                  메모 유형 <S.Required>*</S.Required>
                </span>

                <S.TypeButton
                  type="button"
                  aria-label={`메모 유형: ${
                    type
                      ? noteTypeInfo(type).label
                      : '선택해 주세요'
                  }`}
                  aria-haspopup="dialog"
                  aria-expanded={typeOpen}
                  onClick={() => setTypeOpen(true)}
                >
                  {type
                    ? noteTypeInfo(type).label
                    : '선택해 주세요'}

                  <img
                    src={chevronIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                </S.TypeButton>
              </S.Row>

              <S.Row>
                <label htmlFor="note-title">
                  제목 <S.Required>*</S.Required>
                </label>

                <input
                  id="note-title"
                  aria-label="제목"
                  required
                  maxLength={100}
                  value={title}
                  onChange={event =>
                    setTitle(event.target.value)
                  }
                />
              </S.Row>

              <S.Row>
                <label htmlFor="note-assignee">
                  담당자
                </label>

                <input
                  id="note-assignee"
                  maxLength={50}
                  value={assignee}
                  onChange={event =>
                    setAssignee(event.target.value)
                  }
                />
              </S.Row>

              <S.BodyField>
                <S.BodyHeading>
                  <label htmlFor="note-content">
                    내용 <S.Required>*</S.Required>
                  </label>

                  <span>{content.length}/100</span>
                </S.BodyHeading>

                <S.Textarea
                  id="note-content"
                  aria-label="내용"
                  required
                  maxLength={100}
                  value={content}
                  onChange={event =>
                    setContent(event.target.value)
                  }
                />
              </S.BodyField>
            </S.FormCard>

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
                : note
                  ? '수정하기'
                  : '등록하기'}
            </S.Submit>

            {note && (
              <S.Delete
                type="button"
                disabled={pending}
                onClick={() => setDeleteOpen(true)}
              >
                삭제하기
              </S.Delete>
            )}
          </fieldset>
        </S.Form>
      </S.FormContent>

      {typeOpen && (
        <NoteTypeSheet
          selected={type}
          onSelect={setType}
          onClose={() => setTypeOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="메모를 삭제할까요?"
        description="삭제한 메모는 복구할 수 없어요."
        confirmText="삭제하기"
        onCancel={() => {
          if (!pending) setDeleteOpen(false)
        }}
        onConfirm={async () => {
          if (!note || pending) return

          await remove(note.id)

          navigate(listPath, { replace: true })
        }}
      />
    </S.Page>
  )
}

export default function OperationNoteFormPage() {
  const navigate = useNavigate()
  const { noteId } = useParams()

  const detail = useScheduleDetail()
  const { schedule } = detail

  const data = useServerOperationNotes(
    noteId && schedule?.operationMenuCount !== undefined
      ? schedule.id
      : '',
    'all',
    '',
  )

  const listPath = schedule
    ? `/schedules/${encodeURIComponent(schedule.id)}/operations/notes`
    : '/operations'

  if (!schedule) {
    return (
      <S.Page>
        <Header
          title="메모 작성"
          onBack={() => navigate('/operations')}
        />

        <S.Notice>
          {detail.loading ? (
            <p role="status">
              일정을 불러오는 중이에요.
            </p>
          ) : (
            <>
              <S.Error role="alert">
                {detail.errorMessage ||
                  '일정을 찾을 수 없어요.'}
              </S.Error>

              <S.Delete
                type="button"
                disabled={detail.refreshing}
                onClick={() => void detail.reload()}
              >
                다시 불러오기
              </S.Delete>
            </>
          )}
        </S.Notice>
      </S.Page>
    )
  }

  if (schedule.operationMenuCount === undefined) {
    return (
      <NoteUnavailable
        title="메모 작성"
        message="운영 메모를 사용할 일정을 찾을 수 없어요"
        backPath="/operations"
      />
    )
  }

  if (noteId && data.loading) {
    return (
      <S.Page>
        <Header
          title="메모 작성"
          onBack={() => navigate(listPath)}
        />

        <S.Notice>
          <p role="status">
            메모를 불러오는 중이에요.
          </p>
        </S.Notice>
      </S.Page>
    )
  }

  const note = noteId
    ? data.notes.find(item => item.id === noteId)
    : undefined

  if (noteId && !note) {
    return (
      <S.Page>
        <Header
          title="메모 작성"
          onBack={() => navigate(listPath)}
        />

        <S.Notice>
          <S.Error role="alert">
            {data.errorMessage ||
              '삭제되었거나 존재하지 않는 메모예요.'}
          </S.Error>

          <S.Delete
            type="button"
            disabled={data.refreshing}
            onClick={() => void data.reload()}
          >
            다시 불러오기
          </S.Delete>
        </S.Notice>
      </S.Page>
    )
  }

  return (
    <NoteForm
      key={`${schedule.id}-${noteId ?? 'new'}`}
      scheduleId={schedule.id}
      note={note}
    />
  )
}