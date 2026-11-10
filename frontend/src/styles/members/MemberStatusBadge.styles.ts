import styled from 'styled-components'
import type { MemberRegistrationStatus } from '../../types/members/memberRegister'

export const Badge = styled.span<{
    $status: MemberRegistrationStatus
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px 10px;
  border-radius: 20px;

  font-size: 11px;
  font-weight: 600;

  color: ${({ $status }) =>
        $status === 'open' ? '#C77953' : '#666666'};

  background: ${({ $status }) =>
        $status === 'open' ? '#FFEBE2' : '#EEEEEE'};
`