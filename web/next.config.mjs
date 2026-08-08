/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // All food photography is local (public/images/food), so next/image
        // optimises it directly and no remote host needs allowing. Cloudinary
        // stays listed for when assets move to a CDN.
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
    },
}

export default nextConfig
