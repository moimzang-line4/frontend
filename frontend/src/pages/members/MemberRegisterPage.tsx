import { useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import Button from '../../components/Button'

import useMemberRegister from '../../hooks/members/useMemberRegister'

import { getJoinForm, registerMember } from '../../api/generated'
import { showAlert } from '../../hooks/useAlert'
import { getVisibleFormFields } from '../../constants/members/memberFields'
import { fromFieldsResponse, getApiErrorMessage, unwrap } from '../../utils/members/mapper'
import type { MemberField } from '../../types/members/member'
import type { MemberRegisterField, MemberRegisterForm } from '../../types/members/memberRegister'

import * as S from '../../styles/members/MemberRegisterPage.styles'

interface JoinGroup {
    name: string
    fields: MemberField[]
}

// 공유 링크(/members/register/:token)로 들어온 부원 등록 폼
export default function MemberRegisterPage() {
    const [now] = useState(() => Date.now())
    // 등록 완료 후 '다른 부원 등록하기'로 새 폼을 열 때 사용
    const [round, setRound] = useState(0)
    const { token = '' } = useParams<{ token: string }>()
    // 링크 관리 화면의 '부원 등록 폼 미리보기'로 들어온 경우 (등록 불가)
    const [searchParams] = useSearchParams()
    const preview = searchParams.get('preview') === '1'

    const query = useQuery({
        queryKey: ['join-form', token],
        enabled: Boolean(token),
        retry: 1,
        queryFn: async ({ signal }) => {
            const response = await getJoinForm(token, { timeout: 15000, signal })
            return unwrap(response.data, '등록 폼을 불러오지 못했어요.')
        },
    })

    if (query.isLoading) return <S.Container><p>등록 폼을 불러오는 중이에요.</p></S.Container>
    if (!token || query.error || !query.data) {
        return <S.Container><p>{query.error ? getApiErrorMessage(query.error, '존재하지 않는 등록 링크예요.') : '존재하지 않는 등록 링크예요.'}</p></S.Container>
    }

    const form = query.data
    const deadline = form.registerDeadline ? new Date(form.registerDeadline).getTime() : Infinity
    if (deadline < now) {
        return <S.Container><p>등록이 마감된 명단방이에요.</p></S.Container>
    }

    const group: JoinGroup = {
        name: form.memberListName ?? '부원 등록',
        fields: fromFieldsResponse(form.fields),
    }
    return <RegistrationForm key={round} token={token} group={group} preview={preview} onRegisterAgain={() => setRound(prev => prev + 1)} />
}

const trimmed = (value: string) => (value.trim() ? value.trim() : undefined)

function RegistrationForm({ token, group, preview, onRegisterAgain }: { token: string; group: JoinGroup; preview: boolean; onRegisterAgain: () => void }) {
    const navigate = useNavigate()
    const [registered, setRegistered] = useState(false)
    const submitting = useRef(false)
    // 서버 기준: 명단방에서 받는 항목은 모두 필수
    const fields: MemberRegisterField[] = getVisibleFormFields(group.fields).map(field => ({ ...field, enabled: true, required: true }))

    const submit = async (values: MemberRegisterForm) => {
        if (preview || submitting.current) return
        submitting.current = true
        try {
            const response = await registerMember(token, {
                name: values.name.trim(),
                department: values.department.trim(),
                school: trimmed(values.school),
                phone: trimmed(values.phone),
                studentId: trimmed(values.studentId),
                part: trimmed(values.part),
                grade: trimmed(values.grade),
                privacyConsent: true,
            }, { timeout: 15000 })
            unwrap(response.data, '등록하지 못했어요.')
            setRegistered(true)
        } catch (caught) {
            showAlert(getApiErrorMessage(caught, '등록하지 못했어요. 잠시 후 다시 시도해주세요.'))
        } finally {
            submitting.current = false
        }
    }

    const {
        form,
        agreed,
        setAgreed,
        handleChange,
        handleSubmit,
    } = useMemberRegister({
        groupId: 0,
        fields,
        onSubmit: ({ values }) => {
            void submit(values)
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
                        다른 부원 등록하기
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
                {preview && (
                    <S.PreviewNotice role="note">
                        미리보기 화면이에요. 부원에게 보이는 모습만 확인할 수 있어요.
                    </S.PreviewNotice>
                )}

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
                                disabled={preview}
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
                        disabled={preview}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />

                    <S.AgreementText>
                        명단 등록 및 동아리 운영 목적의 개인정보 수집·이용에 동의합니다.
                    </S.AgreementText>
                </S.Agreement>
            </S.Content>

            <S.BottomAction>
                {preview ? (
                    <Button onClick={() => navigate(-1)}>
                        닫기
                    </Button>
                ) : (
                    <Button onClick={handleSubmit}>
                        등록하기
                    </Button>
                )}
            </S.BottomAction>
        </S.Container>
    )
}