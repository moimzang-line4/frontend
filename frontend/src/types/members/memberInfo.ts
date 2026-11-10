export interface MemberInfo {
    id: number;
    groupId: number;
    name: string;
    department: string;
    school: string;
    phone: string;
    studentId: string;
    part: string;
    grade: string;
}

export type MemberFormValues = Omit<MemberInfo, "id" | "groupId">;