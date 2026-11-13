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
      documentView
    />
  )
}
