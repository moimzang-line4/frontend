import { useEffect, useState } from "react";
import type {
    MemberInfo,
    MemberFormValues,
} from "../../types/members/memberInfo";

const STORAGE_KEY = "members-data";

const SAMPLE_NAMES = ["한지우", "김민서", "이서준", "박하린", "최도윤", "정유나", "강시우", "윤채원"];
const SAMPLE_DEPARTMENTS = ["전자전기공학부", "컴퓨터공학과", "광고홍보학과", "경영학과"];

// API 연결 전 화면 확인용 임시 데이터
const initialMembers: MemberInfo[] = SAMPLE_NAMES.map((name, index) => ({
    id: index + 1,
    groupId: 1,
    name,
    department: SAMPLE_DEPARTMENTS[index % SAMPLE_DEPARTMENTS.length],
    school: "동국대학교",
    phone: `010-${String(6789 + index).padStart(4, "0")}-0123`,
    studentId: "",
    part: "",
    grade: "",
}));

export function loadMembers(): MemberInfo[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialMembers;
    } catch {
        return initialMembers;
    }
}

function saveMembers(members: MemberInfo[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch {
        // 저장 실패 시에도 화면 상태는 유지
    }
}

export default function useMembers() {
    const [members, setMembers] = useState<MemberInfo[]>(loadMembers);

    useEffect(() => {
        const reload = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY || event.key === null) setMembers(loadMembers());
        };
        window.addEventListener('storage', reload);
        return () => window.removeEventListener('storage', reload);
    }, []);

    const updateMembers = (updater: (prev: MemberInfo[]) => MemberInfo[]) => {
        setMembers((prev) => {
            const next = updater(prev);
            saveMembers(next);
            return next;
        });
    };

    const getMembersByGroup = (groupId: number) => {
        return members.filter((member) => member.groupId === groupId);
    };

    const countByGroup = (groupId: number) => {
        return getMembersByGroup(groupId).length;
    };

    const getMember = (memberId: number) => {
        return members.find((member) => member.id === memberId);
    };

    const addMember = (groupId: number, data: MemberFormValues) => {
        const newMember: MemberInfo = {
            id: Date.now(),
            groupId,
            ...data,
        };

        updateMembers((prev) => [...prev, newMember]);
        return newMember;
    };

    const editMember = (id: number, data: MemberFormValues) => {
        updateMembers((prev) =>
            prev.map((member) =>
                member.id === id ? { ...member, ...data } : member
            )
        );
    };

    const deleteMember = (id: number) => {
        updateMembers((prev) => prev.filter((member) => member.id !== id));
    };

    const deleteMembersByGroup = (groupId: number) => {
        updateMembers((prev) =>
            prev.filter((member) => member.groupId !== groupId)
        );
    };

    return {
        members,
        getMembersByGroup,
        countByGroup,
        getMember,
        addMember,
        editMember,
        deleteMember,
        deleteMembersByGroup,
    };
}
