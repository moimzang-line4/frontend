import { createGlobalStyle, css } from 'styled-components'

// Safari auto-zooms small form text on focus. Keep pinch zoom available.
const touchInputText = css`
  input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='color']):not([type='file']):not([type='hidden']):not([type='button']):not([type='submit']):not([type='reset']),
  textarea, select, [contenteditable='true'], [contenteditable='plaintext-only'] {
    font-size: max(16px, 1em) !important;
  }
`

export const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: "SUIT";
  src: url("/fonts/SUIT-Variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}


:root {
  /* 폰트 */
  --font-sans: "SUIT", system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* 컬러 */
  --color-primary: #7cbfb2;
  --color-primary-strong: #3f8275;

  --color-ink: #17251e;
  --color-muted: #81958f;
  --color-surface: #ffffff;

  --color-border: #ddece7;
  --color-divider: #edf1ee;

  --color-button-start: #5aa997;
  --color-button-end: #438b7e;
  --color-button-disabled: #DBE5E0;
  --color-button-disabled-text: #78918c;

  /* 홈 캘린더 */
  --color-home-ink: #263e3a;
  --color-page-background: #f7f8fa;
  --color-home-divider: #e3eeea;
  --color-calendar-meeting: #ddeeff;
  --color-calendar-session: #fff0cd;
  --color-calendar-performance: #e8f4ef;
  --color-calendar-newcomer: #e8e1fa;

  /* 글자 크기 및 줄 높이 */
  --text-page-title: 18px;
  --text-page-title--line-height: 26px;

  --text-button: 18px;
  --text-button--line-height: 27px;

  --text-nav: 10px;
  --text-nav--line-height: 15px;

  --text-nav-ai: 11px;
  --text-nav-ai--line-height: 16px;

  /* 모서리 */
  --radius-button: 14px;
  --radius-app-bar: 16px;
  --radius-control: 8px;
  --radius-ai: 9999px;

  /* 그림자 */
  --shadow-app-bar:
    0 6px 18px rgb(63 141 124 / 9%),
    inset 0 1px 2px rgb(255 255 255 / 80%);

  --drop-shadow-ai: 0 4px 5px #8aa8a2;

  /* 화면 너비 */
  --container-app: 390px;

  /* 공통 크기 및 간격 */
  --spacing-button: 55px;
  --spacing-header: 56px;
  --spacing-header-slot: 56px;
  --spacing-touch-target: 44px;

  --spacing-icon: 22px;
  --spacing-icon-back: 24px;

  --spacing-footer: 83px;
  --spacing-footer-background: 98px;
  --spacing-footer-item: 50px;
  --spacing-footer-offset: 9px;
  --spacing-footer-curve: 15px;
  --spacing-ai-button: 60px;

  --spacing-page-x: 20px;
  --spacing-page-top: 24px;
  --spacing-content-bottom: 107px;
}

  *, ::before, ::after, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--font-sans);
    -webkit-tap-highlight-color: transparent;
    /* 시트·모달이 열려 스크롤이 잠겨도 스크롤바 자리를 남겨 화면이 옆으로 밀리지 않게 */
    scrollbar-gutter: stable;
  }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  a { color: inherit; text-decoration: inherit; }
  b, strong { font-weight: bolder; }
  ol, ul, menu { list-style: none; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-button { appearance: button; }
  ::placeholder { opacity: 1; }
  @supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intrinsic-size: 1px) {
    ::placeholder { color: color-mix(in oklab, currentcolor 50%, transparent); }
  }
  textarea { resize: vertical; }
  table { text-indent: 0; border-color: inherit; border-collapse: collapse; }
  hr { height: 0; color: inherit; border-top-width: 1px; }
  abbr:where([title]) { text-decoration: underline dotted; }
  small { font-size: 80%; }
  sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
  sub { bottom: -0.25em; }
  sup { top: -0.5em; }
  progress { vertical-align: baseline; }
  summary { display: list-item; }
  ::-webkit-search-decoration { -webkit-appearance: none; }
  ::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
  ::-webkit-datetime-edit { display: inline-flex; }
  ::-webkit-datetime-edit-fields-wrapper { padding: 0; }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field,
  ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field,
  ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field,
  ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field,
  ::-webkit-datetime-edit-meridiem-field { padding-block: 0; }
  ::-webkit-calendar-picker-indicator { line-height: 1; }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; }
  :-moz-ui-invalid { box-shadow: none; }
  [hidden]:where(:not([hidden='until-found'])) { display: none !important; }
  body {
    font-family: var(--font-sans);
    font-weight: var(--font-weight-regular);
    color: var(--color-ink);
    background-color: var(--color-surface);
  }
  @supports (-webkit-touch-callout: none) {
    ${touchInputText}
  }
  @media (hover: none) and (pointer: coarse) {
    ${touchInputText}
  }
  button, a { -webkit-tap-highlight-color: transparent; }
  :focus-visible { outline: 2px solid var(--color-primary-strong); outline-offset: 3px; }
`
