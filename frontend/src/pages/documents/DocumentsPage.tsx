import LedgerPanel from '../../components/documents/LedgerPanel'
import FileLibrary from '../../components/files/FileLibrary'
import useFileScope from '../../hooks/files/useFileScope'

export default function DocumentsPage() {
  const scope = useFileScope()

  return (
    <FileLibrary
      key={scope.id}
      scheduleId={scope.id}
      scheduleTitle={scope.title}
      listPath={scope.listPath}
      generationLabel={scope.generationLabel}
      // 장부 탭은 자체 '항목 검색'을 씀 (피그마)
      ledgerContent={<LedgerPanel key={scope.id} />}
      documentView
    />
  )
}
