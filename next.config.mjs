/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'], // Allow images from Firebase Storage
  }
};

export default nextConfig;

