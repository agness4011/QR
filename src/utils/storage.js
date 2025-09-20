const LS_FORM = 'qrproject_form_v2'
const LS_HISTORY = 'qrproject_history_v2'


const DEF = {
title: '', link: '', date: '', time: '', place: '', desc: '',
template: 'seminar',
fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial',
palette: 'brand',
accent: '#2563eb',
bgOverlay: 0.25,
bgBlur: 0,
exportSize: 'a4',
}


export function loadForm(){
try { return { ...DEF, ...(JSON.parse(localStorage.getItem(LS_FORM)) || {}) } } catch { return { ...DEF } }
}


export function saveForm(form){
localStorage.setItem(LS_FORM, JSON.stringify(form))
}


export function pushHistory(form){
let list = []
try { list = JSON.parse(localStorage.getItem(LS_HISTORY)) || [] } catch {}
list.unshift({ ...form, ts: Date.now() })
if (list.length > 12) list = list.slice(0, 12)
localStorage.setItem(LS_HISTORY, JSON.stringify(list))
return list
}


export function loadHistory(){
try { return JSON.parse(localStorage.getItem(LS_HISTORY)) || [] } catch { return [] }
}