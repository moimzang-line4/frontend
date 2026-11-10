import { useParams } from 'react-router'

import Button from '../../components/Button'

import useMemberRegister from '../../hooks/members/useMemberRegister'

import { MOCK_MEMBER_GROUP } from '../../constants/members/memberRegister'

import * as S from '../../styles/members/MemberRegisterPage.styles'

export default function MemberRegisterPage() {
    const { id } = useParams<{ id: string }>()

    // 추후 API에서 명단방별 입력 항목 조회
    const group = MOCK_MEMBER_GROUP

    const groupId = Number(id ?? group.id)

    const {
        form,
        agreed,
        setAgreed,
        handleChange,
        handleSubmit,
    } = useMemberRegister({
        groupId,
        fields: group.fields,
    })

    const visibleFields = group.fields.filter(
        (field) => field.enabled
    )

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