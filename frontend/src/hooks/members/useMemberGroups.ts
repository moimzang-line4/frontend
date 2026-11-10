import { useState } from "react";
import type { MemberGroup, CreateMemberGroup } from "../../types/members/member";

const initialGroups: MemberGroup[] = [
    {
        id: 1,
        name: "2026년 2학기 음샘",
        memberCount: 6,
        status: "closed",
    },
    {
        id: 2,
        name: "2026년 1학기 음샘",
        memberCount: 120,
        status: "open",
    },
];

export default function useMemberGroups() {
    const [groups, setGroups] = useState<MemberGroup[]>(initialGroups);

    const createGroup = (data: CreateMemberGroup) => {
        const newGroup: MemberGroup = {
            id: Date.now(),
            name: data.name,
            memberCount: 0,
            status: "open",
        };

        setGroups((prev) => [newGroup, ...prev]);

        return newGroup;
    };

    return { groups, createGroup };
}