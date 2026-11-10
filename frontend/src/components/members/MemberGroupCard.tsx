import styled from "styled-components";
import type { MemberGroup, MemberGroupStatus } from "../../types/members/member";

interface Props {
  group: MemberGroup;
  onClick: (id: number) => void;
}

export default function MemberGroupCard({ group, onClick }: Props) {
  return (
    <Card type="button" onClick={() => onClick(group.id)}>
      <Info>
        <Status $status={group.status}>
          {group.status === "open" ? "등록중" : "등록완료"}
        </Status>

        <Name>{group.name}</Name>
        <Count>현재 등록 인원 {group.memberCount}명</Count>
      </Info>

      <Arrow aria-hidden="true">›</Arrow>
    </Card>
  );
}

const Card = styled.button`
  width: 100%;
  min-height: 85px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
    border-radius: 16px;
    border: 1px solid #FFF;
    background: linear-gradient(127deg, #FFF 10.71%, #F3FAF7 82.14%);
    box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.80) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
    text-align: left;
    cursor: pointer;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Status = styled.span<{ $status: MemberGroupStatus }>`
    padding: 0 6px;
    border-radius: 11.5px;
    font-size: 10px;
    font-weight: 700;
    background: ${({ $status }) =>
    $status === "open" ? "#DCE8FE" : "#eeeeee"};
    color: ${({ $status }) =>
    $status === "open" ? "#4F75F8" : "#424242"};
`;

const Name = styled.h3`
  margin: 6px 0 3px;
  font-size: 18px;
  font-weight: 700;
  color: #17231C;
`;

const Count = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #69766F;
`;

const Arrow = styled.span`
  font-size: 40px;
  color: #000000;
`;