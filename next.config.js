const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    );
    return config;
  },
  i18n: {
    locales: ['ar', 'en', 'catchAll'],
    defaultLocale: 'catchAll',
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/en/',
        permanent: true,
        locale: false,
      },
      {
        source: '/catchAll',
        destination: '/en/',
        locale: false,
        permanent: true,
      },
      {
        source: '/catchAll/:slug*/',
        destination: '/en/:slug*/',
        locale: false,
        permanent: true,
      },
      {
        source: '/bff/:path*',
        destination: 'https://aedevb2c.corp.al-futtaim.com/bff/:path*', // Proxy to Backend
        permanent: false,
      },
    ];
  },
};
