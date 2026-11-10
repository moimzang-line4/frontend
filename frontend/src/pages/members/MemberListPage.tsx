import MemberGroupCard from '../../components/members/MemberGroupCard'
import type { MemberGroup } from '../../types/members/member'
import Button from "../../components/Button";
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

            <Button onClick={onCreate}>
                + 새 명단
            </Button>
        </S.Container>
    )
}