import { useState } from 'react'
import BottomSheet from '../BottomSheet'
import Button from '../Button'
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
  onClose: () => void
}

const lastFour = (value: string) => value.replace(/\D/g, '').slice(-4)

export default function AttendanceAddSheet({ participants, extraField, onAdd, onClose }: Props) {
  const [form, setForm] = useState<NewParticipant>({ name: '', department: '', extra: '' })
  const [step, setStep] = useState<'form' | 'duplicate'>('form')
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
