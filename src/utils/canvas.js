import QRCode from "qrcode";

export async function renderCanvas(canvas, form) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  ctx.font = "24px Arial";
  ctx.fillText(form.title || "제목 없음", 40, 60);

  if (form.date) ctx.fillText(`날짜: ${form.date}`, 40, 100);
  if (form.place) ctx.fillText(`장소: ${form.place}`, 40, 140);
  if (form.desc) ctx.fillText(form.desc, 40, 180);

  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, form.link || "https://example.com", {
    width: 180,
    margin: 1,
  });
  ctx.drawImage(qrCanvas, canvas.width - 220, canvas.height - 220);
}
