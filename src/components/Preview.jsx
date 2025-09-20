import React, { useEffect, useRef } from "react";
import { renderCanvas } from "../utils/canvas";

const Preview = ({ form }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) renderCanvas(canvasRef.current, form);
  }, [form]);

  return (
    <section className="card">
      <h2>미리보기</h2>
      <canvas ref={canvasRef} width={620} height={877}></canvas>
    </section>
  );
};

export default Preview;
