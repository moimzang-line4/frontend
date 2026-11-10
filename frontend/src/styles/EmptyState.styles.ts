import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  text-align: center;
`

export const Icon = styled.div`
  display: flex;
  color: #78918c;
`

export const Text = styled.div`
  display: flex;
  max-width: 240px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

export const Title = styled.p`
  font-size: 14px;
  line-height: 140%;
  font-weight: 700;
  color: #253f3b;
`

export const Description = styled.p`
  font-size: 12px;
  line-height: 140%;
  font-weight: 500;
  color: #b3b3b3;
  word-break: keep-all;
`
