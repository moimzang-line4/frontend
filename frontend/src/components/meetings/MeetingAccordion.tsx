import { useId, useState } from 'react'
import { Link } from 'react-router'
import type { Meeting } from '../../types/meetings/meeting'
import AgendaAccordion from './AgendaAccordion'
import { meetingFinished } from '../../utils/meetings/store'
import calendarIcon from '../../assets/meetings/calendar.svg'
import chevronIcon from '../../assets/meetings/agenda-chevron.svg'
import * as S from '../../styles/meetings/MeetingAttachments.styles'

type Props = { meeting: Meeting; today: string; scheduleId?: string; selected?: boolean; onSelect?: () => void; onUnlink?: () => void }
export default function MeetingAccordion({ meeting, today, scheduleId, selected, onSelect, onUnlink }: Props) {
  const [expanded, setExpanded] = useState(false)
  const id = useId()
  const done = meetingFinished(meeting, today)
  const basePath = `/meetings/${encodeURIComponent(meeting.id)}`
  return <S.Card aria-label={`${meeting.title} 회의록`}>
    <S.MeetingTop><span><S.Status $done={done}>{done ? '완료' : meeting.status === 'in-progress' ? '진행 중' : '예정'}</S.Status>{meeting.categoryName && <S.Category>{meeting.categoryName}</S.Category>}</span><time dateTime={meeting.createdAt}>{meeting.createdAt.slice(5, 10).replace('-', '.')}</time></S.MeetingTop>
    <S.Header>{onSelect && <S.Checkbox aria-label={`${meeting.title} 회의록 선택`} checked={!!selected} onChange={onSelect} />}<S.Toggle id={`${id}-toggle`} type="button" aria-label={`${meeting.title} 회의록 ${expanded ? '접기' : '펼치기'}`} aria-expanded={expanded} aria-controls={`${id}-panel`} onClick={() => setExpanded(value => !value)}><S.MeetingHeaderText><strong>{meeting.title}</strong></S.MeetingHeaderText><S.Chevron src={chevronIcon} alt="" width={18} height={18} $expanded={expanded} /></S.Toggle></S.Header>
    <S.Preview>{meeting.agendas.map(agenda => agenda.preparation).filter(Boolean).join(', ') || meeting.content || '작성된 안건 내용이 없어요.'}</S.Preview>
    <S.Footer><p><span>안건 {meeting.agendas.length}개</span><img src={calendarIcon} alt="회의 날짜" width={14} height={14} />{meeting.date}</p>{!onSelect && <Link to={done ? basePath : `${basePath}/run`}>{done ? '회의록 보기' : meeting.status === 'in-progress' ? '회의 이어하기' : '회의 시작하기'}</Link>}</S.Footer>
    {expanded && <S.Panel id={`${id}-panel`} role="region" aria-labelledby={`${id}-toggle`}>
      {onUnlink && <S.Disconnect type="button" aria-label={`${meeting.title} 회의록 연결 끊기`} onClick={onUnlink}>연결 끊기</S.Disconnect>}
      {meeting.agendas.map((agenda, index) => <AgendaAccordion key={agenda.id} meeting={meeting} agenda={agenda} index={index} today={today} />)}
      {!onSelect && <S.EditLink to={`${basePath}${scheduleId ? `?scheduleId=${encodeURIComponent(scheduleId)}` : ''}`}>회의록 확인 및 수정</S.EditLink>}
    </S.Panel>}
  </S.Card>
}
