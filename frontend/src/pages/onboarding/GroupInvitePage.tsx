import { Navigate } from 'react-router'

// Keep old bookmarks working without the invitation step.
export default function GroupInvitePage() {
  return <Navigate to="/groups/new" replace />
}
