import styled from 'styled-components'

// 명단방 탭(MemberTabs)과 같은 모양의 버튼형 탭
export const SegmentTab = styled.button`
  display: flex;
  min-width: 0;
  flex: 1 0 0;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  font-size: 12px;
  line-height: 140%;
  font-weight: 500;
  color: #78918c;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &[aria-selected='true'] {
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 2px 5px 0 rgba(54, 125, 112, 0.09);
    font-weight: 700;
    color: #367d70;
  }
`
