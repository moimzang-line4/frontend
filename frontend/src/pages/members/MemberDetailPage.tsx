import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MemberTabs from "../../components/members/MemberTabs";
import MemberSearchBar from "../../components/members/MemberSearchBar";
import MemberTable from "../../components/members/MemberTable";
import MemberDeleteModal from "../../components/members/MemberDeleteModal";
import type { MemberGroup } from "../../types/members/member";
import type { MemberInfo } from "../../types/members/memberInfo";
import { MEMBER_TABLE_COLUMNS } from "../../constants/members/memberFields";
import { showAlert } from "../../hooks/useAlert";
import * as S from "../../styles/members/MemberDetailPage.styles";

interface Props {
    group: MemberGroup;
    members: MemberInfo[];
    onDeleteGroup: (id: number) => void;
}

const normalize = (value: string) => value.replace(/-/g, "").toLowerCase();

export default function MemberDetailPage({
    group,
    members,
    onDeleteGroup,
}: Props) {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const keyword = normalize(search.trim());

    const filteredMembers = keyword
        ? members.filter((member) =>
              [member.name, member.department, member.phone].some((value) =>
                  normalize(value).includes(keyword)
              )
          )
        : members;

    const [copied, setCopied] = useState(false);
    const copyTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(copyTimer.current), []);

    // 지금 조회된(검색 결과) 명단을 표 형태(탭 구분)로 복사 → 엑셀·구글 시트에 바로 붙여넣기 가능
    const handleCopy = async () => {
        const header = ["이름", ...MEMBER_TABLE_COLUMNS.map((column) => column.label)];
        const rows = filteredMembers.map((member) => [
            member.name,
            ...MEMBER_TABLE_COLUMNS.map((column) => member[column.key] || ""),
        ]);
        const text = [header, ...rows].map((row) => row.join("\t")).join("\n");

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.clearTimeout(copyTimer.current);
            copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
        } catch {
            showAlert("명단 복사에 실패했어요.", { description: "잠시 후 다시 시도해주세요." });
        }
    };

    const handleDeleteGroup = () => {
        onDeleteGroup(group.id);
        navigate("/members", { replace: true });
    };

    return (
        <S.Container>
            <MemberTabs groupId={group.id} />

            <S.TopRow>
                <S.MemberCount>총 {members.length}명</S.MemberCount>
                <S.AddButton
                    type="button"
                    onClick={() => navigate(`/members/${group.id}/add`)}
                >
                    + 추가
                </S.AddButton>
            </S.TopRow>

            <MemberSearchBar value={search} onChange={setSearch} />

            {filteredMembers.length > 0 ? (
                <>
                    <S.ScrollHint>← 좌우로 밀어 항목 확인 →</S.ScrollHint>

                    <MemberTable
                        members={filteredMembers}
                        onEdit={(memberId) =>
                            navigate(`/members/${group.id}/edit/${memberId}`)
                        }
                    />
                </>
            ) : (
                <S.EmptyText>
                    {members.length === 0
                        ? "아직 등록된 부원이 없어요."
                        : "검색 결과가 없어요."}
                </S.EmptyText>
            )}

            {filteredMembers.length > 0 && (
                <S.CopyButton type="button" onClick={handleCopy}>
                    {copied ? `${filteredMembers.length}명 복사 완료!` : "조회된 명단 복사"}
                </S.CopyButton>
            )}

            <S.DeleteGroupButton
                type="button"
                onClick={() => setShowDeleteModal(true)}
            >
                명단 삭제하기
            </S.DeleteGroupButton>

            {showDeleteModal && (
                <MemberDeleteModal
                    title="명단 전체를 삭제할까요?"
                    description={
                        "등록된 부원과 연결된 출석·정산 기록이 삭제되며,\n등록 링크도 사용할 수 없게 돼요."
                    }
                    confirmText="명단 삭제"
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteGroup}
                />
            )}
        </S.Container>
    );
}
