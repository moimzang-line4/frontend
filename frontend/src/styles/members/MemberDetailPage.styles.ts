import styled from "styled-components";

// MainLayout 상단 여백(24px) → 피그마 16px에 맞춤
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    min-width: 0;
    margin-top: -8px;
    padding-bottom: 36px;
`;

export const TopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

export const MemberCount = styled.span`
    font-size: 17px;
    line-height: 26px;
    font-weight: 700;
    color: #19251f;
`;

export const AddButton = styled.button`
    padding: 4px 0 4px 8px;
    font-size: 12px;
    line-height: 18px;
    font-weight: 700;
    color: #367d70;
    cursor: pointer;
`;

export const ScrollHint = styled.p`
    display: flex;
    height: 20px;
    align-items: center;
    justify-content: flex-end;
    font-size: 11px;
    line-height: 20px;
    color: #78918c;
`;

export const EmptyText = styled.p`
    padding: 40px 0;
    text-align: center;
    font-size: 13px;
    line-height: 20px;
    color: #78918c;
`;

// 피그마: 표 아래 버튼 영역 간격 18px (기본 간격 12 + 6)
export const CopyButton = styled.button`
    display: flex;
    width: 100%;
    height: 44px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin-top: 6px;
    border: 1px solid #ddece7;
    border-radius: 12px;
    background: #ffffff;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: #367d70;
    cursor: pointer;

    &:active {
        background: #f7f8fa;
    }
`;

export const DeleteGroupButton = styled.button`
    margin-top: 6px;
    display: flex;
    width: 100%;
    height: 44px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddece7;
    border-radius: 12px;
    background: #ffffff;
    font-size: 14px;
    line-height: 140%;
    font-weight: 700;
    color: #ea5a55;
    cursor: pointer;

    &:active {
        background: #fdf4f3;
    }
`;
