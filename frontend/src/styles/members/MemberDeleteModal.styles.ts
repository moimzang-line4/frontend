import styled from "styled-components";

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    /* 뒤 화면 색은 그대로 두고 클릭만 막음 */
    background: transparent;
`;

export const Modal = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 342px;
    padding: 22px 20px;
    border-radius: 20px;
    background: #ffffff;
    /* 배경을 어둡게 하지 않으므로 그림자로 구분 */
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(0, 0, 0, 0.06);
`;

export const Title = styled.h3`
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
    color: #253f3b;
`;

export const Description = styled.p`
    margin-top: 8px;
    white-space: pre-line;
    font-size: 13px;
    line-height: 22px;
    font-weight: 400;
    color: #647269;
`;

export const Actions = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 20px;
`;

const ModalButton = styled.button`
    display: flex;
    flex: 1 0 0;
    height: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 14px;
    line-height: 26px;
    font-weight: 700;
    cursor: pointer;

    &:active {
        filter: brightness(0.96);
    }
`;

export const CancelButton = styled(ModalButton)`
    background: #f1f5f3;
    color: #253f3b;
`;

export const ConfirmButton = styled(ModalButton)`
    background: #e45c55;
    color: #ffffff;
`;
