import MemberGroupCard from '../../components/members/MemberGroupCard'
import type { MemberGroup } from '../../types/members/member'
import Button from "../../components/Button";
import EmptyState from '../../components/EmptyState'
import * as S from '../../styles/members/MemberListPage.styles'

// 피그마: 부원 명단 · 학기별 명단 관리 (빈 화면 아이콘)
const PeopleIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 19c.5-3.2 2.8-5 5.5-5s5 1.8 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.3c1.7.6 2.7 2.2 3 4.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
)

interface Props {
    groups: MemberGroup[]
    onCreate: () => void
    onSelect: (id: number) => void
}

export default function MemberListPage({
    groups,
    onCreate,
    onSelect,
}: Props) {
    return (
        <S.Container $empty={groups.length === 0}>
            {groups.length === 0 ? (
                <S.Empty>
                    <EmptyState
                        icon={PeopleIcon}
                        title="아직 등록된 명단이 없어요"
                        description="새 명단을 만들고 부원들의 정보를 모아보세요."
                    />
                </S.Empty>
            ) : (
            <S.GroupList>
                {groups.map((group) => (
                    <MemberGroupCard
                        key={group.id}
                        group={group}
                        onClick={onSelect}
                    />
                ))}
            </S.GroupList>
            )}

            <Button onClick={onCreate}>
                + 새 명단
            </Button>
        </S.Container>
    )
}