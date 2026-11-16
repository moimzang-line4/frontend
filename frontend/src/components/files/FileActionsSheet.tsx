import BottomSheet from '../BottomSheet'
import type { ScheduleFile } from '../../types/files/file'
import { downloadRemoteFile } from '../../utils/files/remote'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'

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
              downloadRemoteFile(file).catch(caught => {
                showAlert(getApiErrorMessage(caught, '파일을 다운로드하지 못했어요.'))
              })
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