import type { MemberField } from "../../types/members/member";
import type { MemberFormValues } from "../../types/members/memberInfo";

// 명단방 생성 시 켜고 끌 수 있는 선택 항목 (이름·학과는 항상 필수)
export const DEFAULT_MEMBER_FIELDS: MemberField[] = [
    { id: "studentId", label: "학번", enabled: false },
    { id: "part", label: "파트", enabled: false },
    { id: "grade", label: "학년", enabled: false },
    { id: "school", label: "학교", enabled: true },
    { id: "phone", label: "전화번호", enabled: true },
];

export type MemberFormFieldKey = keyof MemberFormValues;

export interface MemberFormField {
    key: MemberFormFieldKey;
    label: string;
    placeholder: string;
    required: boolean;
}

// 부원 추가·수정 폼에 노출되는 순서 (피그마 기준)
export const MEMBER_FORM_FIELDS: MemberFormField[] = [
    { key: "name", label: "이름", placeholder: "이름 입력", required: true },
    { key: "school", label: "학교", placeholder: "동국대학교", required: false },
    { key: "department", label: "학과", placeholder: "전자전기공학부", required: true },
    { key: "phone", label: "전화번호", placeholder: "010-0000-0000", required: false },
    { key: "studentId", label: "학번", placeholder: "2026123456", required: false },
    { key: "part", label: "파트", placeholder: "파트 입력", required: false },
    { key: "grade", label: "학년", placeholder: "학년 입력", required: false },
];

// 명단 조회 표 컬럼 (이름 열은 고정, 나머지는 가로 스크롤)
export const MEMBER_TABLE_COLUMNS: {
    key: MemberFormFieldKey;
    label: string;
    width: number;
}[] = [
    { key: "department", label: "학과", width: 120 },
    { key: "phone", label: "전화번호", width: 132 },
    { key: "school", label: "학교", width: 104 },
    { key: "studentId", label: "학번", width: 120 },
    { key: "part", label: "파트", width: 80 },
    { key: "grade", label: "학년", width: 72 },
];

export const EMPTY_MEMBER_FORM: MemberFormValues = {
    name: "",
    department: "",
    school: "",
    phone: "",
    studentId: "",
    part: "",
    grade: "",
};

// 그룹에서 켜진 항목 + 필수 항목만 폼에 노출
export function getVisibleFormFields(fields: MemberField[] | undefined) {
    const enabledIds = new Set(
        (fields ?? DEFAULT_MEMBER_FIELDS)
            .filter((field) => field.enabled)
            .map((field) => field.id)
    );

    return MEMBER_FORM_FIELDS.filter(
        (field) => field.required || enabledIds.has(field.key)
    );
}
