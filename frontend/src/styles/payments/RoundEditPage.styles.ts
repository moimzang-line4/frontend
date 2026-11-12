import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: -8px;
  padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Title = styled.h2`
  font-size: 15px;
  line-height: 140%;
  font-weight: 700;
  color: #253f3b;
`

// 검색창은 남은 너비만, +추가 버튼은 오른쪽 고정
export const SearchRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;

  > label {
    width: auto;
    min-width: 0;
    flex: 1 1 0;
  }
`

export const AddButton = styled.button<{ $active: boolean }>`
  display: flex;
  width: 64px;
  height: 38px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? '#253f3b' : 'linear-gradient(127deg, #5aa997 10.71%, #438b7e 82.14%)')};
  font-size: 12px;
  line-height: 140%;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const PersonCard = styled.div`
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
`

export const Avatar = styled.span`
  display: flex;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f3f2;
  color: #a5b3af;
`

export const PersonText = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 0 0;
  flex-direction: column;

  strong {
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: #0e0e0f;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    line-height: 18px;
    color: #7a7a7d;
  }
`

export const RemoveButton = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-right: -8px;
  color: #253f3b;
  cursor: pointer;
`

export const CheckButton = styled.button<{ $checked: boolean }>`
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin: 8px 0;
  border: 1.5px solid ${({ $checked }) => ($checked ? '#253f3b' : '#c9d4d0')};
  border-radius: 50%;
  background: ${({ $checked }) => ($checked ? '#253f3b' : '#ffffff')};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6.5' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px no-repeat;
  }

  /* 터치 영역 넓히기 */
  &::before {
    content: '';
    position: absolute;
    inset: -12px;
  }
`
