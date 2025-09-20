import React from "react";
import { pushHistory } from "../utils/storage";

const Form = ({ form, setForm, setHistory }) => {
  const update = (key, value) => setForm({ ...form, [key]: value });

  const handleSave = () => {
    const list = pushHistory(form);
    setHistory(list);
  };

  return (
    <section className="card">
      <h2>포스터 정보</h2>
      <label>제목</label>
      <input
        type="text"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
      />

      <label>링크(URL)</label>
      <input
        type="url"
        value={form.link}
        onChange={(e) => update("link", e.target.value)}
      />

      <label>날짜</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) => update("date", e.target.value)}
      />

      <label>장소</label>
      <input
        type="text"
        value={form.place}
        onChange={(e) => update("place", e.target.value)}
      />

      <label>설명</label>
      <textarea
        value={form.desc}
        onChange={(e) => update("desc", e.target.value)}
      />

      <button onClick={handleSave}>입력 저장</button>
    </section>
  );
};

export default Form;
