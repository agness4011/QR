import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { toYMD } from '../utils/helpers'


export default function Preview({ form, logoImgRef, bgImgRef, renderTick }){
const canvasRef = useRef(null)


useEffect(()=>{
if (!canvasRef.current) return
renderPoster()
}, [form, logoImgRef, bgImgRef, renderTick])

const renderPoster = async () => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const scale = 0.5 // 미리보기 스케일
  
  // 캔버스 초기화
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 배경 이미지
  if (bgImgRef?.current) {
    drawImageCover(ctx, bgImgRef.current, 0, 0, canvas.width, canvas.height, form.bgBlur || 0)
    // 오버레이
    ctx.fillStyle = `rgba(0,0,0,${form.bgOverlay || 0.25})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  // 제목
  if (form.title) {
    ctx.fillStyle = getAccentColor(form)
    ctx.font = `bold ${32 * scale}px ${getFontFamily(form)}`
    ctx.textAlign = 'center'
    ctx.fillText(form.title, canvas.width / 2, 80 * scale)
  }
  
  // 설명
  if (form.desc) {
    ctx.fillStyle = '#374151'
    ctx.font = `${16 * scale}px ${getFontFamily(form)}`
    ctx.textAlign = 'center'
    drawMultilineText(ctx, form.desc, canvas.width / 2, 120 * scale, canvas.width - 80, 20)
  }
  
  // 정보 박스
  const infoY = canvas.height - 300 * scale
  const boxWidth = canvas.width - 80
  const boxHeight = 180 * scale
  const boxX = 40
  
  // 정보 박스 배경
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.fillRect(boxX, infoY, boxWidth - 200 * scale, boxHeight)
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.strokeRect(boxX, infoY, boxWidth - 200 * scale, boxHeight)
  
  // 정보 텍스트
  ctx.fillStyle = '#111827'
  ctx.font = `${14 * scale}px ${getFontFamily(form)}`
  ctx.textAlign = 'left'
  let textY = infoY + 30 * scale
  
  if (form.date) {
    ctx.fillText(`날짜: ${toYMD(form.date)}`, boxX + 20, textY)
    textY += 25 * scale
  }
  if (form.time) {
    ctx.fillText(`시간: ${form.time}`, boxX + 20, textY)
    textY += 25 * scale
  }
  if (form.place) {
    ctx.fillText(`장소: ${form.place}`, boxX + 20, textY)
    textY += 25 * scale
  }
  
  // QR 코드
  if (form.link) {
    try {
      const qrSize = 150 * scale
      const qrX = canvas.width - qrSize - 40
      const qrY = infoY + 15 * scale
      
      // QR 코드 배경
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)
      ctx.strokeStyle = getAccentColor(form)
      ctx.lineWidth = 2
      ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)
      
      // QR 코드 생성
      const qrCanvas = document.createElement('canvas')
      await QRCode.toCanvas(qrCanvas, form.link, { 
        width: qrSize, 
        margin: 0, 
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      
      ctx.drawImage(qrCanvas, qrX, qrY)
      
      // QR 설명
      ctx.fillStyle = '#6b7280'
      ctx.font = `${11 * scale}px ${getFontFamily(form)}`
      ctx.textAlign = 'center'
      ctx.fillText('스캔하여 자세히 보기', qrX + qrSize / 2, qrY + qrSize + 25)
      
    } catch (error) {
      console.error('QR 코드 생성 실패:', error)
    }
  }
  
  // 로고
  if (logoImgRef?.current) {
    const logoSize = 40 * scale
    ctx.drawImage(logoImgRef.current, canvas.width - logoSize - 20, 20, logoSize, logoSize)
  }
}

const drawImageCover = (ctx, img, x, y, w, h, blur = 0) => {
  ctx.save()
  if (blur > 0) {
    ctx.filter = `blur(${blur}px)`
  }
  const imgRatio = img.width / img.height
  const boxRatio = w / h
  let dw, dh, dx, dy
  
  if (imgRatio > boxRatio) {
    dh = h
    dw = img.width * (h / img.height)
    dx = x + (w - dw) / 2
    dy = y
  } else {
    dw = w
    dh = img.height * (w / img.width)
    dx = x
    dy = y + (h - dh) / 2
  }
  
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
}

const drawMultilineText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  
  for (const word of words) {
    const testLine = line + word + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    
    if (testWidth > maxWidth && line !== '') {
      ctx.fillText(line, x, currentY)
      line = word + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
}

const getAccentColor = (form) => {
  const palettes = {
    brand: '#2563eb',
    mint: '#10b981',
    sun: '#f59e0b',
    rose: '#f43f5e'
  }
  return form.accent || palettes[form.palette] || '#2563eb'
}

const getFontFamily = (form) => {
  return form.fontFamily || 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial'
}


return (
<section className="card">
<div className="body">
<h2>미리보기</h2>
<div className="preview-hint">템플릿/폰트/배경 옵션이 즉시 반영됩니다.</div>
<canvas ref={canvasRef} width={620} height={877}></canvas>
</div>
</section>
)
}