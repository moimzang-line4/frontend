import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import FileViewer from '../../components/files/FileViewer'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useFileScope from '../../hooks/files/useFileScope'
import useScheduleFiles from '../../hooks/files/useScheduleFiles'
import * as S from '../../styles/files/FilePreviewPage.styles'

export default function FilePreviewPage() {
  const scope = useFileScope()

  if (!scope.valid) {
    return (
      <S.Page>
        <S.Main>
          <S.Notice>자료를 확인할 일정을 찾을 수 없어요.</S.Notice>
        </S.Main>
      </S.Page>
    )
  }

  return <Preview key={scope.id} scope={scope} />
}

function Preview({ scope }: { scope: ReturnType<typeof useFileScope> }) {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const { files, loading, error, reload, remove } = useScheduleFiles(scope.id)
  const file = files.find((item) => item.id === fileId)
  const [deleting, setDeleting] = useState(false)

  return (
    <>
      <FileViewer
        file={file}
        loading={loading}
        error={error}
        onReload={reload}
        onBack={() => navigate(scope.listPath)}
        onDelete={() => setDeleting(true)}
      />
      <ConfirmDialog
        open={deleting && !!file}
        title="자료를 삭제할까요?"
        description={
          file ? `${file.name} 파일을 삭제하면 복구할 수 없어요.` : undefined
        }
        confirmText="삭제"
        onCancel={() => setDeleting(false)}
        onConfirm={async () => {
          if (!file) return
          await remove(file)
          navigate(scope.listPath, { replace: true })
        }}
      />
    </>
  )
}
