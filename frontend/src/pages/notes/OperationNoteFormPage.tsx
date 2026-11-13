import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'

import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import NoteTypeSheet from '../../components/notes/NoteTypeSheet'
import NoteUnavailable from '../../components/notes/NoteUnavailable'

import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useOperationNotes from '../../hooks/notes/useOperationNotes'

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
  const { create, update, remove } = useOperationNotes(scheduleId)

  const [type, setType] = useState<NoteType | undefined>(note?.type)
  const [title, setTitle] = useState(note?.title ?? '')
  const [assignee, setAssignee] = useState(note?.assignee ?? '')
  const [content, setContent] = useState(note?.content ?? '')

  const [typeOpen, setTypeOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState('')

  const listPath =
    `/schedules/${encodeURIComponent(scheduleId)}/operations/notes`

  const canSubmit = !!(type && title.trim() && content.trim())

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!type || !canSubmit) return

    try {
      const values = { type, title, assignee, content }

      if (note) {
        update(note.id, values)
      } else {
        create(values)
      }

      navigate(listPath, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : '메모를 저장하지 못했어요. 다시 시도해주세요.',
      )
    }
  }

  return (
    <S.Page>
      <Header
        title="메모 작성"
        onBack={() => navigate(listPath)}
      />

      <S.FormContent>
        <S.Form onSubmit={submit}>
          <S.FormCard>
            <S.Row>
              <span>
                메모 유형 <S.Required>*</S.Required>
              </span>

              <S.TypeButton
                type="button"
                aria-label={`메모 유형: ${
                  type ? noteTypeInfo(type).label : '선택해 주세요'
                }`}
                aria-haspopup="dialog"
                aria-expanded={typeOpen}
                onClick={() => setTypeOpen(true)}
              >
                {type ? noteTypeInfo(type).label : '선택해 주세요'}

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
                maxLength={80}
                placeholder="메모 제목을 입력해주세요"
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
            </S.Row>

            <S.Row>
              <label htmlFor="note-assignee">
                담당자
              </label>

              <input
                id="note-assignee"
                maxLength={100}
                placeholder="예: 김가은, 홍보팀"
                value={assignee}
                onChange={event => setAssignee(event.target.value)}
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
                placeholder="준비 사항, 아이디어, 결정 사항을 자유롭게 기록해 주세요."
                value={content}
                onChange={event => setContent(event.target.value)}
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
            disabled={!canSubmit}
          >
            {note ? '수정하기' : '등록하기'}
          </S.Submit>

          {note && (
            <S.Delete
              type="button"
              onClick={() => setDeleteOpen(true)}
            >
              삭제하기
            </S.Delete>
          )}
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
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (note) {
            remove(note.id)
          }

          navigate(listPath, { replace: true })
        }}
      />
    </S.Page>
  )
}

export default function OperationNoteFormPage() {
  const { noteId } = useParams()
  const { schedule } = useScheduleDetail()
  const { notes } = useOperationNotes(schedule?.id ?? '')

  if (!schedule || schedule.operationMenuCount === undefined) {
    return (
      <NoteUnavailable
        title="메모 작성"
        message="운영 메모를 사용할 일정을 찾을 수 없어요"
        backPath="/operations"
      />
    )
  }

  const note = notes.find(item => item.id === noteId)

  if (noteId && !note) {
    return (
      <NoteUnavailable
        title="메모 작성"
        message="메모를 찾을 수 없어요"
        backPath={
          `/schedules/${encodeURIComponent(schedule.id)}/operations/notes`
        }
      />
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