const { override, useBabelRc } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
    (config) => {
        config.resolve.fallback = {
            buffer: require.resolve('buffer/'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            util: require.resolve('util/'),
            process: require.resolve('process/browser'),
        };

        config.plugins = (config.plugins || []).concat([
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',
            }),
        ]);

        return config;
    },
);
