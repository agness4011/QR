import React from 'react'
import { toYMD } from '../utils/helpers'


export default function History({ history, setForm }){
if (!history?.length) return null
return (
<section className="card">
<div className="body">
<h2>최근 기록</h2>
<div className="history-list">
{history.map((item, idx)=> (
<div key={idx} className="history-item" onClick={()=> setForm(item)}>
<div style={{fontWeight:700}}>{item.title || '제목 없음'}</div>
<div className="muted">{toYMD(item.date)} · {item.place || ''}</div>
</div>
))}
</div>
</div>
</section>
)
}