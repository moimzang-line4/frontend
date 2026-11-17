import styled from 'styled-components'
import * as Base from './MeetingPage.styles'
import { Primary } from './MeetingRunPage.styles'

export { Page, Heading, Error, OutlineButton } from './MeetingPage.styles'
export { Primary }
export const Content = styled(Base.Content)`
  padding-top: 16px;
`
export const Ended = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 92px;
  padding: 14px;
  margin-bottom: 0;
  border-bottom: 1px solid #edf1ee;
  h2 {
    font-size: 16px;
    line-height: 23px;
    font-weight: 700;
  }
  p {
    color: #78918c;
    font-size: 12px;
    line-height: 19px;
  }
`
export const RecordHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-size: 16px;
    font-weight: 700;
  }
  button {
    min-height: 28px;
    color: #367d70;
    font-size: 12px;
    cursor: pointer;
  }
`
export const Records = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
export const SummaryStatus = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  color: #78918c;
  font-size: 11px;
  line-height: 18px;
  strong {
    padding: 3px 9px;
    border-radius: 999px;
    background: #e5f4ea;
    color: #367d70;
    font-size: 10px;
  }
`
export const SummaryCard = styled(Base.Card)`
  box-shadow: none;
`
export const SummaryHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 10px;
  h3 {
    flex: 1;
    font-size: 16px;
    font-weight: 700;
  }
  button {
    color: #78918c;
    font-size: 12px;
    min-height: 24px;
    cursor: pointer;
  }
  img {
    width: 20px;
    height: 20px;
    filter: brightness(0) saturate(100%) invert(22%) sepia(15%) saturate(1092%)
      hue-rotate(120deg);
  }
`
export const SummaryText = styled.textarea`
  display: block;
  width: calc(100% - 32px);
  min-height: 244px;
  margin: 0 16px 10px;
  padding: 10px 12px;
  resize: vertical;
  border: 1px solid #ddece7;
  border-radius: 10px;
  background: white;
  color: #253f3b;
  font-size: 12px;
  line-height: 20px;
`
export const Note = styled.p`
  border-top: 1px solid #edf1ee;
  padding: 10px 14px;
  color: #78918c;
  font-size: 11px;
  line-height: 18px;
`
export const TextButton = styled.button`
  align-self: flex-start;
  color: #253f3b;
  font-size: 12px;
  min-height: 28px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
export const Regenerate = styled(TextButton)`
  align-self: center;
  color: #536c66;
`
export const Hint = styled.p`
  color: #78918c;
  font-size: 11px;
  line-height: 18px;
`
