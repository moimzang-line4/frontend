<div align="center">

<img src="assets/moimzang.svg" width="320" alt="MOIMZANG 로고" />

### 모임의 시작부터 운영의 끝까지, 한곳에서.

**일정과 출석, 회의와 정산, 자료까지.**  
흩어진 동아리 운영 업무를 하나의 흐름으로 연결하는 모임 운영 관리 서비스

<br />

![React](https://img.shields.io/badge/React_19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white)

<br />

[**프로젝트 소개**](#-about-moimzang) · [**주요 기능**](#-key-features) · [**기술 스택**](#-tech-stack) · [**시작하기**](#-getting-started)

</div>

<br />

---

## ✨ About MOIMZANG

> **모임은 즐겁게, 운영은 간편하게.**

동아리나 소모임을 운영하다 보면 일정은 캘린더에, 출석은 스프레드시트에, 회의록과 자료는 여러 채널에 흩어지기 쉽습니다.

**모임장(MOIMZANG)** 은 이러한 번거로움을 줄이고, 운영진이 모임의 활동과 구성원 관리에 더 집중할 수 있도록 돕는 **올인원 모임 운영 서비스**입니다.

- **한곳에 모으기** — 일정, 출석, 회의, 자료, 회계 기록을 통합 관리합니다.
- **운영 과정 연결하기** — 활동을 계획하고 진행하고 기록하는 흐름을 지원합니다.
- **운영 부담 줄이기** — 반복적인 관리 업무를 명확하고 편리한 UI로 정리합니다.

<br />

## 🧩 Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>📅 일정 · 출석</h3>
      모임 일정을 등록하고, 일정별 활동과 출석을 관리합니다.
    </td>
    <td width="50%" valign="top">
      <h3>👥 구성원 · 운영진</h3>
      구성원 정보를 관리하고, 모임 설정을 다룹니다.
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h3>🗣️ 회의 · 회의록</h3>
      회의를 진행하며, 운영 내용을 기록하고 다시 확인합니다.
    </td>
    <td valign="top">
      <h3>💳 정산 · 장부</h3>
      차수별 정산, 영수증 작업과 장부 기록을 관리합니다.
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h3>📁 자료실</h3>
      모임 자료를 업로드하고 미리보기로 확인합니다.
    </td>
    <td valign="top">
      <h3>✨ AI 도우미</h3>
      모임 운영을 지원하는 AI 화면을 제공합니다.
    </td>
  </tr>
</table>

<sub>기능 구성은 프론트엔드의 실제 화면 및 라우트 구조를 기준으로 작성했습니다. 기능별 서버 연동 범위는 개발 상태에 따라 달라질 수 있습니다.</sub>

<br />

## 🛠 Tech Stack

| Area | Technologies |
| :--- | :--- |
| **Core** | React 19 · TypeScript 7 · Vite 8 |
| **Routing** | React Router 8 |
| **Styling** | styled-components |
| **Server State** | TanStack React Query |
| **Client State** | Zustand |
| **API** | Axios · Orval (OpenAPI 기반 코드 생성) |
| **Documents** | pdfjs-dist · fflate |
| **Quality** | Oxlint |
| **Deployment Config** | Vercel |

<br />

## 🗂 Project Structure

```text
.
├── .github/                 # 이슈 및 PR 템플릿
├── README.md                # 프로젝트 소개
└── frontend/                # 프론트엔드 앱
    ├── public/              # 로고, 아이콘, 폰트 등 정적 파일
    ├── src/
    │   ├── api/             # API 통신 및 생성된 클라이언트
    │   ├── assets/          # 화면별 에셋
    │   ├── components/      # 공통 및 기능별 UI 컴포넌트
    │   ├── constants/       # 상수
    │   ├── hooks/           # 커스텀 훅
    │   ├── layouts/         # 공통 레이아웃
    │   ├── pages/           # 기능별 페이지
    │   ├── styles/          # 스타일
    │   ├── types/           # 타입 정의
    │   ├── utils/           # 유틸리티
    │   ├── App.tsx          # 라우팅 및 앱 구성
    │   └── main.tsx         # 엔트리 포인트
    ├── orval.config.ts      # OpenAPI 클라이언트 생성 설정
    ├── package.json
    └── vite.config.ts
```

<details>
<summary><b>📂 주요 페이지 디렉터리 보기</b></summary>
<br />

```text
src/pages/
├── ai/            # AI 도우미
├── attendance/    # 출석
├── documents/     # 장부/문서
├── files/         # 파일 및 자료실
├── groups/        # 모임 선택
├── home/          # 홈
├── meetings/      # 회의
├── members/       # 구성원
├── notes/         # 운영 기록
├── onboarding/    # 온보딩
├── operations/    # 운영
├── payments/      # 정산
├── schedules/     # 일정
└── settings/      # 설정
```

</details>

<br />

## 🚀 Getting Started

### Requirements

- Node.js — **Vite 8과 호환되는 버전** (Node.js 20.19+ 또는 22.12+)
- npm

### Installation

```bash
git clone https://github.com/moimzang-line4/frontend.git
cd frontend/frontend
npm ci
```

### Run Locally

```bash
npm run dev
```

Vite가 출력하는 로컬 주소를 브라우저에서 열어 확인할 수 있습니다.

### Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | 로컬 개발 서버 실행 |
| `npm run build` | TypeScript 검사 및 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | Oxlint 정적 검사 |
| `npm run api:generate` | Orval을 이용한 API 코드 생성 |

> API 생성 설정은 `frontend/orval.config.ts` 에서 관리합니다. 일부 기능은 백엔드 API 연결이 필요합니다.

<br />

## 🤝 Collaboration

모임장은 기능별 페이지와 컴포넌트를 분리하여 여러 개발자가 함께 작업하기 쉽도록 구성했습니다.

- 작업 전 최신 `main` 브랜치를 동기화합니다.
- 기능 및 수정 작업은 별도 브랜치에서 진행합니다.
- Pull Request에 변경 내용과 테스트 방법을 작성합니다.
- 병합 전 `npm run lint` 와 `npm run build` 를 확인합니다.

[Issues](https://github.com/moimzang-line4/frontend/issues) · [Pull Requests](https://github.com/moimzang-line4/frontend/pulls)

<br />

---

<div align="center">

### 모임의 모든 순간을 더 간편하게.

**MOIMZANG · 모임장**

<sub>Made with care by the MOIMZANG team.</sub>

</div>
