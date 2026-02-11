const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            const newConfig = { ...webpackConfig }; // copy the original config

            newConfig.resolve = {
                ...newConfig.resolve,
                fallback: {
                    ...newConfig.resolve.fallback,
                    timers: require.resolve('timers-browserify'),
                    util: require.resolve('util/'),
                    stream: require.resolve('stream-browserify'),
                    buffer: require.resolve('buffer/'),
                    process: require.resolve('process/browser.js'),
                },
            };

            newConfig.plugins = [
                ...newConfig.plugins,
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser.js',
                }),
            ];

            return newConfig;
        },
    },
};
