import styled from 'styled-components'

export const Dialog = styled.dialog`
  position: fixed;
  inset: 0;
  width: calc(100% - 40px);
  max-width: 350px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  margin: auto;
  padding: 24px;
  border-radius: var(--radius-app-bar);
  color: var(--color-ink);
  background: var(--color-surface);
  box-shadow: var(--shadow-app-bar);
  &::backdrop { background: rgb(23 37 30 / 35%); }
`
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  h2 { font-size: 18px; font-weight: 700; }
`
export const Close = styled.button`
  min-width: 32px;
  min-height: 32px;
  cursor: pointer;
  font-size: 20px;
`
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
`
export const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  font-size: 14px;
  font-weight: 400;
`
export const Select = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  font-size: 14px;
`
export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
  a { color: var(--color-primary-strong); text-decoration: underline; }
`
