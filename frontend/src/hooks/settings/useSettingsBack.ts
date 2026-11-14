import { useLocation, useNavigate } from 'react-router'

export default function useSettingsBack(parentPath: '/' | '/settings') {
  const location = useLocation()
  const navigate = useNavigate()

  return () => {
    const cameFromParent = location.state?.settingsParent === parentPath
    const hasPreviousEntry = window.history.state?.idx > 0

    if (cameFromParent && hasPreviousEntry) {
      navigate(-1)
      return
    }

    navigate(parentPath, { replace: true })
  }
}
