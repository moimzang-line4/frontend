import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import MemberForm from "../../components/members/MemberForm";
import MemberDeleteModal from "../../components/members/MemberDeleteModal";
import type { MemberGroup } from "../../types/members/member";
import type {
    MemberInfo,
    MemberFormValues,
} from "../../types/members/memberInfo";
import { showAlert } from "../../hooks/useAlert";
import { getApiErrorMessage } from "../../utils/members/mapper";

interface Props {
    group: MemberGroup;
    getMember: (memberId: number) => MemberInfo | undefined;
    onEdit: (memberId: number, data: MemberFormValues) => void | Promise<void>;
    onDelete: (memberId: number) => void | Promise<void>;
}

export default function MemberEditPage({
    group,
    getMember,
    onEdit,
    onDelete,
}: Props) {
    const navigate = useNavigate();
    const { memberId } = useParams<{ memberId: string }>();
    const targetId = Number(memberId);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const member = getMember(targetId);

    if (!member || member.groupId !== group.id) {
        return <p>부원 정보를 찾을 수 없습니다.</p>;
    }

    const initialValues: MemberFormValues = {
        name: member.name,
        department: member.department,
        school: member.school,
        phone: member.phone,
        studentId: member.studentId,
        part: member.part,
        grade: member.grade,
    };

    const goToList = () => {
        navigate(`/members/${group.id}`, { replace: true });
    };

    return (
        <>
            <MemberForm
                groupFields={group.fields}
                initialValues={initialValues}
                onSubmit={async (data) => {
                    try {
                        await onEdit(targetId, data);
                        goToList();
                    } catch (caught) {
                        showAlert(getApiErrorMessage(caught, "부원 정보를 저장하지 못했어요."));
                    }
                }}
                onDelete={() => setShowDeleteModal(true)}
            />

            {showDeleteModal && (
                <MemberDeleteModal
                    title="부원을 삭제할까요?"
                    description={`${member.name} 님의 정보가 명단에서 삭제되며,\n삭제한 정보는 복구할 수 없어요.`}
                    confirmText="부원 삭제"
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={async () => {
                        try {
                            await onDelete(targetId);
                            goToList();
                        } catch (caught) {
                            setShowDeleteModal(false);
                            showAlert(getApiErrorMessage(caught, "부원을 삭제하지 못했어요."));
                        }
                    }}
                />
            )}
        </>
    );
}
