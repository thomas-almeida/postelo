// Este arquivo deve ser importado apenas no cliente
// Registra o service worker se disponível
export default function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.log('Falha no registro do SW:', error);
        });
    });
  }
}