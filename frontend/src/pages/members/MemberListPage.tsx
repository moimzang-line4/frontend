import MemberGroupCard from '../../components/members/MemberGroupCard'
import type { MemberGroup } from '../../types/member'
import * as S from './MemberListPage.styles'
import Button from "../../components/Button";

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