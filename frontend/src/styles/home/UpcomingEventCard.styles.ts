import styled from 'styled-components'
import { Link } from 'react-router'

export const Card = styled(Link)<{ $featured: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid ${({ $featured }) => $featured ? 'rgb(255 255 255 / 85%)' : 'white'};
  border-radius: var(--radius-app-bar);
  background: ${({ $featured }) => $featured
    ? 'linear-gradient(161.66deg, rgb(67 139 126 / 70%) 10.714%, rgb(150 206 188 / 70%) 82.143%)'
    : 'white'};
  filter: drop-shadow(0 7px 9px rgb(63 141 124 / 10%));
  color: ${({ $featured }) => $featured ? 'white' : 'var(--color-home-ink)'};
`
export const Details = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
`
export const Category = styled.p<{ $featured: boolean }>`
  color: ${({ $featured }) => $featured ? 'white' : 'var(--color-primary-strong)'};
  font-size: 11px;
  font-weight: var(--font-weight-bold);
`
export const Title = styled.h3`
  font-size: 18px;
  font-weight: var(--font-weight-bold);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`
export const Summary = styled.p<{ $featured: boolean }>`
  font-size: 12px;
  color: ${({ $featured }) => $featured ? 'white' : 'var(--color-muted)'};
`
