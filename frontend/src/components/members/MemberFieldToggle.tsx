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
  height: 43px;
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
  font-size: 12px;
  color: #444444;
`;

const Toggle = styled.button<{ $enabled: boolean }>`
  width: 36px;
  height: 21px;
  padding: 3px;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 20px;
  background: ${({ $enabled }) =>
    $enabled ? "#459887" : "#dce7e3"};
  cursor: pointer;
  transition: background 0.2s;
`;

const Circle = styled.span<{ $enabled: boolean }>`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  transform: ${({ $enabled }) =>
    $enabled ? "translateX(15px)" : "translateX(0)"};
  transition: transform 0.2s;
`;