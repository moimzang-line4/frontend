import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 390px;
  min-height: 100dvh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  background: #f7f8fa;
`

export const Header = styled.header`
  display: flex;
  align-items: center;

  height: 76px;
  padding: 0 20px;
  flex-shrink: 0;

  background: #ffffff;
  border-radius: 0 0 16px 16px;

  box-shadow: 0 5px 14px rgba(63, 143, 128, 0.08);
`

export const HeaderTitle = styled.h1`
  margin: 0;

  font-size: 18px;
  font-weight: 700;
  color: #18251f;
`

export const Content = styled.main`
  flex: 1;
  padding: 16px 20px;
`

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #18251f;
`

export const Input = styled.input`
  width: 100%;
  height: 42px;

  box-sizing: border-box;
  padding: 0 14px;

  border: 1px solid #ddece7;
  border-radius: 10px;

  background: #ffffff;
  color: #344a43;

  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #78918c;
    opacity: 1;
  }

  &:focus {
    border-color: #459887;
  }
`

export const Agreement = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 6px;

  margin-top: 20px;
  cursor: pointer;
`

export const Checkbox = styled.input`
  width: 14px;
  height: 14px;
  margin: 0;

  accent-color: #459887;
  cursor: pointer;
`

export const AgreementText = styled.span`
  font-size: 11px;
  line-height: 16px;
  color: #a8a8a8;
`

export const BottomAction = styled.div`
  position: sticky;
  bottom: 0;

  width: 100%;
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom, 0px));

  box-sizing: border-box;

  border-top: 1px solid #e4ebe8;
  background: #ffffff;
`

/* 등록 완료 화면 (피그마: 등록 완료) */
export const CompleteContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 95px 20px 40px;
  text-align: center;
`

export const CompleteIcon = styled.svg`
  flex-shrink: 0;
  margin-bottom: 20px;
`

export const CompleteTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  line-height: 23px;
  font-weight: 700;
  color: #253f3b;
`

export const CompleteDescription = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 19px;
  color: #78918c;
`

export const GroupCard = styled.div`
  display: flex;
  width: 262px;
  max-width: 100%;
  align-items: center;
  gap: 22px;
  margin-top: 16px;
  padding: 12px 26px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
  text-align: left;
`

export const GroupIcon = styled.svg`
  flex-shrink: 0;
  color: #96cebc;
`

export const GroupText = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
`

export const GroupLabel = styled.span`
  font-size: 12px;
  line-height: 18px;
  color: #69766f;
`

export const GroupName = styled.strong`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  line-height: 26px;
  font-weight: 700;
  color: #17231c;
`

// 미리보기 안내 (링크 관리 → 부원 등록 폼 미리보기)
export const PreviewNotice = styled.p`
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #e6f4f0;
  font-size: 13px;
  line-height: 140%;
  color: #367d70;
`

// 마감·없는 링크 안내: 화면 가운데에 아이콘 + 제목 + 설명
export const NoticeContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 120px;
  text-align: center;
`
