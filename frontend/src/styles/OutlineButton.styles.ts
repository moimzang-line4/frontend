import styled from 'styled-components'

// 흰 바탕 테두리 버튼 (보조 동작용) — primary: 초록 글씨, danger: 빨간 글씨
// $size='large': 공통 Button과 같은 높이(55px)·모서리
export const OutlineButton = styled.button<{ $tone?: 'primary' | 'danger'; $size?: 'medium' | 'large' }>`
  display: flex;
  width: 100%;
  height: ${({ $size }) => ($size === 'large' ? 'var(--spacing-button)' : '44px')};
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  border: 1px solid #ddece7;
  border-radius: ${({ $size }) => ($size === 'large' ? 'var(--radius-button)' : '12px')};
  background: #ffffff;
  font-size: 14px;
  line-height: 140%;
  font-weight: 700;
  color: ${({ $tone }) => ($tone === 'danger' ? '#ea5a55' : '#367d70')};
  cursor: pointer;

  &:active {
    background: #f7f8fa;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
