import type { Meeting } from '../../types/meetings/meeting'
import calendarIcon from '../../assets/meetings/calendar.svg'
import personIcon from '../../assets/meetings/person.svg'
import * as S from '../../styles/meetings/MeetingCard.styles'

type Props = { meeting: Meeting; finished: boolean }
export default function MeetingCard({ meeting, finished }: Props) {
  const path = `/meetings/${encodeURIComponent(meeting.id)}`
  const count = meeting.participants.split(/[,，\n]/).filter(name => name.trim()).length
  return <S.Card>
    <S.MainLink to={path} aria-label={`${meeting.title} 안건 확인 및 수정`}>
      <S.Top><S.Badges>{finished ? <S.Status $done>완료</S.Status> : meeting.status === 'in-progress' ? <S.Status $done={false}>진행 중</S.Status> : null}{meeting.categoryName && <S.Category>{meeting.categoryName}</S.Category>}</S.Badges><time dateTime={meeting.createdAt}>{meeting.createdAt.slice(5, 10).replace('-', '.')}</time></S.Top>
      <S.Title><h3>{meeting.title}</h3><span aria-hidden="true">›</span></S.Title>
      <S.Preview>{meeting.agendas.map(agenda => agenda.preparation).filter(Boolean).join(', ') || meeting.content || '작성된 안건 내용이 없어요.'}</S.Preview>
    </S.MainLink>
    <S.Footer><S.Metadata><span>안건 {meeting.agendas.length}개</span>{count > 0 && <span><img src={personIcon} alt="참석자" width={14} height={14} />{count}명</span>}<span><img src={calendarIcon} alt="회의 날짜" width={14} height={14} />{meeting.date}</span></S.Metadata>
      <S.Action to={`${path}/run`} $filled={!finished}>{finished ? '회의록 보기' : meeting.status === 'in-progress' ? '회의 이어하기' : '회의 시작하기'}</S.Action>
    </S.Footer>
  </S.Card>
}
