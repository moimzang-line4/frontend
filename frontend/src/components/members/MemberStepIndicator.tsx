import styled from "styled-components";

export type MemberStep = "home" | "create" | "link" | "detail";

interface Props {
  currentStep: MemberStep;
}

const steps: { id: MemberStep; label: string }[] = [
  { id: "home", label: "명단 홈" },
  { id: "create", label: "명단방 생성" },
  { id: "link", label: "링크 관리" },
  { id: "detail", label: "명단 조회" },
];

export default function MemberStepIndicator({ currentStep }: Props) {
  return (
    <Container>
      {steps.map((step) => (
        <Step key={step.id} $active={currentStep === step.id}>
          {step.label}
        </Step>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  gap: 4px;
  background: #eef0f1;
  border-radius: 30px;
`;

const Step = styled.div<{ $active: boolean }>`
  flex: 1;
  padding: 9px 0;
  text-align: center;
  white-space: nowrap;
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? "#378c7c" : "#9ca5a5")};
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  border-radius: 20px;
`;