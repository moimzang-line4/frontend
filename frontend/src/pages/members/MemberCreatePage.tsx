import { useRef, useState } from "react";

import MemberFieldToggle from "../../components/members/MemberFieldToggle";
import MemberTabs from "../../components/members/MemberTabs";
import Button from "../../components/Button";

import type { MemberField, CreateMemberGroup } from "../../types/members/member";

import * as S from "../../styles/members/MemberCreatePage.styles";
import { showAlert } from "../../hooks/useAlert";

interface Props {
    // 명단방 수정 탭에서 사용할 때 전달
    groupId?: number;
    initialValues?: CreateMemberGroup;
    submitText?: string;
    onSubmit: (data: CreateMemberGroup) => void;
}

const initialFields: MemberField[] = [
    { id: "studentId", label: "학번", enabled: true },
    { id: "part", label: "파트", enabled: false },
    { id: "grade", label: "학년", enabled: false },
    { id: "school", label: "학교", enabled: false },
    { id: "phone", label: "전화번호", enabled: false },
];

// 저장된 항목 설정을 기본 순서에 맞춰 병합
const mergeFields = (saved?: MemberField[]) =>
    initialFields.map((field) => ({
        ...field,
        enabled:
            saved?.find((item) => item.id === field.id)?.enabled ??
            field.enabled,
    }));

export default function MemberCreatePage({
    groupId,
    initialValues,
    submitText = "명단방 생성하기",
    onSubmit,
}: Props) {
    const [name, setName] = useState(initialValues?.name ?? "");
    const [deadline, setDeadline] = useState(initialValues?.deadline ?? "");
    const [fields, setFields] = useState(() =>
        initialValues ? mergeFields(initialValues.fields) : initialFields
    );

    const dateInputRef = useRef<HTMLInputElement>(null);

    const formatDate = (date: string) => {
        if (!date) return "등록 마감일을 선택해주세요.";

        const [year, month, day] = date.split("-");

        return `${year.slice(2)}. ${Number(month)}. ${Number(day)}.`;
    };

    const toggleField = (id: string) => {
        setFields((prev) =>
            prev.map((field) =>
                field.id === id
                    ? { ...field, enabled: !field.enabled }
                    : field
            )
        );
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            showAlert("명단방 이름을 입력해주세요.");
            return;
        }

        if (!deadline) {
            showAlert("등록 마감일을 선택해주세요.");
            return;
        }

        onSubmit({
            name: name.trim(),
            deadline,
            fields,
        });
    };

    return (
        <S.Container>

            <S.Content $withTabs={groupId !== undefined}>
                {groupId !== undefined && <MemberTabs groupId={groupId} />}

                <S.FormGroup>
                    <S.Label htmlFor="groupName">명단방 이름</S.Label>
                    <S.Input
                        id="groupName"
                        type="text"
                        placeholder="명단방 이름을 입력해주세요."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </S.FormGroup>

                <S.FormGroup>
                    <S.Label htmlFor="deadline">등록 마감일</S.Label>

                    <S.DateWrapper
                        onClick={() => dateInputRef.current?.showPicker()}
                    >
                        <S.CalendarIcon>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="5" width="18" height="16" rx="2" />
                                <path d="M7 3v4M17 3v4M3 10h18" />
                            </svg>
                        </S.CalendarIcon>

                        <S.DateText $placeholder={!deadline}>
                            {formatDate(deadline)}
                        </S.DateText>

                        <S.ArrowIcon>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </S.ArrowIcon>

                        <S.HiddenDateInput
                            ref={dateInputRef}
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </S.DateWrapper>
                </S.FormGroup>

                <S.FieldSection>
                    <S.SectionTitle>부원에게 입력받을 항목</S.SectionTitle>

                    <S.RequiredFields>
                        <S.RequiredField>
                            <span>이름</span>
                            <span>필수</span>
                        </S.RequiredField>
                        <S.RequiredField>
                            <span>학과</span>
                            <span>필수</span>
                        </S.RequiredField>
                    </S.RequiredFields>

                    <S.OptionalFields>
                        {fields.map((field) => (
                            <MemberFieldToggle
                                key={field.id}
                                label={field.label}
                                enabled={field.enabled}
                                onChange={() => toggleField(field.id)}
                            />
                        ))}
                    </S.OptionalFields>
                </S.FieldSection>

                <S.Notice>
                    공유 링크에서 부원이 직접 입력하면 명단에 추가돼요.
                </S.Notice>
            </S.Content>

            <S.BottomAction>
                <Button onClick={handleSubmit}>
                    {submitText}
                </Button>
            </S.BottomAction>
        </S.Container>
    );
}