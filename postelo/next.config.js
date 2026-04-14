/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Removido para evitar conflitos
  },
  allowedDevOrigins: ['192.168.0.10', '153c-2804-14c-c4-8576-8211-aede-40d2-44e.ngrok-free.app'],
}

module.exports = nextConfig