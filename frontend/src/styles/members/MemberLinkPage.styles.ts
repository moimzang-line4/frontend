import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const GroupInfo = styled.section`
  margin-top: 36px;
  padding: 0 16px;
`

export const GroupTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const GroupTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #18251f;
`

export const MemberCount = styled.p`
  margin-top: 12px;
  font-size: 13px;
  color: #78918c;
`

export const LinkCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: 32px;
  padding: 16px;

  border: 1px solid #ddece7;
  border-radius: 16px;
  background: #ffffff;
`

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #18251f;
`

export const LinkBox = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  min-height: 44px;
  padding: 12px;
  box-sizing: border-box;

  border-radius: 10px;
  background: #f7f8fa;

  font-size: 12px;
  color: #78918c;

  overflow-wrap: anywhere;
`

export const Description = styled.p`
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  color: #78918c;
`

export const PreviewSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;

  margin-top: 24px;
`

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #18251f;
`

export const PreviewButton = styled.button`
  width: 100%;
  height: 48px;

  border: 1px solid #ddece7;
  border-radius: 10px;

  background: #ffffff;
  color: #344a43;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  &:active {
    background: #f7f8fa;
  }
`