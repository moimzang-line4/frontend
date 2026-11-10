import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import MemberTabs from '../../components/members/MemberTabs'
import MemberStatusBadge from '../../components/members/MemberStatusBadge'

import type { MemberGroup } from '../../types/members/member'

import * as S from '../../styles/members/MemberLinkPage.styles'
import { showAlert } from '../../hooks/useAlert'

interface Props {
    group: MemberGroup
}

export default function MemberLinkPage({ group }: Props) {
    const navigate = useNavigate()

    const [copied, setCopied] = useState(false)
    const timerRef = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(timerRef.current), [])

    const registerPath = `/members/register/${group.id}`
    const registerLink = `${window.location.origin}${registerPath}`
    const displayLink = registerLink.replace(/^https?:\/\//, '')

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(registerLink)

            setCopied(true)
            window.clearTimeout(timerRef.current)
            timerRef.current = window.setTimeout(() => setCopied(false), 2000)
        } catch {
            showAlert('링크 복사에 실패했어요.', { description: '잠시 후 다시 시도해주세요.' })
        }
    }

    return (
        <S.Container>
            <MemberTabs groupId={group.id} />

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

                <S.LinkBox title={registerLink}>
                    <S.LinkText>{displayLink}</S.LinkText>
                </S.LinkBox>

                <S.CopyButton type="button" onClick={handleCopy}>
                    {copied ? '복사 완료!' : '링크 복사하기'}
                </S.CopyButton>

                <S.CardDescription>
                    복사한 링크를 부원에게 보내 등록을 받아보세요.
                </S.CardDescription>
            </S.LinkCard>

            <S.PreviewSection>
                <S.SectionTitle>공유 전 확인</S.SectionTitle>

                <S.PreviewButton
                    type="button"
                    onClick={() => navigate(registerPath)}
                >
                    부원 등록 폼 미리보기
                </S.PreviewButton>
            </S.PreviewSection>

            <S.Note>
                링크에 접속해 직접 등록하면 부원 목록에 자동 추가됩니다.
            </S.Note>
        </S.Container>
    )
}
