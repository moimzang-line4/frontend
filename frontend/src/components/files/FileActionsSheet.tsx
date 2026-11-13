import BottomSheet from '../BottomSheet'
import type { ScheduleFile } from '../../types/files/file'
import { downloadBlob } from '../../utils/files/download'

import previewIcon from '../../assets/files/preview.svg'
import downloadIcon from '../../assets/files/download.svg'
import deleteIcon from '../../assets/files/delete.svg'

import * as S from '../../styles/files/FilesPage.styles'

type Props = {
  file: ScheduleFile
  onClose: () => void
  onPreview?: () => void
  onDelete: () => void
}

export default function FileActionsSheet({
  file,
  onClose,
  onPreview,
  onDelete,
}: Props) {
  return (
    <BottomSheet title={file.name} onClose={onClose}>
      {close => (
        <>
          {onPreview && (
            <S.Action
              type="button"
              onClick={() => close(onPreview)}
            >
              <img src={previewIcon} alt="" />
              문서 미리보기
            </S.Action>
          )}

          <S.Action
            type="button"
            onClick={() => {
              downloadBlob(file.blob, file.name)
              close()
            }}
          >
            <img src={downloadIcon} alt="" />
            다운로드
          </S.Action>

          <S.Action
            type="button"
            $danger
            onClick={() => close(onDelete)}
          >
            <img src={deleteIcon} alt="" />
            삭제
          </S.Action>
        </>
      )}
    </BottomSheet>
  )
}