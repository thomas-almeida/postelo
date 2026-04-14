/**
 * Funções para gerar os paths geométricos do carimbo com perfurações
 */

interface Point {
  x: number;
  y: number;
}

/**
 * Gera o path SVG para o carimbo com perfurações
 * @param cx Centro X do carimbo
 * @param cy Centro Y do carimbo
 * @param width Largura do carimbo
 * @param height Altura do carimbo
 * @param step Distância entre perfurações
 * @returns String do path SVG
 */
export function generateStampPath(cx: number, cy: number, width: number, height: number, step: number): string {
  const x = cx - width / 2;
  const y = cy - height / 2;
  const w = width;
  const h = height;
  const r = step / 2;

  let d = `M ${x} ${y}`;

  // Borda superior: perfurações "mordendo" para dentro
  for (let p = x + step; p < x + w - step / 2; p += step) {
    d += `L ${p - r} ${y} A ${r} ${r} 0 0 1 ${p + r} ${y} `;
  }

  // Borda direita
  for (let p = y + step; p < y + h - step / 2; p += step) {
    d += `L ${x + w} ${p - r} A ${r} ${r} 0 0 1 ${x + w} ${p + r} `;
  }

  // Borda inferior (em sentido inverso)
  for (let p = x + w - step; p > x + step / 2; p -= step) {
    d += `L ${p + r} ${y + h} A ${r} ${r} 0 0 1 ${p - r} ${y + h} `;
  }

  // Borda esquerda
  for (let p = y + h - step; p > y + step / 2; p -= step) {
    d += `L ${x} ${p + r} A ${r} ${r} 0 0 1 ${x} ${p - r} `;
  }

  d += 'Z'; // Fecha o caminho
  return d;
}

/**
 * Desenha o path do carimbo no canvas 2D
 * @param ctx Contexto 2D do canvas
 * @param cx Centro X do carimbo
 * @param cy Centro Y do carimbo
 * @param width Largura do carimbo
 * @param height Altura do carimbo
 * @param step Distância entre perfurações
 */
export function drawStampPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, height: number, step: number) {
  const x = cx - width / 2;
  const y = cy - height / 2;
  const w = width;
  const h = height;
  const r = step / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);

  // Borda superior: perfurações "mordendo" para dentro
  for (let p = x + step; p < x + w - step / 2; p += step) {
    ctx.lineTo(p - r, y);
    ctx.arc(p, y, r, Math.PI, 0, false); // Semicírculo aberto para baixo
  }

  // Borda direita
  for (let p = y + step; p < y + h - step / 2; p += step) {
    ctx.lineTo(x + w, p - r);
    ctx.arc(x + w, p, r, -Math.PI / 2, Math.PI / 2, false); // Semicírculo aberto para a esquerda
  }

  // Borda inferior
  for (let p = x + w - step; p > x + step / 2; p -= step) {
    ctx.lineTo(p + r, y + h);
    ctx.arc(p, y + h, r, 0, Math.PI, true); // Semicírculo aberto para cima
  }

  // Borda esquerda
  for (let p = y + h - step; p > y + step / 2; p -= step) {
    ctx.lineTo(x, p + r);
    ctx.arc(x, p, r, Math.PI / 2, -Math.PI / 2, true); // Semicírculo aberto para a direita
  }

  ctx.closePath();
}

/**
 * Aplica o efeito de carimbo com clip path no canvas
 * @param ctx Contexto 2D do canvas
 * @param img Imagem a ser aplicada
 * @param canvasWidth Largura do canvas
 * @param canvasHeight Altura do canvas
 * @param step Distância entre perfurações
 */
export function applyStampEffect(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvasWidth: number, canvasHeight: number, step: number = 20) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Salva o estado do contexto
  ctx.save();

  // Calcula dimensões do carimbo com margem
  const margin = Math.min(canvasWidth, canvasHeight) * 0.1; // Margem de 10%
  const stampWidth = canvasWidth - 2 * margin;
  const stampHeight = canvasHeight - 2 * margin;

  // Define o path do carimbo e aplica como clipping region
  drawStampPath(ctx, canvasWidth / 2, canvasHeight / 2, stampWidth, stampHeight, step);
  ctx.clip();

  // Desenha a imagem com o corte do carimbo
  ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

  // Restaura o estado do contexto
  ctx.restore();

  // Desenha a borda decorativa do carimbo
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  drawStampPath(ctx, canvasWidth / 2, canvasHeight / 2, stampWidth, stampHeight, step);
  ctx.stroke();
}