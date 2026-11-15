import type { Ledger } from '../../types/documents/ledger'

// 기존 파일로 만든 장부도 같은 저장소에서 계속 사용할 수 있어요.
export function ledgerIdentity(ledger: Ledger) {
  return ledger.id ?? ledger.file?.id ?? ledger.scopeId
}
