export const PALETTES = [
  { value: 'brand', label: '브랜드(블루)', accent: '#2563eb', text: '#111827' },
  { value: 'mint', label: '민트', accent: '#10b981', text: '#0b1324' },
  { value: 'sun', label: '선셋', accent: '#f59e0b', text: '#111111' },
  { value: 'rose', label: '로즈', accent: '#f43f5e', text: '#111111' },
  ]
  
  
  export const FONTS = [
  { value: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', label: 'Inter' },
  { value: 'Noto Sans KR, system-ui, Arial', label: 'Noto Sans KR' },
  { value: 'IBM Plex Sans KR, system-ui, Arial', label: 'IBM Plex Sans KR' },
  { value: 'Do Hyeon, Noto Sans KR, Arial', label: 'Do Hyeon (굵은 제목)' },
  { value: 'Black Han Sans, Noto Sans KR, Arial', label: 'Black Han Sans (강조 타이틀)' },
  ]
  
  
  export const EXPORT_SIZES = [
  { value: 'a4', label: 'A4 (1240×1754)', w: 1240, h: 1754 },
  { value: 'sq', label: '정사각 1080×1080', w: 1080, h: 1080 },
  { value: 'story', label: '스토리 1080×1920', w: 1080, h: 1920 },
  ]
  
  
  export const TEMPLATES = [
  { value: 'seminar', label: '세미나형(깔끔)' },
  { value: 'festival', label: '축제형(컬러 강조)' },
  { value: 'club', label: '동아리형(카드형)' },
  ]
  
  
  export function toYMD(dateStr){
  if (!dateStr) return ''
  try {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
  } catch { return dateStr }
  }