'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to camera page on load
    if (typeof window !== 'undefined') {
      window.location.href = '/camera';
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Postelo</h1>
      <p>Iniciando aplicação...</p>
      <nav className="mt-8">
        <Link href="/camera" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Abrir Câmera
        </Link>
      </nav>
    </div>
  );
}