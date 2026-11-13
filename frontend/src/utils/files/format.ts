export function fileSizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

export function fileDateLabel(time: number) {
  const date = new Date(time)
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export function splitFileName(name: string) {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? { name: name.slice(0, dot), extension: name.slice(dot) } : { name, extension: '' }
}
