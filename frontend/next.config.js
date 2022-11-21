/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}
module.exports = {
  images: {
    domains: ['localhost:8080', 'miro.medium.com', 'cdn.intra.42.fr','i.redd.it'],
  },
}

// module.exports = nextConfig
