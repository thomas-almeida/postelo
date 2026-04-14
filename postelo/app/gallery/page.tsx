'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Carrega as fotos do localStorage
    const savedPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
    setPhotos(savedPhotos);
  }, []);

  const goToCamera = () => {
    router.push('/camera');
  };

  const deletePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
    localStorage.setItem('photos', JSON.stringify(updatedPhotos));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Galeria</h1>
          <button
            onClick={goToCamera}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Nova Foto
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhuma foto ainda</p>
            <button
              onClick={goToCamera}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Tirar sua primeira foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-auto rounded-lg border border-gray-700"
                />
                <button
                  onClick={() => deletePhoto(index)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Excluir foto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}