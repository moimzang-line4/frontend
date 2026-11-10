import { useEffect } from 'react'
import * as S from '../../styles/members/MemberDeleteModal.styles'

interface Props {
    title: string
    description: string
    confirmText?: string
    onCancel: () => void
    onConfirm: () => void
}

export default function MemberDeleteModal({
    title,
    description,
    confirmText = '삭제',
    onCancel,
    onConfirm,
}: Props) {
    // ESC로 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onCancel])

    return (
        <S.Overlay onClick={onCancel}>
            <S.Modal
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-title"
                aria-describedby="delete-description"
                onClick={(e) => e.stopPropagation()}
            >
                <S.Title id="delete-title">{title}</S.Title>
                <S.Description id="delete-description">
                    {description}
                </S.Description>

                <S.Actions>
                    <S.CancelButton type="button" onClick={onCancel}>
                        취소
                    </S.CancelButton>
                    <S.ConfirmButton type="button" onClick={onConfirm}>
                        {confirmText}
                    </S.ConfirmButton>
                </S.Actions>
            </S.Modal>
        </S.Overlay>
    )
}
