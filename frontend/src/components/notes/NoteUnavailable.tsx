import { Link, useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import * as S from '../../styles/notes/NotesPage.styles'

type Props = { title: string; message: string; backPath: string }
export default function NoteUnavailable({ title, message, backPath }: Props) {
  const navigate = useNavigate()
  return <S.Page><Header title={title} onBack={() => navigate(backPath)} /><S.Notice><h1>{message}</h1><Link to={backPath}>돌아가기</Link></S.Notice></S.Page>
}
