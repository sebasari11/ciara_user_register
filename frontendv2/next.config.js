/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    // If serving under /ciara path, uncomment the basePath
    // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/ciara',
    // Note: With nginx rewrite, basePath is not needed as nginx strips /ciara before proxying
}

module.exports = nextConfig

