import { useEffect, useState } from 'react'

import type { ScheduleFile } from '../../types/files/file'
import type { OfficePreview as OfficeContent } from '../../types/files/preview'
import { readOfficePreview } from '../../utils/files/officePreview'

import * as S from '../../styles/files/FilePreviewPage.styles'

export default function OfficePreview({
  file,
}: {
  file: ScheduleFile
}) {
  const [content, setContent] = useState<OfficeContent | null>(null)
  const [error, setError] = useState('')
  const [section, setSection] = useState(0)

  useEffect(() => {
    let active = true

    void readOfficePreview(
      file.blob,
      file.name.split('.').pop()?.toLowerCase() ?? '',
    )
      .then(value => {
        if (active) {
          setContent(value)
        }
      })
      .catch(cause => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : '문서를 표시하지 못했어요.',
          )
        }
      })

    return () => {
      active = false
    }
  }, [file])

  if (error) {
    return <S.Notice role="alert">{error}</S.Notice>
  }

  if (!content) {
    return (
      <S.Notice role="status">
        문서를 불러오는 중이에요.
      </S.Notice>
    )
  }

  const current = content.sections[section]

  if (!current) {
    return (
      <S.Notice>
        미리보기할 내용이 없어요.
      </S.Notice>
    )
  }

  return (
    <>
      {content.sections.length > 1 && (
        <S.Sections
          aria-label="시트 또는 슬라이드"
          value={section}
          onChange={event => {
            setSection(Number(event.target.value))
          }}
        >
          {content.sections.map((item, index) => (
            <option key={index} value={index}>
              {item.title}
            </option>
          ))}
        </S.Sections>
      )}

      {current.rows ? (
        <S.TableScroll>
          <table aria-label={current.title}>
            <tbody>
              {current.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, column) => (
                    <td key={column}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </S.TableScroll>
      ) : (
        <S.Paper>
          {current.paragraphs?.map((text, index) =>
            index === 0 ? (
              <h2 key={index}>{text}</h2>
            ) : (
              <p key={index}>{text}</p>
            ),
          )}
        </S.Paper>
      )}

      {current.truncated && (
        <S.Notice>
          처음 500행·50열까지 표시합니다. 전체 내용은 다운로드해서
          확인해주세요.
        </S.Notice>
      )}

      <S.Pager>
        {section + 1} / {content.sections.length}
      </S.Pager>
    </>
  )
}