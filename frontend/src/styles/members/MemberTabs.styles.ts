import styled from "styled-components";
import { NavLink } from "react-router";

export const TabList = styled.nav`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 33px;
    flex-shrink: 0;
    border-radius: 16px;
    background: #f0f0f0;
`;

export const Tab = styled(NavLink)`
    display: flex;
    flex: 1 0 0;
    height: 32px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    font-size: 12px;
    line-height: 140%;
    font-weight: 500;
    color: #78918c;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;

    &[aria-current="page"] {
        border-radius: 999px;
        background: #ffffff;
        box-shadow: 0 2px 5px 0 rgba(54, 125, 112, 0.09);
        font-weight: 700;
        color: #367d70;
    }
`;
