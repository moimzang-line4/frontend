import { zip } from 'fflate'
import type { ScheduleFile } from '../../types/files/file'

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export async function downloadArchive(files: ScheduleFile[]) {
  const entries: Record<string, Uint8Array> = Object.create(null)
  for (const file of files) {
    const safe = Array.from(file.name, char => char.charCodeAt(0) < 32 || char === '/' || char === '\\' ? '_' : char).join('') || '자료'
    let name = safe
    let suffix = 1
    while (Object.hasOwn(entries, name)) name = `${suffix++}_${safe}`
    entries[name] = new Uint8Array(await file.blob.arrayBuffer())
  }
  const data = await new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
    zip(entries, { level: 0 }, (error, zipped) => error ? reject(error) : resolve(new Uint8Array(zipped)))
  })
  downloadBlob(new Blob([data], { type: 'application/zip' }), '일정 자료.zip')
}
