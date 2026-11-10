import { useState } from 'react'

import type {
    MemberRegisterField,
    MemberRegisterFieldKey,
    MemberRegisterForm,
    MemberRegisterPayload,
} from '../../types/members/memberRegister'

import {
    INITIAL_MEMBER_REGISTER_FORM,
} from '../../constants/members/memberRegister'

interface Props {
    groupId: number
    fields: MemberRegisterField[]
    onSubmit?: (data: MemberRegisterPayload) => void
}

export default function useMemberRegister({
    groupId,
    fields,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<MemberRegisterForm>({
        ...INITIAL_MEMBER_REGISTER_FORM,
    })

    const [agreed, setAgreed] = useState(false)

    const handleChange = (
        key: MemberRegisterFieldKey,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleSubmit = () => {
        const hasEmptyRequiredField = fields.some(
            (field) =>
                field.enabled &&
                field.required &&
                !form[field.key].trim()
        )

        if (hasEmptyRequiredField) {
            alert('모든 필수 항목을 입력해주세요.')
            return
        }

        if (!agreed) {
            alert('개인정보 수집 및 이용에 동의해주세요.')
            return
        }

        const payload: MemberRegisterPayload = {
            groupId,
            values: form,
            agreed,
        }

        if (onSubmit) {
            onSubmit(payload)
            return
        }

        // 실제 등록 API 연결 전 임시 동작
        console.log('부원 등록 데이터:', payload)
        alert('등록 요청이 완료되었습니다.')
    }

    return {
        form,
        agreed,
        setAgreed,
        handleChange,
        handleSubmit,
    }
}