import type { Ledger } from '../../types/documents/ledger'

export const ledgerChangeEvent = 'moimzang:ledger-changed'

async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('moimzang.documents.ledgers.v1', 1)

    request.onupgradeneeded = () => {
      request.result.createObjectStore('ledgers', { keyPath: 'scopeId' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(
        new Error(
          '장부 저장소를 열지 못했어요. 브라우저 저장 공간을 확인해주세요.',
        ),
      )
  })
}

export async function readLedger(scopeId: string): Promise<Ledger | null> {
  const db = await database()

  try {
    return await new Promise((resolve, reject) => {
      const request = db
        .transaction('ledgers', 'readonly')
        .objectStore('ledgers')
        .get(scopeId)
      request.onsuccess = () => resolve(request.result ?? null)
      request.onerror = () => reject(new Error('장부를 불러오지 못했어요.'))
    })
  } finally {
    db.close()
  }
}

export async function updateLedger(
  scopeId: string,
  update: (current: Ledger | null) => Ledger | null,
) {
  const db = await database()

  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('ledgers', 'readwrite')
      const store = tx.objectStore('ledgers')
      const request = store.get(scopeId)
      let failure: unknown

      request.onsuccess = () => {
        try {
          const next = update(request.result ?? null)

          if (next) {
            if (next.scopeId !== scopeId)
              throw new Error('다른 기수의 장부예요.')
            store.put(next)
          } else {
            store.delete(scopeId)
          }
        } catch (cause) {
          failure = cause
          tx.abort()
        }
      }
      tx.oncomplete = () => resolve()
      tx.onabort = () =>
        reject(
          failure ??
            new Error('장부를 저장하지 못했어요. 저장 공간을 확인해주세요.'),
        )
      tx.onerror = () =>
        reject(new Error('장부를 저장하지 못했어요. 다시 시도해주세요.'))
    })
    window.dispatchEvent(new Event(ledgerChangeEvent))
  } finally {
    db.close()
  }
}
