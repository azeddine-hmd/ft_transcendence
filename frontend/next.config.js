/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

function getDomain() {
  let domain = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (domain) {
     if (domain.startsWith('http://')) 
       domain = domain.replace('http://','');
     else if (domain.startsWith('https://'))
       domain = domain.startsWith('https://');
  }
  return domain;
}


module.exports = {
  


  images: {
    domains: [getDomain(), 'miro.medium.com', 'cdn.intra.42.fr','i.redd.it'],
  },
}

// module.exports = nextConfig
