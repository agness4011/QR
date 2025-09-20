import React, { useRef } from 'react'

export default function Form({ form, upd, onSave, onExport, setBgFile, setLogoFile, TEMPLATES, FONTS, PALETTES, EXPORT_SIZES }) {
  const bgRef = useRef(null);
  const logoRef = useRef(null);

  return (
    <form>
      <div>
        <label>제목</label>
        <input 
          type="text" 
          value={form.title || ''} 
          onChange={upd('title')} 
          placeholder="이벤트 제목을 입력하세요"
        />
      </div>
      
      <div>
        <label>링크 (QR코드)</label>
        <input 
          type="url" 
          value={form.link || ''} 
          onChange={upd('link')} 
          placeholder="https://example.com"
        />
      </div>

      <div className="row">
        <div>
          <label>날짜</label>
          <input 
            type="date" 
            value={form.date || ''} 
            onChange={upd('date')} 
          />
        </div>
        <div>
          <label>시간</label>
          <input 
            type="time" 
            value={form.time || ''} 
            onChange={upd('time')} 
          />
        </div>
      </div>

      <div>
        <label>장소</label>
        <input 
          type="text" 
          value={form.place || ''} 
          onChange={upd('place')} 
          placeholder="장소를 입력하세요"
        />
      </div>

      <div>
        <label>설명</label>
        <textarea 
          value={form.desc || ''} 
          onChange={upd('desc')} 
          placeholder="이벤트 설명을 입력하세요"
          rows="3"
        />
      </div>

      <h2>디자인 설정</h2>
      
      <div>
        <label>템플릿</label>
        <select value={form.template} onChange={upd('template')}>
          {TEMPLATES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label>폰트</label>
        <select value={form.fontFamily} onChange={upd('fontFamily')}>
          {FONTS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
      <div className="row">
        <div>
          <label>팔레트</label>
          <select value={form.palette} onChange={upd('palette')}>
            {PALETTES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>주요 색상(수정 가능)</label>
          <input type="color" value={form.accent} onChange={upd('accent')} />
        </div>
      </div>

    <label>배경 이미지 (선택)</label>
    <div className="filebox">
      <input
        ref={bgRef}
        type="file"
        accept="image/*"
        onChange={e => setBgFile(e.target.files?.[0] || null)}
      />
      <button
        className="btn"
        type="button"
        onClick={() => {
          setBgFile(null);
          if (bgRef.current) bgRef.current.value = '';
        }}
      >
        배경 제거
      </button>
    </div>

    <div className="row">
      <div>
        <label>배경 불투명도</label>
        <input
          type="range"
          min="0"
          max="0.9"
          step="0.05"
          value={form.bgOverlay}
          onChange={upd('bgOverlay')}
        />
      </div>
      <div>
        <label>배경 블러(px)</label>
        <input
          type="number"
          min="0"
          max="20"
          value={form.bgBlur}
          onChange={upd('bgBlur')}
        />
      </div>
    </div>

    <h2 style={{ marginTop: 16 }}>내보내기</h2>
    <div className="row">
      <div>
        <label>사이즈</label>
        <select value={form.exportSize} onChange={upd('exportSize')}>
          {EXPORT_SIZES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label>로고 (선택)</label>
        <div className="filebox">
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            onChange={e => setLogoFile(e.target.files?.[0] || null)}
          />
          <button
            className="btn"
            type="button"
            onClick={() => {
              setLogoFile(null);
              if (logoRef.current) logoRef.current.value = '';
            }}
          >
            로고 제거
          </button>
        </div>
      </div>
    </div>

    <div className="actions">
      <button className="btn primary" type="button" onClick={onSave}>
        입력 저장
      </button>
      <button className="btn accent" type="button" onClick={onExport}>
        PNG 다운로드
      </button>
    </div>

    <p className="small" style={{ marginTop: 8 }}>
      입력·옵션은 이 기기의 <code>localStorage</code>에만 저장됩니다.
    </p>
    </form>
  );
}