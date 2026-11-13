import { strFromU8, unzipSync } from 'fflate'
import type { OfficePreview } from '../../types/files/preview'

const MAX_XML_BYTES = 10 * 1024 * 1024
const MAX_PARTS = 200
const MAX_ROWS = 500
const MAX_COLS = 50
function elements(parent: Document | Element, tag: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS('*', tag))
}
function content(parent: Document | Element, tag: string) {
  return elements(parent, tag).map(node => node.textContent ?? '').join('')
}

// Office 파일의 텍스트와 표만 읽습니다. HTML, 매크로, 외부 리소스는 실행하지 않습니다.
export async function readOfficePreview(blob: Blob, extension: string): Promise<OfficePreview> {
  if (blob.size > 20 * 1024 * 1024) throw new Error('20MB가 넘는 Office 파일은 다운로드해서 확인해주세요.')
  let total = 0
  let count = 0
  const files = unzipSync(new Uint8Array(await blob.arrayBuffer()), { filter(file) {
    const wanted = extension === 'docx' ? file.name === 'word/document.xml'
      : extension === 'xlsx' ? /^(xl\/(workbook.xml|_rels\/workbook.xml.rels|sharedStrings.xml|worksheets\/sheet\d+\.xml))$/.test(file.name)
        : /^ppt\/slides\/slide\d+\.xml$/.test(file.name)
    if (!wanted) return false
    total += file.originalSize
    if (total > MAX_XML_BYTES || ++count > MAX_PARTS) throw new Error('내용이 너무 많은 파일이에요. 다운로드해서 확인해주세요.')
    return true
  } })
  function xml(path: string) {
    if (!files[path]) throw new Error('문서 내용을 읽을 수 없어요. 다운로드해서 확인해주세요.')
    const document = new DOMParser().parseFromString(strFromU8(files[path]), 'application/xml')
    if (document.getElementsByTagName('parsererror').length) throw new Error('문서 형식을 확인해주세요.')
    return document
  }
  if (extension === 'docx') {
    const paragraphs = elements(xml('word/document.xml'), 'p').map(node => content(node, 't')).filter(Boolean)
    return { sections: [{ title: '문서', paragraphs }] }
  }
  if (extension === 'pptx') {
    const paths = Object.keys(files).sort((a, b) => Number(a.match(/slide(\d+)/)?.[1]) - Number(b.match(/slide(\d+)/)?.[1]))
    if (!paths.length) throw new Error('슬라이드 내용을 찾지 못했어요.')
    return { sections: paths.map((path, index) => ({ title: `슬라이드 ${index + 1}`, paragraphs: elements(xml(path), 'p').map(node => content(node, 't')).filter(Boolean) })) }
  }
  const strings = files['xl/sharedStrings.xml'] ? elements(xml('xl/sharedStrings.xml'), 'si').map(node => content(node, 't')) : []
  const relationships = new Map(elements(xml('xl/_rels/workbook.xml.rels'), 'Relationship').map(node => [node.getAttribute('Id'), node.getAttribute('Target') ?? '']))
  const sheets = elements(xml('xl/workbook.xml'), 'sheet')
  return { sections: sheets.map(sheet => {
    const relation = sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') ?? sheet.getAttribute('r:id')
    const target = relationships.get(relation) ?? ''
    const path = target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`
    const sourceRows = elements(xml(path), 'row')
    let truncated = sourceRows.length > MAX_ROWS
    const rows = sourceRows.slice(0, MAX_ROWS).map(row => {
      const result: string[] = []
      for (const cell of elements(row, 'c')) {
        const letters = cell.getAttribute('r')?.match(/^[A-Z]+/)?.[0] ?? 'A'
        const column = Array.from(letters).reduce((sum, letter) => sum * 26 + letter.charCodeAt(0) - 64, 0) - 1
        if (column >= MAX_COLS) { truncated = true; continue }
        const value = content(cell, 'v')
        const type = cell.getAttribute('t')
        result[column] = type === 's' ? strings[Number(value)] ?? '' : type === 'inlineStr' ? content(cell, 't') : type === 'b' ? value === '1' ? 'TRUE' : 'FALSE' : value
      }
      return Array.from({ length: result.length }, (_, index) => result[index] ?? '')
    })
    return { title: sheet.getAttribute('name') ?? '시트', rows, truncated }
  }) }
}
