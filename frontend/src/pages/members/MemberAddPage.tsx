import { useNavigate } from "react-router";
import MemberForm from "../../components/members/MemberForm";
import type { MemberGroup } from "../../types/members/member";
import type { MemberFormValues } from "../../types/members/memberInfo";

interface Props {
    group: MemberGroup;
    onAdd: (groupId: number, data: MemberFormValues) => void;
}

export default function MemberAddPage({ group, onAdd }: Props) {
    const navigate = useNavigate();

    return (
        <MemberForm
            groupFields={group.fields}
            onSubmit={(data) => {
                onAdd(group.id, data);
                navigate(`/members/${group.id}`, { replace: true });
            }}
        />
    );
}
