import * as S from '../../styles/members/MemberSearchBar.styles'

interface Props {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function MemberSearchBar({
    value,
    onChange,
    placeholder = '이름, 학과, 전화번호 검색',
}: Props) {
    return (
        <S.SearchContainer>
            <S.SearchIcon
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
            </S.SearchIcon>

            <S.SearchInput
                type="search"
                placeholder={placeholder}
                aria-label="부원 검색"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </S.SearchContainer>
    )
}
