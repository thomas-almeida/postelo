'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { applyStampEffect } from '@/lib/stampGeometry';

export default function PreviewPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const capturedPhoto = sessionStorage.getItem('capturedPhoto');
    if (!capturedPhoto) {
      router.push('/camera');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Define o tamanho do canvas com base na imagem
      canvas.width = img.width;
      canvas.height = img.height;

      // Aplica o efeito de carimbo com clip path
      applyStampEffect(ctx, img, canvas.width, canvas.height, 20);
    };
    img.src = capturedPhoto;
  }, [router]);


  const confirmPhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Salva a foto editada no localStorage
    const editedPhoto = canvas.toDataURL('image/jpeg');
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    photos.unshift(editedPhoto); // Adiciona a nova foto no início
    localStorage.setItem('photos', JSON.stringify(photos));

    router.push('/gallery');
  };

  const retakePhoto = () => {
    router.push('/camera');
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-900 p-4">
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <button
          onClick={retakePhoto}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Tirar Novamente
        </button>
        <h1 className="text-xl font-bold text-white">Pré-visualização</h1>
        <button
          onClick={confirmPhoto}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirmar
        </button>
      </div>

      <div className="flex-grow w-full flex items-center justify-center overflow-auto">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[70vh] object-contain border border-gray-700"
        />
      </div>

      <div className="w-full mt-4 text-center text-gray-400">
        Efeito de carimbo aplicado
      </div>
    </div>
  );
}