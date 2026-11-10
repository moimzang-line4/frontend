import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
`;

// MainLayout 상단 여백(24px) → 피그마 13px에 맞춤
// 하단 고정 버튼 영역(10 + 55 + 20 + border 1)만큼 비워둠
export const FormContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    margin-top: -11px;
    padding-bottom: calc(28px + 86px + env(safe-area-inset-bottom, 0px));
`;

export const Fields = styled.div`
    display: flex;
    flex-direction: column;
    gap: 7px;
    width: 100%;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
`;

export const Label = styled.label`
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: #18251f;
`;

export const Input = styled.input`
    width: 100%;
    height: 38px;
    padding: 0 13px;
    border: 1px solid transparent;
    border-radius: 10px;
    outline: none;
    background: #ffffff;
    font-size: 13px;
    line-height: 20px;
    color: #253f3b;

    &::placeholder {
        color: #91a39f;
        opacity: 1;
    }

    &:focus {
        border-color: #5aa997;
    }
`;

export const DeleteButton = styled.button`
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    color: #d34a4a;
    cursor: pointer;
`;

export const BottomAction = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    z-index: 30;
    width: 100%;
    max-width: var(--container-app);
    transform: translateX(-50%);
    padding: 10px 20px calc(20px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid #ddece7;
    background: #ffffff;
`;
