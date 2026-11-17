import type { MemberRegistrationStatus } from '../../types/members/memberRegister'
import * as S from '../../styles/members/MemberStatusBadge.styles'

interface Props {
    status: MemberRegistrationStatus
}

export default function MemberStatusBadge({ status }: Props) {
    return (
        <S.Badge $status={status}>
            {status === 'open' ? '등록 중' : '등록 마감'}
        </S.Badge>
    )
}
