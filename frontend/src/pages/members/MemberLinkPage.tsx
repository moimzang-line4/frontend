import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Button from '../../components/Button'
import MemberStepIndicator from '../../components/members/MemberStepIndicator'
import MemberStatusBadge from '../../components/members/MemberStatusBadge'

import { MOCK_MEMBER_GROUP } from '../../constants/members/memberRegister'

import * as S from '../../styles/members/MemberLinkPage.styles'

export default function MemberLinkPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    const [copied, setCopied] = useState(false)

    // 추후 기존 useMemberGroups 훅 또는 API 조회로 교체
    const group = MOCK_MEMBER_GROUP

    const groupId = id ?? String(group.id)

    const registerLink = `${window.location.origin}/members/register/${groupId}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(registerLink)

            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch {
            alert('링크 복사에 실패했습니다.')
        }
    }

    const handlePreview = () => {
        navigate(`/members/register/${groupId}`)
    }

    return (
        <S.Container>
            <MemberStepIndicator currentStep="link" />

            <S.GroupInfo>
                <S.GroupTitleRow>
                    <S.GroupTitle>{group.name}</S.GroupTitle>

                    <MemberStatusBadge status={group.status} />
                </S.GroupTitleRow>

                <S.MemberCount>
                    현재 {group.memberCount}명이 등록했어요
                </S.MemberCount>
            </S.GroupInfo>

            <S.LinkCard>
                <S.CardTitle>부원 등록 링크</S.CardTitle>

                <S.LinkBox>
                    {registerLink}
                </S.LinkBox>

                <Button onClick={handleCopy}>
                    {copied ? '복사 완료!' : '링크 복사하기'}
                </Button>

                <S.Description>
                    복사한 링크를 부원에게 보내 등록을 받아보세요.
                </S.Description>
            </S.LinkCard>

            <S.PreviewSection>
                <S.SectionTitle>공유 전 확인</S.SectionTitle>

                <S.PreviewButton
                    type="button"
                    onClick={handlePreview}
                >
                    부원 등록 폼 미리보기
                </S.PreviewButton>

                <S.Description>
                    링크에 접속해 직접 등록하면 부원 목록에 자동 추가됩니다.
                </S.Description>
            </S.PreviewSection>
        </S.Container>
    )
}