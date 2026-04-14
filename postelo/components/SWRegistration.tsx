'use client';

import { useEffect } from 'react';

export default function SWRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.log('Falha no registro do SW:', error);
        });
    }
  }, []);

  return null; // Não renderiza nada
}