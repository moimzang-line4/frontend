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
  display: flex;
  gap: 5px;
  background: #f0f0f0;
  border-radius: 16px;
  margin-top: -8px;
`;

const Step = styled.div<{ $active: boolean }>`
  flex: 1;
  padding: 9px 0;
  text-align: center;
  white-space: nowrap;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#367D70" : "#78918C")};
  background: ${({ $active }) => ($active ? "#ffffff" : "#f0f0f0")};
  border-radius: 14px;
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 5px 0 rgba(54, 125, 112, 0.09)" : "none"};
`;