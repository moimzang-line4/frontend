import styled from "styled-components";

interface Props {
  label: string;
  enabled: boolean;
  onChange: () => void;
}

export default function MemberFieldToggle({
  label,
  enabled,
  onChange,
}: Props) {
  return (
    <Container $enabled={enabled}>
      <Label>{label}</Label>

      <Toggle
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${label} 입력 여부`}
        $enabled={enabled}
        onClick={onChange}
      >
        <Circle $enabled={enabled} />
      </Toggle>
    </Container>
  );
}

const Container = styled.div<{ $enabled: boolean }>`
  height: 48px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2eeeb;
  border-radius: 10px;
  background: ${({ $enabled }) =>
    $enabled ? "#f0faf6" : "#f7f9f9"};
`;

const Label = styled.span`
    font-size: 14px;
    color: #253f3b;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
`;

const Toggle = styled.button<{ $enabled: boolean }>`
  width: 40px;
  height: 24px;
  padding: 3px;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 12px;
  background: ${({ $enabled }) =>
    $enabled ? "#438b7e" : "#dce5e2"};
  cursor: pointer;
  transition: background 0.2s;
`;

const Circle = styled.span<{ $enabled: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  transform: ${({ $enabled }) =>
    $enabled ? "translateX(15px)" : "translateX(0)"};
  transition: transform 0.2s;
`;