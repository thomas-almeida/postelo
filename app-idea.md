# Postelo
MVP funcionando no browser. Para abrir a câmera real, você precisa rodar em HTTPS (celular real ou localhost). Veja abaixo como transformar isso num PWA React completo.

## Arquitetura do MVP
O app tem 3 views simples:
camera → preview → gallery
A mágica toda fica em duas funções:

1. Geometria do Carimbo (Perforações)
Tanto para o SVG overlay (guia visual) quanto para o canvas de captura, o path é gerado programaticamente percorrendo as 4 bordas e inserindo arcos (A em SVG / ctx.arc() no canvas) com sweep=1 — o que faz os semicírculos "morderem" para dentro do carimbo:
js// Borda superior: cada perfuração "morde" para baixo (dentro do carimbo)
for (let p = x+step; p < x+w-step/2; p += step)
  d += `L ${p-r} ${y} A ${r} ${r} 0 0 1 ${p+r} ${y} `;

2. Captura com Clip Path
```js
// Aplica o shape como clip region
ctx.save();
stampPath(ctx, OW/2, OH/2, OW, OH);
ctx.clip();
ctx.drawImage(video, sx, sy, sw, sh, 0, 0, OW, OH); // crop central do vídeo
ctx.restore();
// Borda branca decorativa por cima
stampPath(ctx, ...);
ctx.stroke();
```

## Estrutura de pastas
```
/src
  /components
    CameraView.jsx
    PreviewView.jsx
    GalleryView.jsx
  /utils
    stampGeometry.js   ← as funções de path (reutilizáveis)
  App.jsx
/public
  manifest.json
  sw.js
```
## manifest.json (PWA)
``` json
{
  "name": "Postelo",
  "short_name": "Postelo",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "portrait",
  "background_color": "#090f09",
  "theme_color": "#090f09",
  "icons": [{ "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }]
}
```
### sw.js (Service Worker básico)
```js
self.addEventListener('install', e => e.waitUntil(
  caches.open('postelo-v1').then(c => c.addAll(['/','index.html']))
));
self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);
``` 
### Registro no main.jsx
```js
if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('/sw.js');
```