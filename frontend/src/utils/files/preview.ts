import type { ScheduleFile } from '../../types/files/file'

export type PreviewKind = 'pdf' | 'image' | 'text' | 'audio' | 'video' | 'office' | 'unsupported'
export function previewKind(file: Pick<ScheduleFile, 'name' | 'mimeType'>): PreviewKind {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const type = file.mimeType ?? ''
  if (ext === 'pdf' || type === 'application/pdf') return 'pdf'
  if (/^(png|jpe?g|gif|webp|avif|bmp|svg|ico)$/.test(ext) || type.startsWith('image/')) return 'image'
  if (/^(mp3|wav|ogg|m4a|aac|flac)$/.test(ext) || type.startsWith('audio/')) return 'audio'
  if (/^(mp4|webm|mov|m4v|ogv)$/.test(ext) || type.startsWith('video/')) return 'video'
  if (/^(docx|xlsx|pptx)$/.test(ext)) return 'office'
  if (/^(txt|md|csv|tsv|json|log|xml|html?|css|js|ts|yaml|yml)$/.test(ext) || type.startsWith('text/') || type === 'application/json') return 'text'
  return 'unsupported'
}
