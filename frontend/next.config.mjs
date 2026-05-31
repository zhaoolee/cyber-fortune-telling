import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
});

const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || 'http://backend:11337';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendInternalUrl}/api/:path*`,
        },
        {
          source: '/admin',
          destination: `${backendInternalUrl}/admin`,
        },
        {
          source: '/admin/:path*',
          destination: `${backendInternalUrl}/admin/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${backendInternalUrl}/uploads/:path*`,
        },
        {
          source: '/content-manager/:path*',
          destination: `${backendInternalUrl}/content-manager/:path*`,
        },
        {
          source: '/content-type-builder/:path*',
          destination: `${backendInternalUrl}/content-type-builder/:path*`,
        },
        {
          source: '/users-permissions/:path*',
          destination: `${backendInternalUrl}/users-permissions/:path*`,
        },
        {
          source: '/upload/:path*',
          destination: `${backendInternalUrl}/upload/:path*`,
        },
        {
          source: '/i18n/:path*',
          destination: `${backendInternalUrl}/i18n/:path*`,
        },
      ],
    };
  },
};

export default withPWAConfig(nextConfig);
