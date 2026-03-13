/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.digitaloceanspaces.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        zlib: false,
        stream: false,
        constants: false,
        module: false,
        url: false,
        http: false,
        https: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
      };
      config.module.rules.push({
        test: /node_modules\/canvg/,
        use: 'null-loader',
      });
    }
    return config;
  },
};

export default nextConfig;
