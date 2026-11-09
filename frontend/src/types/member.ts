export type MemberGroupStatus = "open" | "closed";

export interface MemberGroup {
    id: number;
    name: string;
    memberCount: number;
    status: MemberGroupStatus;
}

export interface MemberField {
    id: string;
    label: string;
    enabled: boolean;
}

export interface CreateMemberGroup {
    name: string;
    deadline: string;
    fields: MemberField[];
}