import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import Preview from "./components/Preview";
import History from "./components/History";
import { loadForm, saveForm } from "./utils/storage";
import "./styles.css";

const App = () => {
  const [form, setForm] = useState(loadForm());
  const [history, setHistory] = useState([]);

  useEffect(() => {
    saveForm(form);
  }, [form]);

  return (
    <div className="app-container">
      <header>
        <h1>QR-project</h1>
      </header>
      <main className="grid">
        <Form form={form} setForm={setForm} setHistory={setHistory} />
        <Preview form={form} />
      </main>
      <History history={history} setForm={setForm} />
    </div>
  );
};

export default App;
