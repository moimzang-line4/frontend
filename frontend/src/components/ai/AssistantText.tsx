import { Fragment } from 'react'
import type { ReactNode } from 'react'

// **굵게** → <strong>
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*\n]+\*\*)/g).map((part, index) =>
    /^\*\*[^*\n]+\*\*$/.test(part) ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  )
}

// 서버 AI 답변의 간단한 마크다운만 보기 좋게 바꿈 (말풍선은 white-space: pre-wrap)
// - '- 항목' / '* 항목' → '• 항목'
// - '### 제목' → 굵은 제목
// - '**굵게**' → 굵은 글씨
export default function AssistantText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, index) => {
        const heading = /^\s*#{1,6}\s+(.*)$/.exec(line)
        const bullet = /^(\s*)[-*]\s+(.*)$/.exec(line)
        const content = heading
          ? <strong>{inline(heading[1].replaceAll('**', ''))}</strong>
          : bullet
            ? <>{bullet[1]}• {inline(bullet[2])}</>
            : inline(line)
        return (
          <Fragment key={index}>
            {content}
            {index < lines.length - 1 && '\n'}
          </Fragment>
        )
      })}
    </>
  )
}
