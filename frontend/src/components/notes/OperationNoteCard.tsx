import type { OperationNote } from '../../types/notes/operationNote'
import { noteTypeInfo } from '../../constants/notes/noteTypes'
import personIcon from '../../assets/notes/person.svg'
import calendarIcon from '../../assets/notes/calendar.svg'
import * as S from '../../styles/notes/NotesPage.styles'

type Props = { note: OperationNote; basePath: string }
export default function OperationNoteCard({ note, basePath }: Props) {
  const type = noteTypeInfo(note.type)
  const created = new Date(note.createdAt)
  const date = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}-${String(created.getDate()).padStart(2, '0')}`
  return <S.Card to={`${basePath}/${encodeURIComponent(note.id)}`} aria-label={`${note.title} 메모 확인 및 수정`}>
    <S.CardTop><S.Badge $color={type.color} $background={type.background}>{type.label}</S.Badge><time dateTime={note.createdAt}>{date.slice(5).replace('-', '.')}</time></S.CardTop>
    <S.CardTitle><h3>{note.title}</h3><span aria-hidden="true">›</span></S.CardTitle>
    <S.Preview>{note.content}</S.Preview>
    <S.Metadata>{note.assignee && <span><img src={personIcon} alt="담당자" width={14} height={14} />{note.assignee}</span>}<span><img src={calendarIcon} alt="작성일" width={14} height={14} /><time dateTime={note.createdAt}>{date}</time></span></S.Metadata>
  </S.Card>
}
