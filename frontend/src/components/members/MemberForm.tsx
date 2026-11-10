import { useState } from "react";
import Button from "../Button";
import type { MemberField } from "../../types/members/member";
import type { MemberFormValues } from "../../types/members/memberInfo";
import {
    EMPTY_MEMBER_FORM,
    getVisibleFormFields,
} from "../../constants/members/memberFields";
import * as S from "../../styles/members/MemberForm.styles";
import { showAlert } from "../../hooks/useAlert";

interface Props {
    groupFields?: MemberField[];
    initialValues?: MemberFormValues;
    onSubmit: (data: MemberFormValues) => void;
    onDelete?: () => void;
}

export default function MemberForm({
    groupFields,
    initialValues,
    onSubmit,
    onDelete,
}: Props) {
    const [form, setForm] = useState<MemberFormValues>(
        initialValues ?? EMPTY_MEMBER_FORM
    );

    const fields = getVisibleFormFields(groupFields);

    const handleChange = (key: keyof MemberFormValues, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        const emptyRequired = fields.find(
            (field) => field.required && !form[field.key].trim()
        );

        if (emptyRequired) {
            showAlert(`${emptyRequired.label}을(를) 입력해주세요.`);
            return;
        }

        onSubmit({
            ...form,
            name: form.name.trim(),
            department: form.department.trim(),
        });
    };

    return (
        <S.Container>
            <S.FormContent>
                <S.Fields>
                    {fields.map((field) => (
                        <S.FormGroup key={field.key}>
                            <S.Label htmlFor={`member-${field.key}`}>
                                {field.label}
                            </S.Label>
                            <S.Input
                                id={`member-${field.key}`}
                                type={field.key === "phone" ? "tel" : "text"}
                                inputMode={
                                    field.key === "phone" || field.key === "studentId"
                                        ? "numeric"
                                        : undefined
                                }
                                placeholder={field.placeholder}
                                value={form[field.key]}
                                onChange={(e) =>
                                    handleChange(field.key, e.target.value)
                                }
                            />
                        </S.FormGroup>
                    ))}
                </S.Fields>

                {onDelete && (
                    <S.DeleteButton type="button" onClick={onDelete}>
                        명단에서 삭제
                    </S.DeleteButton>
                )}
            </S.FormContent>

            <S.BottomAction>
                <Button onClick={handleSubmit}>저장하기</Button>
            </S.BottomAction>
        </S.Container>
    );
}
