import ConfirmDialog from './common/ConfirmDialog'
import useAlert, { closeAlert, dismissAlert } from '../hooks/useAlert'

export default function AlertModal() {
  const alert = useAlert()
  return <ConfirmDialog open={Boolean(alert)} title={alert?.title ?? ''} description={alert?.description} confirmText={alert?.confirmText} hideCancel tone="primary" titleSize={18} onCancel={dismissAlert} onConfirm={closeAlert} />
}
