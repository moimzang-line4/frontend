import styled from 'styled-components'
import type { MemberRegistrationStatus } from '../../types/members/memberRegister'

export const Badge = styled.span<{
  $status: MemberRegistrationStatus
}>`
  display: inline-flex;
  height: 18px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 10px;
  line-height: 18px;
  font-weight: 700;
  white-space: nowrap;

  color: ${({ $status }) => ($status === 'open' ? '#A15B31' : '#E45C55')};
  background: ${({ $status }) => ($status === 'open' ? '#FFEBDE' : '#FFE9E8')};
`
