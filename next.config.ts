import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimização de imagens externas (se usar)
  images: {
    remotePatterns: [],
  },
  // Headers de segurança
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // Redireciona a raiz para /painel
  async redirects() {
    return [
      { source: "/", destination: "/painel", permanent: false },
    ];
  },
};

export default nextConfig;