import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useScheduleFiles from '../../hooks/files/useScheduleFiles'
import { fileCategories } from '../../types/files/file'
import type { FileCategory } from '../../types/files/file'
import type { Schedule } from '../../types/schedules/schedule'
import { fileDateLabel, fileSizeLabel, splitFileName } from '../../utils/files/format'
import uploadIcon from '../../assets/files/upload.svg'
import * as S from '../../styles/files/FileUploadPage.styles'
import { ErrorText } from '../../styles/files/FilesPage.styles'

export default function FileUploadPage() {
  const { schedule } = useScheduleDetail()
  if (!schedule || schedule.operationMenuCount === undefined) return <S.Page><Header title="파일 첨부" /><S.Form><ErrorText>자료를 첨부할 일정을 찾을 수 없어요.</ErrorText></S.Form></S.Page>
  return <UploadForm key={schedule.id} schedule={schedule} />
}

function UploadForm({ schedule }: { schedule: Schedule }) {
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef<HTMLInputElement>(null)
  const { loading, error: storageError, upload, reload } = useScheduleFiles(schedule.id)
  const [selected, setSelected] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<FileCategory>(() => {
    const initial: unknown = location.state?.category
    return fileCategories.find(value => value === initial) ?? '활동 문서'
  })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const pendingRef = useRef(false)
  const extension = selected ? splitFileName(selected.name).extension : ''
  const listPath = `/schedules/${encodeURIComponent(schedule.id)}/operations/files`
  function choose(file?: File) {
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { setError('파일 하나당 최대 50MB까지 첨부할 수 있어요.'); return }
    setSelected(file); setName(splitFileName(file.name).name); setError('')
  }
  return <S.Page>
    <Header title="파일 첨부" showBack={false} align="left" rightAction={<S.Close type="button" aria-label="닫기" disabled={pending} onClick={() => navigate(listPath, { replace: true })}>×</S.Close>} />
    <S.Form aria-label="자료 업로드" aria-busy={pending} onSubmit={async event => {
      event.preventDefault()
      if (pendingRef.current || !selected || loading || storageError) return
      const base = name.trim()
      if (!base || base === '.' || base === '..' || Array.from(base).some(char => char.charCodeAt(0) < 32 || char === '/' || char === '\\')) {
        setError('자료 이름을 확인해주세요. /, \\ 문자는 사용할 수 없어요.'); return
      }
      pendingRef.current = true; setPending(true); setError('')
      try {
        const file = new File([selected], `${base}${extension}`, { type: selected.type, lastModified: selected.lastModified })
        await upload([file], category)
        navigate(listPath, { replace: true, state: { uploadedFileName: file.name } })
      } catch (cause) { setError(cause instanceof Error ? cause.message : '업로드하지 못했어요. 다시 시도해주세요.') }
      finally { pendingRef.current = false; setPending(false) }
    }}>
      <S.Section>
        <h2>첨부할 파일</h2>
        <S.HiddenInput ref={inputRef} type="file" aria-label="첨부할 파일 선택" disabled={pending} onChange={event => { choose(event.target.files?.[0]); event.target.value = '' }} />
        {selected ? <S.Selected><div><strong title={selected.name}>{selected.name}</strong><button type="button" disabled={pending} onClick={() => inputRef.current?.click()}>변경</button></div><span>{fileDateLabel(selected.lastModified)} · {fileSizeLabel(selected.size)}</span></S.Selected>
          : <S.Picker type="button" onClick={() => inputRef.current?.click()}><img src={uploadIcon} alt="" width={24} height={24} /><strong>파일 선택</strong><span>내 기기에서 파일을 선택해 주세요</span></S.Picker>}
      </S.Section>
      <S.Section>
        <label htmlFor="material-name">자료 이름</label>
        <S.NameField><input id="material-name" value={name} maxLength={150} disabled={pending} placeholder="자료 이름을 입력해 주세요" autoComplete="off" onChange={event => { setName(event.target.value); setError('') }} />{extension && <span aria-label="파일 확장자">{extension}</span>}</S.NameField>
      </S.Section>
      <S.Section><S.Categories disabled={pending}><legend>분류</legend>{fileCategories.map(value => <S.Category type="button" key={value} $active={category === value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</S.Category>)}</S.Categories></S.Section>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      {storageError && <><ErrorText role="alert">{storageError}</ErrorText><S.Close type="button" aria-label="저장소 다시 불러오기" onClick={() => void reload()}>↻</S.Close></>}
      <S.Submit type="submit" disabled={!selected || !name.trim() || pending || loading || !!storageError}>{pending ? '업로드 중…' : '업로드'}</S.Submit>
    </S.Form>
  </S.Page>
}
