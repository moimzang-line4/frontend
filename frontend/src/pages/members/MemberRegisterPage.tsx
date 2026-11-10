import { useState } from 'react'
import { useParams } from 'react-router'

import Button from '../../components/Button'

import useMemberRegister from '../../hooks/members/useMemberRegister'

import { getVisibleFormFields } from '../../constants/members/memberFields'
import type { MemberGroup } from '../../types/members/member'
import type { MemberFormValues } from '../../types/members/memberInfo'
import type { MemberRegisterField } from '../../types/members/memberRegister'

import * as S from '../../styles/members/MemberRegisterPage.styles'

interface Props {
    groups: MemberGroup[]
    onAdd: (groupId: number, values: MemberFormValues) => void
}

export default function MemberRegisterPage({ groups, onAdd }: Props) {
    const [now] = useState(() => Date.now())
    // 등록 완료 후 '명단 등록하기'로 새 폼을 열 때 사용
    const [round, setRound] = useState(0)
    const { id } = useParams<{ id: string }>()
    const group = groups.find(item => item.id === Number(id))
    if (!group) return <S.Container><p>존재하지 않는 등록 링크예요.</p></S.Container>
    const deadline = group.deadline ? new Date(group.deadline.length === 10 ? `${group.deadline}T23:59:59` : group.deadline).getTime() : Infinity
    if (group.status !== 'open' || deadline < now) {
        return <S.Container><p>등록이 마감된 명단방이에요.</p></S.Container>
    }
    return <RegistrationForm key={`${group.id}-${round}`} group={group} onAdd={onAdd} onRegisterAgain={() => setRound(prev => prev + 1)} />
}

function RegistrationForm({ group, onAdd, onRegisterAgain }: { group: MemberGroup; onAdd: Props['onAdd']; onRegisterAgain: () => void }) {
    const [registered, setRegistered] = useState(false)
    const fields: MemberRegisterField[] = getVisibleFormFields(group.fields).map(field => ({ ...field, enabled: true }))

    const {
        form,
        agreed,
        setAgreed,
        handleChange,
        handleSubmit,
    } = useMemberRegister({
        groupId: group.id,
        fields,
        onSubmit: ({ values }) => {
            onAdd(group.id, values)
            setRegistered(true)
        },
    })

    const visibleFields = fields.filter(
        (field) => field.enabled
    )

    if (registered) {
        return (
            <S.Container>
                <S.Header>
                    <S.HeaderTitle>{group.name}</S.HeaderTitle>
                </S.Header>

                <S.CompleteContent role="status">
                    <S.CompleteIcon width="43" height="43" viewBox="0 0 43 43" fill="none" aria-hidden="true">
                        <circle cx="21.7" cy="21.5" r="19.7" fill="#96CEBC" />
                        <path d="M14.5 22.4l5.4 5.4 9-10.8" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                    </S.CompleteIcon>

                    <S.CompleteTitle>명단 등록이 완료되었어요</S.CompleteTitle>
                    <S.CompleteDescription>입력하신 정보가 부원 명단에 등록되었어요.</S.CompleteDescription>

                    <S.GroupCard>
                        <S.GroupIcon width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                            <circle cx="11" cy="9.5" r="3.6" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M4.5 21.5c.6-3.6 3.3-5.6 6.5-5.6s5.9 2 6.5 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M17.6 6.3a3.6 3.6 0 0 1 0 6.4M20 16.3c2 .7 3.2 2.5 3.5 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </S.GroupIcon>
                        <S.GroupText>
                            <S.GroupLabel>등록한 명단방</S.GroupLabel>
                            <S.GroupName>{group.name}</S.GroupName>
                        </S.GroupText>
                    </S.GroupCard>
                </S.CompleteContent>

                <S.BottomAction>
                    <Button onClick={onRegisterAgain}>
                        명단 등록하기
                    </Button>
                </S.BottomAction>
            </S.Container>
        )
    }

    return (
        <S.Container>
            <S.Header>
                <S.HeaderTitle>{group.name}</S.HeaderTitle>
            </S.Header>

            <S.Content>
                <S.Form>
                    {visibleFields.map((field) => (
                        <S.FormGroup key={field.key}>
                            <S.Label htmlFor={field.key}>
                                {field.label}
                                {field.required && ' *'}
                            </S.Label>

                            <S.Input
                                id={field.key}
                                type={field.key === 'phone' ? 'tel' : 'text'}
                                placeholder={field.placeholder}
                                value={form[field.key]}
                                onChange={(e) =>
                                    handleChange(field.key, e.target.value)
                                }
                            />
                        </S.FormGroup>
                    ))}
                </S.Form>

                <S.Agreement>
                    <S.Checkbox
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />

                    <S.AgreementText>
                        명단 등록 및 동아리 운영 목적의 개인정보 수집·이용에 동의합니다.
                    </S.AgreementText>
                </S.Agreement>
            </S.Content>

            <S.BottomAction>
                <Button onClick={handleSubmit}>
                    명단 등록하기
                </Button>
            </S.BottomAction>
        </S.Container>
    )
}