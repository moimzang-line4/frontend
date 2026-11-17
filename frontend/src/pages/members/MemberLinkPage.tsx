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

    // 서버가 발급한 등록 토큰으로 링크 생성
    const registerPath = group.joinToken ? `/members/register/${group.joinToken}` : ''
    const registerLink = registerPath ? `${window.location.origin}${registerPath}` : ''
    const displayLink = registerLink.replace(/^https?:\/\//, '')
    // 마감된 명단방은 링크 복사 대신 '등록이 마감되었어요' (피그마)
    const closed = group.status === 'closed'

    const handleCopy = async () => {
        if (closed || !registerLink) return
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
                    <S.LinkText>{displayLink || '등록 링크를 불러오지 못했어요.'}</S.LinkText>
                </S.LinkBox>

                <S.CopyButton type="button" onClick={handleCopy} disabled={closed || !registerLink}>
                    {closed ? (
                        <>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" />
                            </svg>
                            등록이 마감되었어요
                        </>
                    ) : copied ? '복사 완료!' : '링크 복사하기'}
                </S.CopyButton>

                {!closed && (
                    <S.CardDescription>
                        복사한 링크를 부원에게 보내 등록을 받아보세요.
                    </S.CardDescription>
                )}
            </S.LinkCard>

            <S.PreviewSection>
                <S.SectionTitle>공유 전 확인</S.SectionTitle>

                <S.PreviewButton
                    type="button"
                    onClick={() => registerPath && navigate(`${registerPath}?preview=1`)}
                    disabled={!registerPath}
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
