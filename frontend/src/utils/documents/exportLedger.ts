import { strToU8, zip } from 'fflate'
import type { Ledger } from '../../types/documents/ledger'
import { downloadBlob } from '../files/download'
import { splitFileName } from '../files/format'

const escape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

export async function exportLedger(ledger: Ledger) {
  const rows = [
    ['초기 잔액', String(ledger.initialBalance)],
    ['날짜', '항목', '구분', '금액'],
    ...ledger.entries.map((entry) => [
      entry.date,
      entry.title,
      entry.type === 'income' ? '수입' : '지출',
      String(entry.amount),
    ]),
  ]
  const xmlRows = rows
    .map(
      (row, index) =>
        `<row r="${index + 1}">${row.map((value, column) => `<c r="${String.fromCharCode(65 + column)}${index + 1}" t="inlineStr"><is><t xml:space="preserve">${escape(value)}</t></is></c>`).join('')}</row>`,
    )
    .join('')
  const source = {
    '[Content_Types].xml':
      '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    '_rels/.rels':
      '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml':
      '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="장부" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels':
      '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml': `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="16" customWidth="1"/><col min="2" max="2" width="35" customWidth="1"/><col min="3" max="4" width="18" customWidth="1"/></cols><sheetData>${xmlRows}</sheetData></worksheet>`,
  }
  const archive = await new Promise<Uint8Array<ArrayBuffer>>(
    (resolve, reject) => {
      zip(
        Object.fromEntries(
          Object.entries(source).map(([name, xml]) => [name, strToU8(xml)]),
        ),
        (error, data) =>
          error ? reject(error) : resolve(new Uint8Array(data)),
      )
    },
  )
  downloadBlob(
    new Blob([archive], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    `${splitFileName(ledger.file?.name ?? '장부').name}-현재내역.xlsx`,
  )
}
