import React, { useEffect, useRef, useState } from 'react'
import Form from './components/Form'
import Preview from './components/Preview'
import History from './components/History'
import { loadForm, saveForm, pushHistory, loadHistory } from './utils/storage'
import { TEMPLATES, FONTS, PALETTES, EXPORT_SIZES } from './utils/helpers'
import './App.css'


export default function App(){
const [form, setForm] = useState(loadForm())
const [history, setHistory] = useState(loadHistory())
const logoImgRef = useRef(null)
const bgImgRef = useRef(null)
const [renderTick, setRenderTick] = useState(0)


useEffect(()=>{ saveForm(form); setRenderTick(t=>t+1) }, [form])


const setLogoFile = async (file) => { logoImgRef.current = file ? await fileToImage(file) : null; setRenderTick(t=>t+1) }
const setBgFile = async (file) => { bgImgRef.current = file ? await fileToImage(file) : null; setRenderTick(t=>t+1) }


const upd = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
const onSaveHistory = () => setHistory(pushHistory(form))
const onExport = async () => {
  try {
    // 고해상도 캔버스 생성
    const exportCanvas = document.createElement('canvas')
    const size = EXPORT_SIZES.find(s => s.value === form.exportSize) || EXPORT_SIZES[0]
    exportCanvas.width = size.w
    exportCanvas.height = size.h
    
    const ctx = exportCanvas.getContext('2d')
    const scale = size.w / 620 // 미리보기 대비 스케일
    
    // 배경
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    
    // 배경 이미지
    if (bgImgRef.current) {
      drawImageCover(ctx, bgImgRef.current, 0, 0, exportCanvas.width, exportCanvas.height, form.bgBlur || 0)
      ctx.fillStyle = `rgba(0,0,0,${form.bgOverlay || 0.25})`
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    }
    
    // 제목
    if (form.title) {
      ctx.fillStyle = getAccentColor(form)
      ctx.font = `bold ${32 * scale}px ${getFontFamily(form)}`
      ctx.textAlign = 'center'
      ctx.fillText(form.title, exportCanvas.width / 2, 80 * scale)
    }
    
    // 설명
    if (form.desc) {
      ctx.fillStyle = '#374151'
      ctx.font = `${16 * scale}px ${getFontFamily(form)}`
      ctx.textAlign = 'center'
      drawMultilineText(ctx, form.desc, exportCanvas.width / 2, 120 * scale, exportCanvas.width - 80 * scale, 20 * scale)
    }
    
    // QR 코드가 있으면 생성
    if (form.link) {
      const QRCode = (await import('qrcode')).default
      const qrSize = 150 * scale
      const qrX = exportCanvas.width - qrSize - 40 * scale
      const qrY = exportCanvas.height - 300 * scale + 15 * scale
      
      // QR 배경
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)
      ctx.strokeStyle = getAccentColor(form)
      ctx.lineWidth = 2 * scale
      ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)
      
      // QR 코드 생성
      const qrCanvas = document.createElement('canvas')
      await QRCode.toCanvas(qrCanvas, form.link, { 
        width: qrSize, 
        margin: 0, 
        errorCorrectionLevel: 'H'
      })
      ctx.drawImage(qrCanvas, qrX, qrY)
    }
    
    // 다운로드
    const link = document.createElement('a')
    link.download = `${form.title || 'poster'}_${Date.now()}.png`
    link.href = exportCanvas.toDataURL('image/png')
    link.click()
    
    console.log('포스터 내보내기 완료!')
  } catch (error) {
    console.error('내보내기 실패:', error)
    alert('내보내기에 실패했습니다.')
  }
}

// 헬퍼 함수들
const drawImageCover = (ctx, img, x, y, w, h, blur = 0) => {
  ctx.save()
  if (blur > 0) ctx.filter = `blur(${blur}px)`
  const imgRatio = img.width / img.height, boxRatio = w / h
  let dw, dh, dx, dy
  if (imgRatio > boxRatio) {
    dh = h; dw = img.width * (h / img.height); dx = x + (w - dw) / 2; dy = y
  } else {
    dw = w; dh = img.height * (w / img.width); dx = x; dy = y + (h - dh) / 2
  }
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
}

const drawMultilineText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ')
  let line = '', currentY = y
  for (const word of words) {
    const testLine = line + word + ' '
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      ctx.fillText(line, x, currentY)
      line = word + ' '; currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
}

const getAccentColor = (form) => {
  const palettes = { brand: '#2563eb', mint: '#10b981', sun: '#f59e0b', rose: '#f43f5e' }
  return form.accent || palettes[form.palette] || '#2563eb'
}

const getFontFamily = (form) => {
  return form.fontFamily || 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial'
}


return (
<div className="app-container">
<header>
<h1>QR-project</h1>
<p className="sub">템플릿 · 폰트 · 팔레트 · 배경 · 다양한 출력 사이즈 제공</p>
</header>


<main className="grid">
<Form
form={form}
upd={upd}
onSave={onSaveHistory}
onExport={onExport}
setLogoFile={setLogoFile}
setBgFile={setBgFile}
TEMPLATES={TEMPLATES}
FONTS={FONTS}
PALETTES={PALETTES}
EXPORT_SIZES={EXPORT_SIZES}
/>
<Preview form={form} logoImgRef={logoImgRef} bgImgRef={bgImgRef} renderTick={renderTick} />
</main>


<History history={history} setForm={setForm} />
</div>
)
}


function fileToImage(file){
return new Promise((resolve, reject)=>{
const reader = new FileReader()
reader.onload = () => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = reader.result }
reader.onerror = reject
reader.readAsDataURL(file)
})
}