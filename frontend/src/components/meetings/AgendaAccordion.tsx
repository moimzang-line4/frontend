import { useId, useState } from 'react'
import type { Meeting, MeetingAgenda } from '../../types/meetings/meeting'
import { agendaTitle } from '../../utils/meetings/agendaLinks'
import { meetingFinished } from '../../utils/meetings/store'
import chevronIcon from '../../assets/meetings/agenda-chevron.svg'
import * as S from '../../styles/meetings/MeetingAttachments.styles'

type Props = {
  meeting: Meeting
  agenda: MeetingAgenda
  index: number
  today: string
  selected?: boolean
  onSelect?: () => void
  onUnlink?: () => void
}
export default function AgendaAccordion({ meeting, agenda, index, today, selected, onSelect, onUnlink }: Props) {
  const [expanded, setExpanded] = useState(false)
  const id = useId()
  const title = agendaTitle(agenda)
  const done = agenda.completed || meetingFinished(meeting, today)
  const label = `${meeting.title} 안건 ${index + 1}: ${title}`
  return <S.Card aria-label={label}>
    <S.Header>
      {onSelect && <S.Checkbox aria-label={`${label} 선택`} checked={!!selected} onChange={onSelect} />}
      <S.Toggle id={`${id}-toggle`} type="button" aria-label={`${label} ${expanded ? '접기' : '펼치기'}`} aria-expanded={expanded} aria-controls={`${id}-panel`} onClick={() => setExpanded(value => !value)}>
        <S.Status $done={done}>{done ? '완료' : '진행 중'}</S.Status>
        <S.HeaderText><strong>안건{index + 1}. {title}</strong><small>{agenda.decision.trim() ? '결정 사항 입력됨' : '결정 사항 미입력'}</small></S.HeaderText>
        <S.Chevron src={chevronIcon} alt="" width={18} height={18} $expanded={expanded} />
      </S.Toggle>
    </S.Header>
    {expanded && <S.Panel id={`${id}-panel`} role="region" aria-labelledby={`${id}-toggle`}>
      {onUnlink && <S.Disconnect type="button" aria-label={`${label} 연결 끊기`} onClick={onUnlink}>연결 끊기</S.Disconnect>}
      <S.Detail>
        <div><S.DetailHeading><h4>안건 {index + 1}</h4><p>{title}</p><S.Status $done={done}>{done ? '완료' : '진행 중'}</S.Status></S.DetailHeading><S.Preparation>{agenda.preparation || '등록된 준비 내용이 없어요.'}</S.Preparation></div>
        <S.Field>논의 내용<textarea aria-label={`${label} 논의 내용`} readOnly value={agenda.discussion} placeholder="회의에서 나온 의견을 기록해주세요." /></S.Field>
        <S.Field>결정 사항<textarea aria-label={`${label} 결정 사항`} readOnly value={agenda.decision} placeholder="회의에서 결정된 사항을 작성해주세요." /></S.Field>
      </S.Detail>
    </S.Panel>}
  </S.Card>
}
