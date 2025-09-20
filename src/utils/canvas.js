import QRCode from 'qrcode'

function drawImageCover(ctx, img, x, y, w, h, blur = 0) {
  ctx.save();
  if (blur > 0) {
    ctx.filter = `blur(${blur}px)`;
  }
  const imgRatio = img.width/img.height, boxRatio = w/h
  let dw, dh, dx, dy
  if (imgRatio > boxRatio){ dh = h; dw = img.width * (h/img.height); dx = x + (w - dw)/2; dy = y }
  else { dw = w; dh = img.height * (w/img.width); dx = x; dy = y + (h - dh)/2 }
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

async function drawInfoAndQr(ctx, form, W, H, scale, fontFamily, accent, opts) {
    const pad = 40 * scale;
const infoY = H - 240*scale
const qrSize = opts.qrSize || 200*scale
const qrX = W - pad - qrSize
const qrY = infoY


// 정보 박스
roundRect(ctx, pad, infoY, W - pad*2 - qrSize - 16*scale, 160*scale, 12*scale, 'rgba(0,0,0,0.03)', 'rgba(0,0,0,0.08)')
ctx.fillStyle = '#111827'; ctx.font = `${16*scale}px ${fontFamily}`
const lines = []
if (form.date) lines.push(`날짜 : ${toYMD(form.date)}`)
if (form.time) lines.push(`시간 : ${form.time}`)
if (form.place) lines.push(`장소 : ${form.place}`)
lines.forEach((t,i)=> ctx.fillText(t, pad+18*scale, infoY + 32*scale + i*(24*scale)))


// QR 패널
roundRect(ctx, qrX, qrY, qrSize, qrSize, 12*scale, '#fff', accent)
const qrCanvas = await makeQrCanvas(form.link || 'https://example.com', Math.floor(qrSize - 20*scale))
ctx.drawImage(qrCanvas, qrX + 10*scale, qrY + 10*scale)
ctx.fillStyle = 'rgba(17,24,39,0.7)'; ctx.font = `${12*scale}px ${fontFamily}`
ctx.fillText('스캔하여 자세히 보기', qrX, qrY + qrSize + 18*scale)
}


function toYMD(dateStr){ if(!dateStr) return ''; try{ const d=new Date(dateStr+'T00:00:00'); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}` }catch{ return dateStr } }


function drawMultiline(ctx, text, x, y, maxW, lh){
const words = String(text).split(/\s+/); let line=''; let dy=0; const fs=parseInt(ctx.font)
for (const w of words){
const test=(line?line+' ':'')+w
if (ctx.measureText(test).width > maxW && line){ ctx.fillText(line, x, y+dy); line=w; dy+=fs*lh }
else { line=test }
}
if (line) ctx.fillText(line, x, y+dy)
}


function roundRect(ctx, x,y,w,h,r, fill='#fff', stroke='#e5e7eb'){
roundPath(ctx, x,y,w,h,r)
ctx.fillStyle = fill; ctx.fill()
if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke() }
}
function roundPath(ctx, x,y,w,h,r){ const rr=Math.min(r,w/2,h/2); ctx.beginPath(); ctx.moveTo(x+rr,y); ctx.arcTo(x+w,y,x+w,y+h,rr); ctx.arcTo(x+w,y+h,x,y+h,rr); ctx.arcTo(x,y+h,x,y,rr); ctx.arcTo(x,y,x+w,y,rr); ctx.closePath() }


async function makeQrCanvas(text, size){
const c = document.createElement('canvas'); c.width = c.height = size
await QRCode.toCanvas(c, text, { width:size, margin:0, errorCorrectionLevel:'H' })
return c
}

export { drawImageCover, drawInfoAndQr, drawMultiline, roundRect, makeQrCanvas }