import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import * as S from '../../styles/files/FilePreviewPage.styles'

GlobalWorkerOptions.workerSrc = workerUrl

export default function PdfPreview({ blob }: { blob: Blob }) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  useEffect(() => {
    let active = true
    let task: ReturnType<typeof getDocument> | undefined
    void blob.arrayBuffer().then(data => {
      if (!active) return
      task = getDocument({ data: new Uint8Array(data), useSystemFonts: true })
      return task.promise.then(document => { if (active) setPdf(document) })
    }).catch(() => { if (active) setError('PDF를 열 수 없어요. 암호나 파일 상태를 확인한 뒤 다운로드해서 열어주세요.') })
    return () => { active = false; void task?.destroy() }
  }, [blob])
  if (error) return <S.Notice role="alert">{error}</S.Notice>
  if (!pdf) return <S.Notice role="status">PDF를 불러오는 중이에요.</S.Notice>
  return <>
    <PdfCanvas key={page} pdf={pdf} page={page} />
    <S.Pager aria-label="PDF 페이지">
      {pdf.numPages > 1 && <button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>이전</button>}
      <span aria-live="polite">{page} / {pdf.numPages}</span>
      {pdf.numPages > 1 && <button type="button" disabled={page >= pdf.numPages} onClick={() => setPage(value => value + 1)}>다음</button>}
    </S.Pager>
  </>
}

function PdfCanvas({ pdf, page }: { pdf: PDFDocumentProxy; page: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    let render: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined
    void pdf.getPage(page).then(async document => {
      const canvas = ref.current
      if (!active || !canvas) return
      const width = canvas.parentElement?.clientWidth ?? 350
      const viewport = document.getViewport({ scale: width / document.getViewport({ scale: 1 }).width * Math.min(window.devicePixelRatio || 1, 2) })
      canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height)
      render = document.render({ canvas, viewport })
      await render.promise
    }).catch(() => { if (active) setError('이 페이지를 표시하지 못했어요. 다운로드해서 확인해주세요.') })
    return () => { active = false; render?.cancel() }
  }, [pdf, page])
  return error ? <S.Notice role="alert">{error}</S.Notice> : <S.CanvasFrame><canvas ref={ref} role="img" aria-label={`PDF ${page}페이지`} /></S.CanvasFrame>
}
