import styled from 'styled-components'
import Button from '../../components/Button'

export const Page = styled.div`
  margin-inline: auto;
  width: 100%;
  max-width: var(--container-app);
  min-height: 100dvh;
  background: var(--color-page-background);
  color: #253f3b;
  padding-bottom: calc(86px + env(safe-area-inset-bottom, 0px));
`
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px var(--spacing-page-x) 14px;
`
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`
export const Label = styled.label`
  font-size: 14px;
  line-height: 19px;
  font-weight: 700;
`
export const Required = styled.span`
  margin-left: 4px;
  color: #367d70;
  font-weight: 400;
`
export const Input = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 13px;
  border: 1px solid white;
  border-radius: 10px;
  background: var(--color-surface);
  font-size: 13px;
  line-height: 20px;
  &::placeholder { color: #91a39f; }
`
export const Palette = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  height: 43px;
  padding-inline: 4px;
  @media (max-width: 360px) { justify-content: space-between; gap: 0; }
`
export const ColorButton = styled.button<{ $selected: boolean }>`
  position: relative;
  width: 22.816px;
  height: 22.816px;
  flex-shrink: 0;
  border-radius: 50%;
  outline: ${({ $selected }) => $selected ? '3.4px solid #dce5e2' : 'none'};
  cursor: pointer;
  &:focus-visible { outline: 2px solid var(--color-primary-strong); outline-offset: 4px; }
`
export const ColorImageSlot = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: none;
    transform: translate(-50%, -50%);
  }
`
export const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid white;
  border-radius: 10px;
  background: var(--color-surface);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
`
export const CategoryValue = styled.span<{ $chosen: boolean }>`
  min-width: 0;
  color: ${({ $chosen }) => $chosen ? '#253f3b' : '#91a39f'};
  font-size: 13px;
  font-weight: 400;
  overflow-wrap: anywhere;
`
export const DateCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1px solid white;
  border-radius: var(--radius-app-bar);
  background: linear-gradient(149.12deg, white 10.714%, #f3faf7 82.143%);
`
export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 26px;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
`
export const Switch = styled.button<{ $checked: boolean }>`
  position: relative;
  width: 40px;
  height: 24px;
  flex-shrink: 0;
  padding: 3px;
  border-radius: 12px;
  background: ${({ $checked }) => $checked ? '#438b7e' : '#dce5e2'};
  cursor: pointer;
  transition: background 160ms ease;
  &::after {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transform: translateX(${({ $checked }) => $checked ? '16px' : '0'});
    transition: transform 160ms ease;
  }
  @media (prefers-reduced-motion: reduce) { &, &::after { transition: none; } }
`
export const Divider = styled.hr`
  border-top: 1px solid white;
  width: 100%;
`
export const DateRow = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 17fr) minmax(0, 11fr);
  gap: 8px;
  align-items: center;
  > span { font-size: 14px; font-weight: 500; }
`
export const Picker = styled.label<{ $disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  height: 38px;
  min-width: 0;
  padding: 7px 10px;
  border: 1px solid white;
  border-radius: 10px;
  background: white;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  &:focus-within { outline: 2px solid var(--color-primary-strong); outline-offset: 2px; }
  img { flex-shrink: 0; }
`
export const PickerText = styled.span<{ $filled: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 14px;
  color: ${({ $filled }) => $filled ? '#253f3b' : '#91a39f'};
  > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  @media (max-width: 360px) { font-size: 12px; gap: 3px; }
`
export const NativePicker = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: inherit;
`
export const OperationCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border: 1px solid white;
  border-radius: var(--radius-app-bar);
  background: white;
`
export const Description = styled.p`
  font-size: 12px;
  line-height: 18px;
  color: #78918c;
`
export const ActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 25;
  width: 100%;
  max-width: var(--container-app);
  transform: translateX(-50%);
  padding: 10px var(--spacing-page-x) calc(18px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--color-border);
  background: white;
`
export const SubmitButton = styled(Button)`
  filter: drop-shadow(0 7px 9px rgb(63 141 124 / 10%));
`
export const Error = styled.p`
  font-size: 12px;
  color: #b43b34;
  line-height: 1.5;
`
