import { useEffect, useRef, useState } from "react";
import type { MemberInfo } from "../../types/members/memberInfo";
import { MEMBER_TABLE_COLUMNS } from "../../constants/members/memberFields";
import * as S from "../../styles/members/MemberTable.styles";

interface Props {
    members: MemberInfo[];
    onEdit: (id: number) => void;
}

export default function MemberTable({ members, onEdit }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    // 가로 스크롤 위치 표시줄 (보이는 비율, 스크롤 진행도)
    const [scroll, setScroll] = useState({ ratio: 1, progress: 0 });

    const updateScroll = () => {
        const el = wrapperRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        setScroll({
            ratio: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
            progress: max > 0 ? el.scrollLeft / max : 0,
        });
    };

    useEffect(() => {
        updateScroll();
        window.addEventListener("resize", updateScroll);
        return () => window.removeEventListener("resize", updateScroll);
    }, []);

    return (
        <>
        <S.TableWrapper ref={wrapperRef} onScroll={updateScroll}>
            <S.Table>
                <colgroup>
                    <col style={{ width: 80 }} />
                    {MEMBER_TABLE_COLUMNS.map((column) => (
                        <col key={column.key} style={{ width: column.width }} />
                    ))}
                    <col style={{ width: 52 }} />
                </colgroup>

                <thead>
                    <tr>
                        <S.HeadCell scope="col" $sticky>
                            이름
                        </S.HeadCell>
                        {MEMBER_TABLE_COLUMNS.map((column) => (
                            <S.HeadCell key={column.key} scope="col">
                                {column.label}
                            </S.HeadCell>
                        ))}
                        <S.HeadCell scope="col">수정</S.HeadCell>
                    </tr>
                </thead>

                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <S.NameCell scope="row">{member.name}</S.NameCell>
                            {MEMBER_TABLE_COLUMNS.map((column) => (
                                <S.Cell key={column.key}>
                                    {member[column.key] || "—"}
                                </S.Cell>
                            ))}
                            <S.EditCell>
                                <S.EditButton
                                    type="button"
                                    onClick={() => onEdit(member.id)}
                                    aria-label={`${member.name} 정보 수정`}
                                >
                                    ✎
                                </S.EditButton>
                            </S.EditCell>
                        </tr>
                    ))}
                </tbody>
            </S.Table>
        </S.TableWrapper>

        {scroll.ratio < 1 && (
            <S.ScrollIndicator aria-hidden="true">
                <S.ScrollTrack>
                    <S.ScrollThumb
                        style={{
                            width: `${scroll.ratio * 100}%`,
                            left: `${scroll.progress * (1 - scroll.ratio) * 100}%`,
                        }}
                    />
                </S.ScrollTrack>
            </S.ScrollIndicator>
        )}
        </>
    );
}
