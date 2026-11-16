import { useNavigate } from "react-router";
import MemberForm from "../../components/members/MemberForm";
import type { MemberGroup } from "../../types/members/member";
import type { MemberFormValues } from "../../types/members/memberInfo";
import { showAlert } from "../../hooks/useAlert";
import { getApiErrorMessage } from "../../utils/members/mapper";

interface Props {
    group: MemberGroup;
    onAdd: (groupId: number, data: MemberFormValues) => void | Promise<void>;
}

export default function MemberAddPage({ group, onAdd }: Props) {
    const navigate = useNavigate();

    return (
        <MemberForm
            groupFields={group.fields}
            onSubmit={async (data) => {
                try {
                    await onAdd(group.id, data);
                    navigate(`/members/${group.id}`, { replace: true });
                } catch (caught) {
                    showAlert(getApiErrorMessage(caught, "부원을 추가하지 못했어요."));
                }
            }}
        />
    );
}
