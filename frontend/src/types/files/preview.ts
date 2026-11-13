export type OfficePreview = {
  excelDate1904?: boolean
  sections: {
    title: string
    paragraphs?: string[]
    rows?: string[][]
    truncated?: boolean
  }[]
}
