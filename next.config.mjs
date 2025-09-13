/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['framer-motion'],
  webpack: (config, { isServer }) => {
    // Handle ES modules properly
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };

    // Ensure proper module resolution
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://localhost:8000/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/dataEHR/:path*',
        destination: 'http://localhost:8000/dataEHR/:path*',
      },
      {
        source: '/billing/:path*',
        destination: 'http://localhost:8000/billing/:path*',
      },
      {
        source: '/phone/:path*',
        destination: 'http://localhost:8000/phone/:path*',
      },
      {
        source: '/individual/mediscan/:path*',
        destination: 'http://localhost:8000/individual/mediscan/:path*',
      },
      {
        source: '/patients/:path*',
        destination: 'http://localhost:8000/patients/:path*',
      },
      {
        source: '/user-profile/:path*',
        destination: 'http://localhost:8000/user-profile/:path*',
      },
      {
        source: '/stripe/:path*',
        destination: 'http://localhost:8000/stripe/:path*',
      },
      {
        source: '/tracking/:path*',
        destination: 'http://localhost:8000/tracking/:path*',
      },
      {
        source: '/schedule/:path*',
        destination: 'http://localhost:8000/schedule/:path*',
      },
      {
        source: '/schedule/tracking/:path*',
        destination: 'http://localhost:8000/schedule/tracking/:path*',
      },
      {
        source: '/metrics/:path*',
        destination: 'http://localhost:8000/metrics/:path*',
      },
      {
        source: '/user-profile/:path*',
        destination: 'http://localhost:8000/user-profile/:path*',
      },
    ];
  },
};

export default nextConfig;
