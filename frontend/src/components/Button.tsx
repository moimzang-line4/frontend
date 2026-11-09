import type { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, type = 'button', disabled = false, ...props }: ButtonProps) {
  return <StyledButton {...props} type={type} disabled={disabled}>{children}</StyledButton>
}

const StyledButton = styled.button`
  display: flex;
  height: var(--spacing-button);
  width: 100%;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-button);
  padding-inline: 16px;
  font-family: var(--font-sans);
  font-size: var(--text-button);
  line-height: var(--text-button--line-height);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  color: white;
  background-image: linear-gradient(169.64deg, var(--color-button-start) 10.714%, var(--color-button-end) 82.143%);
  &:active:not(:disabled) { filter: brightness(0.95); }
  &:disabled {
    cursor: not-allowed;
    background-image: none;
    background-color: var(--color-button-disabled);
    color: var(--color-button-disabled-text);
  }
`
