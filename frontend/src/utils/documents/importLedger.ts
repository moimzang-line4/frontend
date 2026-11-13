import type { LedgerEntry } from '../../types/documents/ledger'
import { readOfficePreview } from '../files/officePreview'
import { validDate } from './ledgerMath'

const normalize = (value: string) =>
  value.replace(/[\s·_*()]/g, '').toLowerCase()
const findColumn = (header: string[], names: string[]) =>
  header.findIndex((value) => names.includes(normalize(value)))

function number(value: string) {
  const trimmed = value.trim()
  const negative = trimmed.startsWith('(') && trimmed.endsWith(')')
  const cleaned = trimmed.replace(/[,₩원\s()]/g, '')
  if (!/^[+-]?\d+$/.test(cleaned)) return NaN
  const result = Number(cleaned) * (negative ? -1 : 1)
  return Number.isSafeInteger(result) && Math.abs(result) <= 1_000_000_000_000
    ? result
    : NaN
}

function date(value: string, date1904: boolean) {
  const text = value.trim()
  if (/^\d+(\.\d+)?$/.test(text)) {
    const serial = Number(text)
    if (serial < 1 || serial > 2958465) return ''
    const epoch = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 30)
    return new Date(epoch + Math.floor(serial) * 86_400_000)
      .toISOString()
      .slice(0, 10)
  }
  const parts = text.match(
    /^(\d{2}|\d{4})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})(?:일|[.\s]|T.*)?$/,
  )
  if (!parts) return ''
  const year = parts[1].length === 2 ? `20${parts[1]}` : parts[1]
  const parsed = `${year}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}`
  return validDate(parsed) ? parsed : ''
}

export async function importLedger(file: File) {
  if (!file.name.toLowerCase().endsWith('.xlsx'))
    throw new Error('장부는 XLSX 파일로 업로드해주세요.')
  const workbook = await readOfficePreview(file, 'xlsx')
  const entries: LedgerEntry[] = []
  let initialBalance = 0
  let matched = false

  for (const sheet of workbook.sections) {
    if (!sheet.rows) continue
    if (sheet.truncated)
      throw new Error(
        '장부는 시트당 500행·50열까지 반영할 수 있어요. 파일을 나눠주세요.',
      )
    const rows = sheet.rows
    const headerIndex = rows.findIndex(
      (row) =>
        findColumn(row, ['항목', '항목명', '내용', '적요']) >= 0 &&
        findColumn(row, ['날짜', '일자', '거래일', '거래일자']) >= 0,
    )
    if (headerIndex < 0) continue
    matched = true
    const header = rows[headerIndex]
    const titleIndex = findColumn(header, ['항목', '항목명', '내용', '적요'])
    const dateIndex = findColumn(header, ['날짜', '일자', '거래일', '거래일자'])
    const typeIndex = findColumn(header, [
      '구분',
      '유형',
      '수입/지출',
      '수입지출',
    ])
    const amountIndex = findColumn(header, ['금액', '거래금액'])
    const incomeIndex = findColumn(header, [
      '수입',
      '수입금액',
      '입금',
      '입금액',
    ])
    const expenseIndex = findColumn(header, [
      '지출',
      '지출금액',
      '출금',
      '출금액',
    ])

    if (amountIndex < 0 && incomeIndex < 0 && expenseIndex < 0)
      throw new Error(`${sheet.title}: 금액 또는 수입·지출 열이 필요해요.`)

    for (const row of rows.slice(0, headerIndex)) {
      const index = row.findIndex((value) =>
        ['초기잔액', '기초잔액', '이월잔액', '시작잔액'].includes(
          normalize(value),
        ),
      )
      if (index >= 0) {
        const amount = row
          .slice(index + 1)
          .map(number)
          .find(Number.isFinite)
        if (amount === undefined)
          throw new Error(`${sheet.title}: 초기 잔액을 확인해주세요.`)
        initialBalance += amount
      }
    }

    for (const [offset, row] of rows.slice(headerIndex + 1).entries()) {
      if (row.every((value) => !value.trim())) continue
      const title = row[titleIndex]?.trim() ?? ''
      if (['합계', '총계', '소계', '누계'].includes(title)) continue
      const parsedDate = date(
        row[dateIndex] ?? '',
        workbook.excelDate1904 ?? false,
      )
      const income = number(row[incomeIndex] ?? '')
      const expense = number(row[expenseIndex] ?? '')
      const rawAmount = number(row[amountIndex] ?? '')
      const typeValue = row[typeIndex]?.trim() ?? ''
      const amounts: { type: 'income' | 'expense'; amount: number }[] = []

      if (incomeIndex >= 0 || expenseIndex >= 0) {
        if (
          (row[incomeIndex]?.trim() &&
            (!Number.isFinite(income) || income < 0)) ||
          (row[expenseIndex]?.trim() &&
            (!Number.isFinite(expense) || expense < 0))
        )
          throw new Error(
            `${sheet.title} ${headerIndex + offset + 2}행의 수입·지출 금액을 확인해주세요.`,
          )
        if (Number.isFinite(income) && income > 0)
          amounts.push({ type: 'income', amount: income })
        if (Number.isFinite(expense) && expense > 0)
          amounts.push({ type: 'expense', amount: expense })
      } else if (Number.isFinite(rawAmount) && rawAmount !== 0) {
        const type = /수입|입금/.test(typeValue)
          ? 'income'
          : /지출|출금/.test(typeValue)
            ? 'expense'
            : typeValue
              ? null
              : rawAmount < 0
                ? 'expense'
                : 'income'
        if (type) amounts.push({ type, amount: Math.abs(rawAmount) })
      }

      if (!title || title.length > 150 || !parsedDate || !amounts.length)
        throw new Error(
          `${sheet.title} ${headerIndex + offset + 2}행의 항목·날짜·금액·구분을 확인해주세요.`,
        )
      for (const amount of amounts)
        entries.push({
          id: crypto.randomUUID(),
          title,
          date: parsedDate,
          source: 'imported',
          ...amount,
        })
    }
  }

  if (!matched)
    throw new Error(
      '항목·날짜·금액(또는 수입·지출) 열이 있는 장부를 선택해주세요.',
    )
  if (!Number.isSafeInteger(initialBalance))
    throw new Error('초기 잔액을 확인해주세요.')
  return { entries, initialBalance }
}
