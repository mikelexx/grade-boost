/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Allow images from Firebase Storage
        pathname: '/**', // Allows all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Allow images from Google user content
        pathname: '/**', // Allows all paths under this domain
      },
    ],
  },
};

export default nextConfig;

