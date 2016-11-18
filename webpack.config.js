const webpack = require('webpack');
const createVariants = require('parallel-webpack').createVariants;
const version = require('./package.json').version;

const createConfig = (options) => {
  const plugins = [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ];

  if (options.minify) plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));

  return {
    entry: './src/index.js',
    output: {
      path: __dirname,
      filename: `./webpack/discord.${version}${options.minify ? '.min' : ''}.js`,
    },
    module: {
      loaders: [
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.md$/, loader: 'ignore-loader' },
      ],
    },
    node: {
      fs: 'empty',
      dns: 'empty',
      tls: 'empty',
      child_process: 'empty',
      dgram: 'empty',
      __dirname: true,
    },
    plugins,
  };
};

module.exports = createVariants({}, {
  minify: [false, true],
}, createConfig);
