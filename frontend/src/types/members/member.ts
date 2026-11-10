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
}

export interface CreateMemberGroup {
    name: string;
    deadline: string;
    fields: MemberField[];
}