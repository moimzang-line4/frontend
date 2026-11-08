# 공통 레이아웃

- `Header.tsx`: 제목, 뒤로가기, 선택적인 우측 액션을 표시합니다.
- `Footer.tsx`: 홈 / 부원 / AI / 운영 공간 / 자료실의 하단 내비게이션입니다.
- `MainLayout.tsx`: 헤더와 고정 푸터 사이에 React Router의 `Outlet`을 표시합니다.

세 컴포넌트는 `BrowserRouter` 안에서 사용합니다.

```tsx
<Route element={<MainLayout title="그룹 만들기" />}>
  <Route path="/groups/new" element={<CreateGroupPage />} />
</Route>
```

`Header`의 `showBack={false}`로 뒤로가기를 숨기고, `onBack`으로 기본 동작을 바꿀 수 있습니다. 기본 뒤로가기는 앱 내 이전 페이지로 이동하며, 직접 접속한 경우 홈으로 이동합니다.

하단 메뉴의 경로는 임시로 `/`, `/members`, `/ai`, `/operations`, `/files`를 사용합니다. `App.tsx`의 본문은 임시 페이지이며 실제 기능은 포함하지 않습니다. 실제 경로가 정해지면 `Footer.tsx`의 `defaultFooterItems`와 라우트를 함께 변경하세요. `MainLayout`의 `footerItems`로 같은 순서의 5개 메뉴를 주입할 수도 있습니다.

## 공통 스타일

`src/index.css`의 Tailwind v4 `@theme`에서 관리합니다.

| 클래스 | 용도 |
| --- | --- |
| `font-sans` | 기본 SUIT 폰트, 100~900 가변 굵기 |
| `bg-primary` | AI 버튼의 민트색 `#7CBFB2` |
| `text-primary-strong` | 활성 메뉴 `#3F8275` |
| `text-ink` | 기본 텍스트 `#17251E` |
| `text-muted` | 비활성 메뉴 `#81958F` |
| `bg-surface` | 흰색 표면 |
| `border-border`, `border-divider` | 테두리와 구분선 |
| `text-page-title` | 18px / 26px 페이지 제목 |
| `text-nav`, `text-nav-ai` | 10px 일반 메뉴 / 11px AI 메뉴 |
| `shadow-app-bar`, `drop-shadow-ai` | 헤더와 AI 버튼 그림자 |
| `max-w-app` | 디자인 기준 최대 너비 390px |

현재 토큰은 제공된 헤더·푸터에서 확인한 값입니다. Figma 파일에는 이 노드들에 연결된 변수가 없었습니다. 전체 서비스의 다른 화면용 색상은 해당 디자인을 확인한 뒤 추가하세요.

## 디자인 및 에셋

- Figma 파일: `WtBeexhL8yraARVPZslbKr`
- 헤더: `73:2661`, 푸터: `66:2306`
- `src/assets/navigation/`의 SVG는 해당 노드의 원본을 내보낸 파일입니다. 임시 Figma URL은 런타임에서 사용하지 않습니다.
- SUIT Variable은 `public/fonts/`에서 직접 제공하며 SIL Open Font License를 함께 포함합니다. 배포 원본: https://cdn.jsdelivr.net/gh/sunn-us/SUIT@2/fonts/variable/woff2/SUIT-Variable.woff2
- 모바일 시각·배터리·홈 인디케이터는 시스템 UI이므로 제외했습니다. 기기의 안전 영역은 `env(safe-area-inset-*)`로 처리합니다.
- 작은 화면에서는 너비에 맞추고, 넓은 화면에서는 390px로 가운데 정렬합니다. 곡선 SVG는 원본 크기를 유지하고 좁은 화면에서 양옆을 자릅니다.
- Vercel은 Root Directory를 `frontend`로 지정하세요. 그 폴더의 `vercel.json`이 SPA 경로 새로고침을 처리합니다.
