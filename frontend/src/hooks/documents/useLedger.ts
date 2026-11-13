import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ledgerChangeEvent,
  readLedger,
} from '../../utils/documents/ledgerStorage'
import type { Ledger } from '../../types/documents/ledger'

export default function useLedger(scopeId: string) {
  const [ledger, setLedger] = useState<Ledger | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const revision = useRef({ value: 0 })

  const reload = useCallback(async () => {
    const version = ++revision.current.value

    try {
      const next = await readLedger(scopeId)
      if (version !== revision.current.value) return
      setLedger(next)
      setError('')
    } catch (cause) {
      if (version === revision.current.value) {
        setError(
          cause instanceof Error ? cause.message : '장부를 불러오지 못했어요.',
        )
      }
    } finally {
      if (version === revision.current.value) setLoading(false)
    }
  }, [scopeId])

  useEffect(() => {
    const token = revision.current
    const refresh = () => {
      void reload()
    }
    void Promise.resolve().then(reload)
    window.addEventListener(ledgerChangeEvent, refresh)
    window.addEventListener('focus', refresh)

    return () => {
      token.value++
      window.removeEventListener(ledgerChangeEvent, refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [reload])

  return { ledger, loading, error, reload }
}
