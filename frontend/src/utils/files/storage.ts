import type { ScheduleFile } from '../../types/files/file'

async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('moimzang.schedule.files.v1', 1)
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore('files', { keyPath: 'id' })
      store.createIndex('scheduleId', 'scheduleId')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('파일 저장소를 열지 못했어요. 브라우저 저장 공간을 확인해주세요.'))
    request.onblocked = () => reject(new Error('다른 탭을 닫고 다시 시도해주세요.'))
  })
}

async function transaction<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database()
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction('files', mode)
      const request = action(tx.objectStore('files'))
      tx.oncomplete = () => resolve(request.result)
      tx.onabort = () => reject(new Error('파일을 처리하지 못했어요. 브라우저 저장 공간을 확인해주세요.'))
      tx.onerror = () => reject(new Error('파일을 처리하지 못했어요. 다시 시도해주세요.'))
    })
  } finally { db.close() }
}

export async function readFiles(scheduleId: string): Promise<ScheduleFile[]> {
  return transaction('readonly', store => store.index('scheduleId').getAll(scheduleId))
}

export async function saveFiles(files: ScheduleFile[]) {
  if (!files.length) return
  await transaction('readwrite', store => {
    for (const file of files.slice(0, -1)) store.add(file)
    return store.add(files[files.length - 1])
  })
}

export async function deleteFile(id: string) {
  await transaction('readwrite', store => store.delete(id))
}
