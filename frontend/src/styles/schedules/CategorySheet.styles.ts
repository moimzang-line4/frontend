import styled, { keyframes } from 'styled-components'

const enter = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`
const leave = keyframes`from { transform: translateY(0); } to { transform: translateY(100%); }`
const dim = keyframes`from { opacity: 0; } to { opacity: 1; }`
export const Sheet = styled.dialog<{ $closing: boolean; $empty: boolean }>`
  position: fixed;
  inset: auto 0 0;
  width: 100%;
  max-width: var(--container-app);
  min-height: min(${({ $empty }) => $empty ? '268px' : '382px'}, 85dvh);
  max-height: 85dvh;
  margin: 0 auto;
  padding: 8px 20px calc(${({ $empty }) => $empty ? '40px' : '24px'} + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  border: none;
  border-radius: 24px 24px 0 0;
  background: #f6f8fa;
  color: #253f3b;
  animation: ${({ $closing }) => $closing ? leave : enter} ${({ $closing }) => $closing ? '180ms ease-in' : '260ms cubic-bezier(0.16, 1, 0.3, 1)'} both;
  &::backdrop { background: rgb(18 31 51 / 34%); animation: ${dim} 180ms ease-out; }
  @media (prefers-reduced-motion: reduce) { animation-duration: 1ms; &::backdrop { animation-duration: 1ms; } }
`
export const HandleRow = styled.div`
  display: flex;
  height: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  &::after { content: ''; width: 36px; height: 4px; border-radius: 2px; background: #d7e0dd; }
`
export const Header = styled.div`
  display: flex;
  min-height: 44px;
  align-items: center;
  padding-left: 14px;
  margin-bottom: 8px;
  h2 { flex: 1; font-size: 18px; line-height: 24px; font-weight: 700; }
`
export const CloseButton = styled.button`
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
export const Options = styled.div`
  max-height: 50dvh;
  overflow-y: auto;
`
export const Option = styled.button<{ $selected: boolean }>`
  display: flex;
  width: 100%;
  min-height: 63px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ $selected }) => $selected ? '#e6f4f0' : 'transparent'};
  color: ${({ $selected }) => $selected ? '#367d70' : '#253f3b'};
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  overflow-wrap: anywhere;
  cursor: pointer;
  img { flex-shrink: 0; }
`
// 선택 버튼 + 수정(연필) 버튼 한 줄. 선택 배경은 줄 전체에
export const OptionRow = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 12px;
  background: ${({ $selected }) => $selected ? '#e6f4f0' : 'transparent'};
  > button:first-child { flex: 1; min-width: 0; background: transparent; }
`
export const EditButton = styled.button`
  display: flex;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #78918c;
  cursor: pointer;
  &:active { background: rgb(0 0 0 / 4%); }
`
export const AddButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 44px;
  margin-top: 8px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d8e6e0;
  border-radius: 12px;
  background: white;
  color: var(--color-primary-strong);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`
export const AddForm = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  input {
    min-width: 0;
    flex: 1;
    height: 44px;
    padding: 10px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: white;
    font-size: 14px;
  }
  button { padding: 10px; font-size: 14px; color: var(--color-primary-strong); cursor: pointer; }
`
export const Error = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: #b43b34;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 24px 0 34px;
  text-align: center;
  line-height: 1.4;
  strong { color: #8c8c8c; font-size: 14px; font-weight: 700; }
  p { color: #b3b3b3; font-size: 12px; font-weight: 500; }
`

// 카테고리 이름 수정 줄: 일반 줄과 같은 높이·여백, 테두리는 안쪽에 그려서 잘리지 않게
export const EditRow = styled.form`
  display: flex;
  min-height: 63px;
  align-items: center;
  gap: 4px;
  padding: 0 4px 0 14px;
  border: 1px solid #d8e6e0;
  border-radius: 12px;
  background: white;
  &:focus-within { border-color: var(--color-primary-strong); }
  input {
    min-width: 0;
    flex: 1;
    height: 44px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #253f3b;
  }
  button { padding: 10px 8px; font-size: 14px; font-weight: 500; color: var(--color-primary-strong); cursor: pointer; }
  button[type='button'] { color: #78918c; }
`
