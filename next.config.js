/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/huaxia-history',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
