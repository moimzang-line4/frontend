import { useState } from 'react'
import BottomSheet from '../BottomSheet'
import Button from '../Button'
import { useMemberLists } from '../../hooks/members/useMemberListsApi'
import type {
  AttendanceExtraField,
  NewParticipant,
  Participant,
} from '../../types/attendance/attendance'
import { FormGroup, Input, Label } from '../../styles/members/MemberForm.styles'
import * as S from '../../styles/attendance/AttendanceAddSheet.styles'

type Props = {
  participants: Participant[]
  extraField?: AttendanceExtraField
  // 서버 결과: 추가됨 / 같은 이름 있음(다시 확인 필요) / 실패
  onAdd: (input: NewParticipant, allowSameName: boolean) => Promise<'added' | 'duplicate' | 'failed'>
  // 명단방에서 불러오기 (성공하면 true)
  onImport: (memberListId: number, name: string) => Promise<boolean>
  onClose: () => void
  // 빈 화면의 '명단방에서 불러오기' 버튼으로 열면 바로 명단방 목록부터
  initialStep?: 'choose' | 'import'
}

const lastFour = (value: string) => value.replace(/\D/g, '').slice(-4)

export default function AttendanceAddSheet({ participants, extraField, onAdd, onImport, onClose, initialStep = 'choose' }: Props) {
  const [form, setForm] = useState<NewParticipant>({ name: '', department: '', extra: '' })
  // 인원 추가 → 불러오기 / 현장 추가
  const [step, setStep] = useState<'choose' | 'import' | 'form' | 'duplicate'>(initialStep)
  const [pending, setPending] = useState(false)

  const name = form.name.trim()
  const department = form.department.trim()
  const extraValid = !extraField || /^\d{4}$/.test(form.extra)
  const canSubmit = name !== '' && department !== '' && extraValid

  const duplicates = participants.filter(item => item.name === name)

  const submit = async (force = false) => {
    if (!canSubmit || pending) return
    if (!force && duplicates.length > 0) {
      setStep('duplicate')
      return
    }
    setPending(true)
    try {
      // 같은 일정의 다른 차수에 같은 이름이 있으면 서버가 알려줌 → 확인 단계로
      const result = await onAdd({ name, department, extra: form.extra }, force)
      if (result === 'duplicate') setStep('duplicate')
    } finally {
      setPending(false)
    }
  }

  if (step === 'choose') {
    return (
      <BottomSheet title="인원 추가" description="참가자를 추가할 방법을 골라주세요." onClose={onClose}>
        <S.OptionList>
          <S.OptionButton type="button" onClick={() => setStep('import')}>
            <strong>명단방에서 불러오기</strong>
            <span>명단방 부원을 한 번에 미출석으로 추가해요</span>
          </S.OptionButton>
          <S.OptionButton type="button" onClick={() => setStep('form')}>
            <strong>현장 인원 추가</strong>
            <span>명단에 없는 사람을 한 명씩 추가해요</span>
          </S.OptionButton>
        </S.OptionList>
      </BottomSheet>
    )
  }

  if (step === 'import') {
    return <MemberListPicker pending={pending} onClose={onClose} onSelect={async (id, listName) => {
      if (pending) return
      setPending(true)
      try {
        await onImport(id, listName)
      } finally {
        setPending(false)
      }
    }} />
  }

  if (step === 'duplicate') {
    return (
      <BottomSheet
        title="같은 이름의 인원이 있어요"
        description={(
          <S.Warning>
            ‘{name}’ 이름으로 등록된 인원을 확인해 주세요.<br />
            기존 인원이면 다시 추가할 필요가 없어요.
          </S.Warning>
        )}
        onClose={onClose}
      >
        {duplicates.length === 0 && (
          <S.Hint>이 일정의 다른 차수에 같은 이름의 참가자가 있어요.</S.Hint>
        )}

        <S.DuplicateList>
          {duplicates.map(item => {
            const contact = item.extra ?? (item.phone ? lastFour(item.phone) : '')
            return (
              <S.DuplicateCard key={item.id}>
                <S.DuplicateName>{item.name}</S.DuplicateName>
                <S.DuplicateInfo>
                  {item.department} · {contact || '전화번호 미등록'}
                </S.DuplicateInfo>
                <S.DuplicateStatus>
                  현재 명단에 있는 인원{item.attendedAt !== null && ' · 출석 완료'}
                </S.DuplicateStatus>
              </S.DuplicateCard>
            )
          })}
        </S.DuplicateList>

        <S.Hint>같은 이름이지만 다른 사람인가요?</S.Hint>
        <Button onClick={() => void submit(true)} disabled={pending}>다른 사람으로 새로 추가</Button>
      </BottomSheet>
    )
  }

  const descriptionTarget = extraField ? `학과와 ${extraField.label.replace(' 4자리', ' 4자리를')}` : '학과를'

  return (
    <BottomSheet
      title="현장 인원 추가"
      description={<>이름이 같은 사람도 구분할 수 있도록<br />{descriptionTarget} 함께 입력해 주세요.</>}
      onClose={onClose}
    >
      <S.Form onSubmit={event => { event.preventDefault(); void submit() }}>
        <FormGroup>
          <Label htmlFor="onsite-name">이름 <S.Required>*</S.Required></Label>
          <Input
            id="onsite-name"
            placeholder="예: 강서준"
            autoComplete="off"
            value={form.name}
            onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="onsite-department">학과 / 소속 <S.Required>*</S.Required></Label>
          <Input
            id="onsite-department"
            placeholder="예: 컴퓨터공학과"
            value={form.department}
            onChange={event => setForm(prev => ({ ...prev, department: event.target.value }))}
          />
        </FormGroup>

        {extraField && (
          <FormGroup>
            <Label htmlFor="onsite-extra">{extraField.label} <S.Required>*</S.Required></Label>
            <Input
              id="onsite-extra"
              inputMode="numeric"
              maxLength={4}
              placeholder={extraField.placeholder}
              value={form.extra}
              onChange={event => setForm(prev => ({ ...prev, extra: event.target.value.replace(/\D/g, '').slice(0, 4) }))}
            />
          </FormGroup>
        )}

        <S.SubmitArea>
          <Button type="submit" disabled={!canSubmit || pending}>{pending ? '추가하는 중…' : '추가하기'}</Button>
        </S.SubmitArea>
      </S.Form>
    </BottomSheet>
  )
}

// 이 기수의 명단방 목록에서 하나 고르기
function MemberListPicker({
  pending,
  onSelect,
  onClose,
}: {
  pending: boolean
  onSelect: (memberListId: number, name: string) => void
  onClose: () => void
}) {
  const { groups, loading, error, reload } = useMemberLists()

  return (
    <BottomSheet
      title="명단방에서 불러오기"
      description="선택한 명단방의 부원이 이 차수에 미출석으로 추가돼요. 이미 있는 부원은 건너뛰어요."
      onClose={onClose}
    >
      {loading ? (
        <S.Hint>명단방을 불러오는 중이에요.</S.Hint>
      ) : error ? (
        <>
          <S.Warning>{error}</S.Warning>
          <Button onClick={() => void reload()}>다시 불러오기</Button>
        </>
      ) : groups.length === 0 ? (
        <S.Hint>아직 만든 명단방이 없어요. 부원 탭에서 명단방을 먼저 만들어 주세요.</S.Hint>
      ) : (
        <S.OptionList>
          {groups.map(group => (
            <S.OptionButton key={group.id} type="button" disabled={pending} onClick={() => onSelect(group.id, group.name)}>
              <strong>{group.name}</strong>
              <span>부원 {group.memberCount}명</span>
            </S.OptionButton>
          ))}
        </S.OptionList>
      )}
      {pending && <S.Hint>불러오는 중이에요…</S.Hint>}
    </BottomSheet>
  )
}
