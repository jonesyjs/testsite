/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' https://app.contentful.com`,
          },
        ],
      },
    ];
  },
  
  // ⚠️ GITHUB PAGES STATIC EXPORT CONFIG (BREAKS LIVE PREVIEW)
  // Uncomment below for GitHub Pages deployment (NOT RECOMMENDED for this app)
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true
  // }
};

export default nextConfig;
