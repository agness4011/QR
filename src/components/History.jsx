import React from "react";
import { toYMD } from "../utils/helpers";

const History = ({ history, setForm }) => {
  return (
    <section className="card">
      <h2>최근 기록</h2>
      <div className="history-list">
        {history.map((item, idx) => (
          <div key={idx} className="history-item" onClick={() => setForm(item)}>
            <div>{item.title}</div>
            <div className="muted">{toYMD(item.date)}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default History;
