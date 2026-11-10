import { useState } from "react";
import type {
    MemberGroup,
    CreateMemberGroup,
} from "../../types/members/member";
import { DEFAULT_MEMBER_FIELDS } from "../../constants/members/memberFields";

const initialGroups: MemberGroup[] = [
    {
        id: 1,
        name: "2026년 2학기 음샘",
        memberCount: 0,
        status: "open",
        fields: DEFAULT_MEMBER_FIELDS,
    },
    {
        id: 2,
        name: "2026년 1학기 음샘",
        memberCount: 0,
        status: "closed",
        fields: DEFAULT_MEMBER_FIELDS,
    },
];

const STORAGE_KEY = "member-groups";

export function loadGroups(): MemberGroup[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialGroups;
    } catch {
        return initialGroups;
    }
}

function saveGroups(groups: MemberGroup[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch {
        // 저장 실패 시에도 화면 상태는 유지
    }
}

export default function useMemberGroups() {
    const [groups, setGroups] = useState<MemberGroup[]>(loadGroups);

    const updateGroups = (updater: (prev: MemberGroup[]) => MemberGroup[]) => {
        setGroups((prev) => {
            const next = updater(prev);
            saveGroups(next);
            return next;
        });
    };

    const getGroup = (id: number) => {
        return groups.find((group) => group.id === id);
    };

    const createGroup = (data: CreateMemberGroup) => {
        const newGroup: MemberGroup = {
            id: Date.now(),
            name: data.name,
            memberCount: 0,
            status: "open",
            deadline: data.deadline,
            fields: data.fields,
        };

        updateGroups((prev) => [newGroup, ...prev]);
        return newGroup;
    };

    const updateGroup = (id: number, data: CreateMemberGroup) => {
        updateGroups((prev) =>
            prev.map((group) =>
                group.id === id
                    ? {
                          ...group,
                          name: data.name,
                          deadline: data.deadline,
                          fields: data.fields,
                      }
                    : group
            )
        );
    };

    const deleteGroup = (id: number) => {
        updateGroups((prev) => prev.filter((group) => group.id !== id));
    };

    return {
        groups,
        getGroup,
        createGroup,
        updateGroup,
        deleteGroup,
    };
}
