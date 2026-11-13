import type { ScheduleFile } from '../../types/files/file'

export type PreviewKind = 'pdf' | 'image' | 'text' | 'audio' | 'video' | 'office' | 'unsupported'
export function previewKind(file: ScheduleFile): PreviewKind {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf' || file.blob.type === 'application/pdf') return 'pdf'
  if (/^(png|jpe?g|gif|webp|avif|bmp|svg|ico)$/.test(ext) || file.blob.type.startsWith('image/')) return 'image'
  if (/^(mp3|wav|ogg|m4a|aac|flac)$/.test(ext) || file.blob.type.startsWith('audio/')) return 'audio'
  if (/^(mp4|webm|mov|m4v|ogv)$/.test(ext) || file.blob.type.startsWith('video/')) return 'video'
  if (/^(docx|xlsx|pptx)$/.test(ext)) return 'office'
  if (/^(txt|md|csv|tsv|json|log|xml|html?|css|js|ts|yaml|yml)$/.test(ext) || file.blob.type.startsWith('text/') || file.blob.type === 'application/json') return 'text'
  return 'unsupported'
}
