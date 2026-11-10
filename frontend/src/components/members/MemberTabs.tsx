import * as S from "../../styles/members/MemberTabs.styles";

interface Props {
    groupId: number;
}

const tabs = [
    { label: "명단 조회", path: "" },
    { label: "링크 관리", path: "/link" },
    { label: "명단방 수정", path: "/settings" },
];

export default function MemberTabs({ groupId }: Props) {
    return (
        <S.TabList aria-label="명단방 메뉴">
            {tabs.map((tab) => (
                <S.Tab
                    key={tab.label}
                    to={`/members/${groupId}${tab.path}`}
                    end
                    replace
                >
                    {tab.label}
                </S.Tab>
            ))}
        </S.TabList>
    );
}
