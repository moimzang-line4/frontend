export type MemberGroupStatus = "open" | "closed";

export interface MemberField {
    id: string;
    label: string;
    enabled: boolean;
}

export interface MemberGroup {
    id: number;
    name: string;
    memberCount: number;
    status: MemberGroupStatus;
    deadline?: string;
    fields?: MemberField[];
    // 공유 등록 링크 토큰 (명단방 상세에서만 내려옴)
    joinToken?: string;
}

export interface CreateMemberGroup {
    name: string;
    deadline: string;
    fields: MemberField[];
}