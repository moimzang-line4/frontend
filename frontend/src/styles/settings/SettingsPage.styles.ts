import styled from 'styled-components'

export const Page = styled.div<{ $hasActionBar?: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
  max-width: var(--container-app);
  margin-inline: auto;
  padding-bottom: ${({ $hasActionBar = true }) =>
    $hasActionBar
      ? 'calc(84px + env(safe-area-inset-bottom, 0px))'
      : 'env(safe-area-inset-bottom, 0px)'};
  background: var(--color-page-background);
  color: #253f3b;
`
export const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 27px 20px 40px;
`
export const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  h2 {
    font-size: 18px;
    line-height: 19px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  p {
    color: #78918c;
    font-size: 12px;
    line-height: 18px;
  }
`
export const Section = styled.section`
  margin-top: 16px;
  h3 {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 19px;
    font-weight: 700;
  }
`
export const Menu = styled.div`
  overflow: hidden;
  border-radius: 10px;
  background: white;
`
export const MenuButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  width: 100%;
  min-height: 52px;
  align-items: center;
  padding: 12px 13px;
  color: ${({ $danger }) => ($danger ? '#e45c55' : '#344f45')};
  text-align: left;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-divider);
  }
  &:focus-visible {
    outline-offset: -3px;
  }
`
export const AccountSection = styled.section`
  padding-top: 40px;
  margin-top: auto;
`
export const ActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 25;
  width: 100%;
  max-width: var(--container-app);
  transform: translateX(-50%);
  padding: 10px 20px calc(19px + env(safe-area-inset-bottom, 0px));
  border: 1px solid var(--color-border);
  background: white;
`
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
  }
  input,
  textarea,
  select {
    width: 100%;
    min-height: 40px;
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 14px;
  }
`
export const MemberList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  li {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  span {
    color: var(--color-muted);
    font-size: 12px;
  }
`
export const InviteUrl = styled.input`
  width: 100%;
  min-height: 40px;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 13px;
`
export const SelectionContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 20px;
  h2 {
    font-size: 18px;
    font-weight: 700;
  }
  p {
    color: var(--color-muted);
    font-size: 14px;
    line-height: 1.6;
  }
`
export const GroupCard = styled.button`
  padding: 20px;
  border-radius: var(--radius-app-bar);
  background: white;
  text-align: left;
  box-shadow: var(--shadow-app-bar);
  cursor: pointer;
  h2 {
    margin-bottom: 6px;
  }
`
