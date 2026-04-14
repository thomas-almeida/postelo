'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StampOverlay from '@/components/StampOverlay';

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFileUpload, setUseFileUpload] = useState(false);

  useEffect(() => {
    // Verifica se estamos no cliente
    if (typeof window !== 'undefined') {
      // Verifica se a API de mídia está disponível
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const initCamera = async () => {
          // Definir um timeout para garantir que o carregamento não fique preso indefinidamente
          const timeoutId = setTimeout(() => {
            if (isLoading) {
              setError('Tempo limite excedido ao tentar acessar a câmera. Use o upload de arquivo como alternativa.');
              setIsLoading(false);
              setUseFileUpload(true);
            }
          }, 10000); // 10 segundos de timeout

          try {
            // Verificar se o protocolo é HTTPS em produção
            if (typeof location !== 'undefined' && location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
              throw new Error('Acesso à câmera requer conexão segura (HTTPS)');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: 'environment'
              }
            });

            clearTimeout(timeoutId); // Cancelar o timeout se a câmera for acessada com sucesso

            if (videoRef.current) {
              videoRef.current.srcObject = stream;

              // Garantir que o vídeo comece a tocar
              videoRef.current.play().catch(error => {
                console.error("Erro ao tentar reproduzir o vídeo:", error);
              });

              setHasPermission(true);
            }
          } catch (err: any) {
            clearTimeout(timeoutId); // Cancelar o timeout em caso de erro

            console.error('Erro ao acessar a câmera:', err);

            // Se o erro for relacionado a permissões, sugerir upload de arquivo
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              setError('Permissão para acessar a câmera negada. Você pode usar o upload de arquivo como alternativa.');
              setUseFileUpload(true);
            } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
              setError('Câmera não encontrada ou indisponível. Use o upload de arquivo como alternativa.');
              setUseFileUpload(true);
            } else if (err.message && err.message.includes('HTTPS')) {
              setError('Acesso à câmera requer conexão segura (HTTPS). Use o upload de arquivo como alternativa.');
              setUseFileUpload(true);
            } else {
              setError(err.message || 'Não foi possível acessar a câmera. Verifique as permissões.');
            }

            setHasPermission(false);
          } finally {
            // Certificar-se de que isLoading seja definido como false
            if (isLoading) {
              setIsLoading(false);
            }
          }
        };

        initCamera();

        return () => {
          if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
          }
        };
      } else {
        // Se a API de mídia não estiver disponível, usar upload de arquivo
        setError('Acesso à câmera não suportado neste navegador. Use o upload de arquivo como alternativa.');
        setIsLoading(false);
        setUseFileUpload(true);
      }
    } else {
      // Caso o window não esteja definido, finalizar o loading
      setIsLoading(false);
    }
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Define o tamanho do canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Desenha o frame do vídeo no canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Aplica o efeito de carimbo com clip path
        applyStampEffect(ctx, canvas.width, canvas.height);

        // Converte para base64 para passar para a próxima página
        const photoDataUrl = canvas.toDataURL('image/jpeg');

        // Armazena temporariamente a foto
        sessionStorage.setItem('capturedPhoto', photoDataUrl);

        // Redireciona para a página de preview
        router.push('/preview');
      }
    }
  };

  // Função para aplicar o efeito de carimbo no canvas
  const applyStampEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const margin = Math.min(width, height) * 0.1; // Margem de 10%
    const stampWidth = width - 2 * margin;
    const stampHeight = height - 2 * margin;

    // Salva o estado do contexto
    ctx.save();

    // Define o path do carimbo e aplica como clipping region
    drawStampPath(ctx, width / 2, height / 2, stampWidth, stampHeight, 20);
    ctx.clip();

    // Restaura o estado do contexto para que o desenho permaneça visível
    ctx.restore();

    // Desenha a borda decorativa do carimbo
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    drawStampPath(ctx, width / 2, height / 2, stampWidth, stampHeight, 20);
    ctx.stroke();
  };

  // Função para desenhar o path do carimbo no canvas
  const drawStampPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, height: number, step: number) => {
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
  };

  // Função para lidar com o upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Cria um canvas temporário para aplicar o efeito de carimbo
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;

            // Desenha a imagem no canvas
            tempCtx.drawImage(img, 0, 0);

            // Aplica o efeito de carimbo
            applyStampEffect(tempCtx, tempCanvas.width, tempCanvas.height);

            // Converte para data URL
            const processedImageData = tempCanvas.toDataURL('image/jpeg');

            // Armazena temporariamente a foto
            sessionStorage.setItem('capturedPhoto', processedImageData);

            // Redireciona para a página de preview
            router.push('/preview');
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para solicitar permissão novamente
  const requestPermission = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Parar imediatamente

        // Recarregar a página para tentar novamente
        window.location.reload();
      } catch (err) {
        console.error('Permissão ainda negada:', err);
        setError('A permissão para acessar a câmera continua negada.');
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p>Carregando câmera...</p>
        </div>
      ) : !hasPermission && useFileUpload ? (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <div className="max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Alternativa de Câmera</h2>
            <p className="text-gray-300 mb-6">
              {error || 'A câmera não pôde ser acessada. Use o upload de arquivo como alternativa.'}
            </p>

            <input
              type="file"
              accept="image/*"
              capture="environment" // Sugere câmera traseira em dispositivos móveis
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4"
            >
              Escolher Foto
            </button>

            {error && error.includes('negada') && (
              <button
                onClick={requestPermission}
                className="w-full max-w-xs mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Solicitar Permissão Novamente
              </button>
            )}

            <p className="text-gray-400 text-sm mt-6">
              Dica: Em dispositivos móveis, certifique-se de que o site está em HTTPS e que você concedeu permissão para acessar a câmera.
            </p>
          </div>
        </div>
      ) : !hasPermission ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-4">
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-300">Certifique-se de estar em um ambiente seguro (HTTPS) e de ter concedido permissão para acessar a câmera.</p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Overlay do carimbo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <StampOverlay width={300} height={300} step={20} />
          </div>

          <button
            onClick={capturePhoto}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg hover:bg-gray-200 transition-colors"
            aria-label="Capturar foto"
          >
            <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white"></div>
          </button>

          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}

