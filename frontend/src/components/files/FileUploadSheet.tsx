import { useState } from 'react'
import BottomSheet from '../BottomSheet'
import Button from '../Button'
import { fileCategories } from '../../types/files/file'
import type { FileCategory } from '../../types/files/file'
import * as S from '../../styles/files/FilesPage.styles'

export default function FileUploadSheet({ initialCategory, onClose, onUpload }: {
  initialCategory: FileCategory; onClose: () => void; onUpload: (files: File[], category: FileCategory) => Promise<void>
}) {
  const [category, setCategory] = useState(initialCategory)
  const [selected, setSelected] = useState<File[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  return <BottomSheet title="파일 첨부" onClose={onClose}>{close => <S.Form onSubmit={async event => {
    event.preventDefault()
    if (pending) return
    setPending(true); setError('')
    try { await onUpload(selected, category); close() }
    catch (cause) { setError(cause instanceof Error ? cause.message : '첨부하지 못했어요. 다시 시도해주세요.') }
    finally { setPending(false) }
  }}>
    <label>분류<select value={category} disabled={pending} onChange={event => setCategory(event.target.value as FileCategory)}>{fileCategories.map(value => <option key={value}>{value}</option>)}</select></label>
    <label>첨부할 파일<input type="file" multiple required disabled={pending} onChange={event => setSelected(Array.from(event.target.files ?? []))} /></label>
    <p>파일당 최대 50MB · 일정당 최대 200MB</p>
    {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
    <Button type="submit" disabled={pending || !selected.length}>{pending ? '첨부 중…' : '첨부하기'}</Button>
  </S.Form>}</BottomSheet>
}
