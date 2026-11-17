import styled, { css } from 'styled-components'
import Button from '../../components/Button'

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 6px;
`

// 검색 · 분류 · 내역 (피그마: gap 16)
export const Tools = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

// +직접 입력 · 내역 카드 (피그마: gap 8)
export const ListGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

// 피그마: 정산_명단 카드
export const Balance = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 15px;
  border: 1px solid #fff;
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 1px 2px 0 rgba(255, 255, 255, 0.8) inset,
    0 6px 18px 0 rgba(63, 141, 124, 0.09);
  color: #1b1e20;
`

// 현재 잔액 + 금액 (피그마: padding 12px 0, gap 8)
export const BalanceTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
`

export const BalanceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  > span {
    font-size: 14px;
    font-weight: 400;
    color: #1b1e20;
  }
  button {
    color: #777;
    font-size: 11px;
    font-weight: 400;
    cursor: pointer;
  }
  button:disabled {
    cursor: wait;
  }
`

export const Total = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #1b1e20;
  overflow-wrap: anywhere;
`

export const Totals = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0;

  > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  dt {
    color: #888;
    font-size: 11px;
    font-weight: 400;
  }
  dd {
    margin: 0;
    overflow-wrap: anywhere;
    font-size: 14px;
    font-weight: 700;
    color: #1b1e20;
  }
  > div:first-child dd {
    color: #08a23a;
  }
`

export const Filters = styled.div`
  display: flex;
  gap: 6px;
`

export const Filter = styled.button<{ $active: boolean }>`
  min-height: 32px;
  padding: 5px 12px;
  border: 1px solid ${({ $active }) => ($active ? '#367d70' : '#ddece7')};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#367d70' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#78918c')};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
`

export const Manual = styled.button`
  align-self: stretch;
  text-align: right;
  color: #3f8275;
  font-size: 12px;
  font-weight: 700;
  line-height: 140%;
  cursor: pointer;
`

// 피그마: 내역 카드 (높이 336, 안에서 스크롤)
export const Entries = styled.div`
  height: 336px;
  overflow-y: auto;
  padding: 20px 20px 20px 14px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 7px 18px 0 rgba(63, 141, 124, 0.1);
`

export const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const InitialEmpty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-height: 296px;
  text-align: center;
  strong {
    color: #78918c;
    font-size: 14px;
    font-weight: 700;
  }
  p {
    color: #91a39f;
    font-size: 12px;
    line-height: 20px;
  }
`

const entryColumns = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px 28px;
  align-items: center;
  gap: 12px;
`

export const EntryHeading = styled.div`
  ${entryColumns}
  color: #367d70;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  span:nth-child(2),
  span:last-child {
    text-align: center;
  }
`

export const Entry = styled.button<{ $income: boolean }>`
  ${entryColumns}
  width: 100%;
  text-align: left;
  cursor: pointer;

  > span:first-child {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
    color: #222;
  }
  small {
    color: #999;
    font-size: 10px;
  }
  > span:nth-child(2) {
    min-width: 0;
    text-align: center;
    overflow-wrap: anywhere;
    font-size: 13px;
    font-weight: ${({ $income }) => ($income ? 700 : 400)};
    color: ${({ $income }) => ($income ? '#06a23a' : '#202020')};
  }
  > span:last-child {
    display: grid;
    place-items: center;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 20px;
`

export const Fields = styled.div`
  overflow: hidden;
  border: 1px solid #ddece7;
  border-radius: 16px;
  background: white;
  box-shadow: var(--shadow-app-bar);
`

export const Field = styled.div`
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 6px 16px;
  border-bottom: 1px solid #edf1ee;
  &:last-child {
    border-bottom: 0;
  }
  > label,
  > span:first-child {
    flex-shrink: 0;
    width: 80px;
    font-size: 13px;
    font-weight: 700;
    color: #78918c;
  }
  em {
    color: #e45c55;
    font-style: normal;
  }
  input {
    flex: 1;
    min-width: 0;
    width: 100%;
    min-height: 38px;
    background: transparent;
    color: #253f3b;
    font-size: 14px;
  }
  input::placeholder {
    color: #253f3b;
  }
  input[type='date'] {
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    padding: 6px 10px;
  }
  > small {
    font-size: 13px;
  }
`

export const Type = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex: 1;
`

export const TypeButton = styled.button<{ $active: boolean }>`
  min-width: 52px;
  min-height: 28px;
  border: 1px solid #edf1ee;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#d9d9d9' : 'white')};
  color: ${({ $active }) => ($active ? '#263e3a' : '#78918c')};
  font-size: 12px;
  cursor: pointer;
`

export const Submit = styled(Button)`
  height: 48px;
  font-size: 16px;
  border-radius: 12px;
`

export const SourceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h2 {
    flex: 1;
    font-size: 17px;
    font-weight: 700;
  }
  button {
    min-height: 32px;
    font-size: 11px;
    color: var(--color-primary-strong);
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`

export const DateControl = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  border: 1px solid #f0f0f0;
  border-radius: 10px;

  min-height: 38px;

  > span {
    width: 100%;
    padding-inline: 34px 30px;
    font-size: 13px;
    pointer-events: none;
  }

  &:focus-within {
    outline: 2px solid var(--color-primary-strong);
    outline-offset: 2px;
  }

  input[type='date'] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    border: 0;
    padding-inline: 34px 30px;
  }
  img {
    position: absolute;
    pointer-events: none;
  }
  img:first-child {
    left: 10px;
  }
  img:last-child {
    right: 8px;
  }
  input::-webkit-calendar-picker-indicator {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`

// ───── 피그마: 장부 상세 (시작 잔액) ─────

// 기록이 없을 때 시작 잔액 카드
export const StartCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ddece7;
  border-radius: 16px;
  background: #fff;
`

export const StartHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const StartTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  color: #19251f;
`

export const StartDescription = styled.p`
  font-size: 12px;
  line-height: 19px;
  color: #78918c;
`

export const StartForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

// 금액 입력칸: 오른쪽에 '원' (+ 수정 중이면 '저장' 버튼)
export const AmountBox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 8px 10px;
  border: 1px solid #b3b3b3;
  border-radius: 10px;
  background: #fff;

  input {
    flex: 1;
    min-width: 0;
    background: transparent;
    font-size: 16px;
    line-height: 19px;
    color: #647269;
  }
  input::placeholder {
    color: #647269;
  }
  > span {
    font-size: 16px;
    line-height: 19px;
    color: #647269;
  }
`

export const StartSubmit = styled.button`
  height: 48px;
  border-radius: 10px;
  background: #438b7e;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`

// 현재 잔액 카드 안 '시작 잔액 50,000,000원 [수정]' 줄
export const StartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 44px;
  padding: 8px 10px;
  border: 1px solid #b3b3b3;
  border-radius: 10px;
  background: #f2f2f2;

  strong {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    color: #000;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    color: #000;
  }
`

export const Pill = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 41px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid #5aa997;
  border-radius: 999px;
  background: transparent;
  color: #3f8275;
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`

// 장부 목록 아래 '장부 내역 엑셀 다운로드'
export const Download = styled.button`
  height: 48px;
  padding: 0 13px;
  border: 1px solid #ddece7;
  border-radius: 12px;
  background: #fff;
  color: #367d70;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`
