import styled from 'styled-components'

// MainLayout 상단 여백(24px) → 피그마 16px에 맞춤
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  margin-top: -8px;
  padding-bottom: 24px;
`

export const GroupInfo = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 16px;
`

export const GroupTitleRow = styled.div`
  display: flex;
  height: 28px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const GroupTitle = styled.h2`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 17px;
  line-height: 26px;
  font-weight: 700;
  color: #19251f;
`

export const MemberCount = styled.p`
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: #78918c;
`

export const LinkCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid #ddece7;
  border-radius: 16px;
  background: #ffffff;
`

export const CardTitle = styled.h3`
  font-size: 14px;
  line-height: 21px;
  font-weight: 700;
  color: #19251f;
`

export const LinkBox = styled.div`
  display: flex;
  height: 44px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f7f8fa;
`

export const LinkText = styled.span`
  min-width: 0;
  flex: 1 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 19px;
  color: #53625a;
`

export const CopyButton = styled.button`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 10px;
  background: #438b7e;
  font-size: 14px;
  line-height: 22px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;

  &:active {
    filter: brightness(0.95);
  }

  /* 마감된 명단방: 회색 비활성 */
  &:disabled {
    background: #c8cdcb;
    cursor: default;
    filter: none;
  }
`

export const CardDescription = styled.p`
  font-size: 12px;
  line-height: 19px;
  color: #78918c;
`

export const PreviewSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

export const SectionTitle = styled.h3`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #253f3b;
`

export const PreviewButton = styled.button`
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  border: 1px solid #ddece7;
  border-radius: 10px;
  background: #ffffff;
  font-size: 13px;
  line-height: 20px;
  font-weight: 700;
  color: #253f3b;
  cursor: pointer;

  &:active {
    background: #f7f8fa;
  }
`

export const Note = styled.p`
  font-size: 11px;
  line-height: 18px;
  color: #78918c;
`
