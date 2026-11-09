import MemberGroupCard from '../../components/members/MemberGroupCard'
import type { MemberGroup } from '../../types/member'
import * as S from '../../styles/members/MemberListPage.styles'

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
        <S.Container>
            <S.GroupList>
                {groups.map((group) => (
                    <MemberGroupCard
                        key={group.id}
                        group={group}
                        onClick={onSelect}
                    />
                ))}
            </S.GroupList>

            <S.CreateButton type="button" onClick={onCreate}>
                + 새 명단
            </S.CreateButton>
        </S.Container>
    )
}