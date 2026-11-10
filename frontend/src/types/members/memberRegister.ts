export type MemberRegistrationStatus = 'open' | 'closed'

export type MemberRegisterFieldKey =
    | 'name'
    | 'school'
    | 'department'
    | 'phone'
    | 'studentId'

export type MemberRegisterForm = Record<
    MemberRegisterFieldKey,
    string
>

export interface MemberRegisterField {
    key: MemberRegisterFieldKey
    label: string
    placeholder: string
    required: boolean
    enabled: boolean
}

export interface MemberRegistrationGroup {
    id: number
    name: string
    memberCount: number
    status: MemberRegistrationStatus
    fields: MemberRegisterField[]
}

export interface MemberRegisterPayload {
    groupId: number
    values: MemberRegisterForm
    agreed: boolean
}