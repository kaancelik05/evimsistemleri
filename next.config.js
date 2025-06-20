/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['images.pexels.com']
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