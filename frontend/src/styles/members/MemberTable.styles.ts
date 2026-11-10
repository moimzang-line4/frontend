import styled, { css } from "styled-components";

const ROW_BORDER = "1px solid rgba(224, 235, 229, 0.65)";

export const TableWrapper = styled.div`
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const Table = styled.table`
    width: 760px;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
`;

// 이름 열은 가로 스크롤 시에도 고정
const stickyColumn = css`
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--color-page-background);
`;

const cellBase = css`
    height: 52px;
    padding: 0 12px;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    line-height: 20px;
    color: #253f3b;
    border-bottom: ${ROW_BORDER};
`;

export const HeadCell = styled.th<{ $sticky?: boolean }>`
    height: 42px;
    padding: 0 12px;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: #367d70;

    ${({ $sticky }) => $sticky && stickyColumn}
`;

export const NameCell = styled.th`
    ${cellBase}
    ${stickyColumn}
    font-weight: 700;
`;

export const Cell = styled.td`
    ${cellBase}
    font-weight: 400;
`;

export const EditCell = styled.td`
    ${cellBase}
    padding: 0;
    text-align: center;
`;

export const EditButton = styled.button`
    display: inline-flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    line-height: 20px;
    color: #367d70;
    cursor: pointer;
`;

// 피그마: 표 아래 가로 스크롤 위치 (이름 열 80px 이후부터 표시)
export const ScrollIndicator = styled.div`
    display: flex;
    width: 100%;
    height: 8px;
    margin-top: -4px;
    padding-left: 80px;
    align-items: flex-start;
`;

export const ScrollTrack = styled.div`
    position: relative;
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: #e9efeb;
`;

export const ScrollThumb = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    border-radius: 3px;
    background: #78918c;
`;
