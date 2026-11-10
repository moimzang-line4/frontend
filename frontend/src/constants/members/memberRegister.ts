import type {
    MemberRegisterField,
    MemberRegisterForm,
    MemberRegistrationGroup,
} from '../../types/members/memberRegister'

export const MEMBER_REGISTER_FIELDS: MemberRegisterField[] = [
    {
        key: 'name',
        label: '이름',
        placeholder: '홍길동',
        required: true,
        enabled: true,
    },
    {
        key: 'school',
        label: '학교',
        placeholder: '동국대학교',
        required: true,
        enabled: true,
    },
    {
        key: 'department',
        label: '학과',
        placeholder: '광고홍보학과',
        required: true,
        enabled: true,
    },
    {
        key: 'phone',
        label: '전화번호',
        placeholder: '010-0000-0000',
        required: true,
        enabled: true,
    },
    {
        key: 'studentId',
        label: '학번',
        placeholder: '2026123456',
        required: true,
        enabled: true,
    },
]

export const INITIAL_MEMBER_REGISTER_FORM: MemberRegisterForm = {
    name: '',
    school: '',
    department: '',
    phone: '',
    studentId: '',
    part: '',
    grade: '',
}

// API 연결 전 화면 확인용 임시 데이터
export const MOCK_MEMBER_GROUP: MemberRegistrationGroup = {
    id: 1,
    name: '2026년 2학기 음샘',
    memberCount: 6,
    status: 'open',
    fields: MEMBER_REGISTER_FIELDS,
}