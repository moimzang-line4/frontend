import styled, { css } from 'styled-components'

type Variant = { $variant: 'generation' | 'inline' }

export const Control = styled.div<Variant>`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
  color: #17251e;

  ${({ $variant }) =>
    $variant === 'generation'
      ? css`
          width: 100%;
          height: 33px;
          border: 1px solid #dbdbde;
          border-radius: 999px;
          background: #e7e7e7;
          font-size: 13px;
        `
      : css`
          min-height: 24px;
          padding-right: 16px;
          font-size: 12px;
        `}

  &:focus-within {
    outline: 2px solid var(--color-primary-strong);
    outline-offset: 2px;
  }
`

export const Value = styled.span<Variant>`
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;

  ${({ $variant }) =>
    $variant === 'generation' &&
    css`
      width: 112px;
      text-align: center;
    `}
`

export const Caret = styled.img<Variant>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;

  ${({ $variant }) =>
    $variant === 'generation'
      ? css`
          left: calc(50% + 68px);
        `
      : css`
          right: 0;
        `}
`

export const NativeSelect = styled.select`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  appearance: none;
  opacity: 0;
  cursor: pointer;
  font: inherit;

  &:disabled {
    cursor: default;
  }
`
