/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Server Actions kullanıldığı için geçici olarak kapatıldı
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['images.pexels.com'],
    // unoptimized: true // output export kapalıyken gerekmiyor
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];
    return config;
  },
};

module.exports = nextConfig;