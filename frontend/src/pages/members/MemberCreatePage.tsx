import { useState } from "react";

import MemberFieldToggle from "../../components/members/MemberFieldToggle";
import MemberStepIndicator from "../../components/members/MemberStepIndicator";

import type { MemberField, CreateMemberGroup } from "../../types/member";

import * as S from "./MemberCreatePage.styles";

interface Props {
    onSubmit: (data: CreateMemberGroup) => void;
}

const initialFields: MemberField[] = [
    { id: "studentId", label: "학번", enabled: true },
    { id: "part", label: "파트", enabled: false },
    { id: "grade", label: "학년", enabled: false },
    { id: "school", label: "학교", enabled: false },
    { id: "phone", label: "전화번호", enabled: false },
];

export default function MemberCreatePage({ onSubmit }: Props) {
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState("");
    const [fields, setFields] = useState(initialFields);

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
            alert("명단방 이름을 입력해주세요.");
            return;
        }

        if (!deadline) {
            alert("등록 마감일을 선택해주세요.");
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

            <S.Content>
                <MemberStepIndicator currentStep="create" />

                <S.FormGroup>
                    <S.Label htmlFor="groupName">명단방 이름</S.Label>
                    <S.Input
                        id="groupName"
                        type="text"
                        placeholder="2027년 1학기 음샘"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </S.FormGroup>

                <S.FormGroup>
                    <S.Label htmlFor="deadline">등록 마감일</S.Label>
                    <S.Input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
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
                <S.SubmitButton type="button" onClick={handleSubmit}>
                    명단방 생성하기
                </S.SubmitButton>
            </S.BottomAction>
        </S.Container>
    );
}