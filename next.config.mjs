/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["avatar.vercel.sh"],
    },
    experimental: {
        serverComponentsExternalPackages: ["firebase-admin"],
    },
};

export default nextConfig;
