/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}
module.exports = {
  images: {
    domains: ['miro.medium.com', 'cdn.intra.42.fr'],
  },
}

// module.exports = nextConfig
