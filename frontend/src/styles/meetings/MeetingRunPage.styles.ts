import styled from 'styled-components'
import Button from '../../components/Button'
import * as Base from './MeetingPage.styles'

export {
  Page,
  Heading,
  ProgressCard,
  ProgressHeading,
  ProgressText,
  Progress,
  Status,
  Required,
  Error,
  Notice,
  OutlineButton,
} from './MeetingPage.styles'

export const Content = styled(Base.Content)`
  gap: 16px;
  margin-top: 12px;
  padding: 12px 20px max(20px, env(safe-area-inset-bottom, 0px));
  background: #fdfefe;
`

export const Tabs = styled(Base.AgendaTabs)`
  gap: 10px;
  min-height: 33px;
`

export const Tab = styled(Base.AgendaTab)`
  flex: 1 0 90px;
  min-width: 90px;
  min-height: 33px;
  padding: 6px 10px;

  &:disabled {
    cursor: default;
  }
`

export const AgendaCard = styled(Base.Card)`
  padding: 4px 0 14px;
`

export const AgendaHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;

  h3 {
    color: #78918c;
    font-size: 13px;
    font-weight: 700;
    line-height: 18px;
  }
`

export const Preparation = styled.p`
  min-height: 44px;
  margin: 0 16px 12px;
  padding: 10px 13px;

  border: 1px solid #ddece7;
  border-radius: 10px;
  background: #f0f0f0;

  color: #253f3b;
  font-size: 12px;
  line-height: 20px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;

  color: #78918c;
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
`

export const Textarea = styled(Base.Textarea)`
  min-height: 110px;
  font-weight: 400;
`

export const Primary = styled(Button)`
  height: 48px;
  border: 1px solid rgb(255 255 255 / 45%);
  border-radius: 12px;

  font-size: 16px;
  line-height: 24px;

  box-shadow: 0 5px 14px rgb(63 141 124 / 17%);
`

export const Secondary = styled.button`
  width: 100%;
  min-height: 44px;
  padding: 10px 13px;

  border: 1px solid #ddece7;
  border-radius: 12px;
  background: white;

  color: #ea5a55;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;

  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`