export const SRC_HOOK_STATE = `import { useEffect, useMemo, useRef, useState } from 'react'


export default function usePosterState(){
const [form, setForm] = useState(()=> loadForm() || DEFAULT_FORM)
const [renderTick, setRenderTick] = useState(0)
const logoImgRef = useRef(null)


// 입력 변경 시 저장 + 미리보기 리렌더 트리거
useEffect(()=>{ saveForm(form); setRenderTick(t => t+1) }, [form])


// 파일을 받아 <img> 객체 생성
const setLogoFile = async (file) => {
if (!file){ logoImgRef.current = null; setRenderTick(t=>t+1); return }
const img = await fileToImage(file)
logoImgRef.current = img
setRenderTick(t=>t+1)
}


const renderPreview = () => setRenderTick(t=>t+1)


const exportPng = async () => {
const mod = await import('../utils/canvas.js')
await mod.exportPosterPng(form, logoImgRef.current)
}


const pushHistory = () => pushHistoryItem(form)


const clearForm = () => setForm(DEFAULT_FORM)


return { form, setForm, renderTick, logoImgRef, setLogoFile, renderPreview, exportPng, pushHistory, clearForm }
}


function fileToImage(file){
return new Promise((resolve, reject)=>{
const reader = new FileReader()
reader.onload = () => {
const img = new Image()
img.onload = () => resolve(img)
img.onerror = reject
img.src = reader.result
}
reader.onerror = reject
reader.readAsDataURL(file)
})
}
`;
