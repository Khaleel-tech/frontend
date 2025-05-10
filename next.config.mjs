/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "s3-ap-southeast-1.amazonaws.com" },
      { hostname: "olawebcdn.com" },
      { hostname: "cdn.pixabay.com" },
    ],
  },
  // proxy for api requests
  async rewrites() {
    // Use environment variable or default to local development
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
