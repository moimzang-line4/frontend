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
      ledgerContent={(search) => (
        <LedgerPanel key={scope.id} search={search} />
      )}
      documentView
    />
  )
}
