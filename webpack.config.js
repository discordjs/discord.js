const webpack = require('webpack');
const version = require('./package.json').version;

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: `./webpack/discord.min.${version}.js`,
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.md$/,
        loader: 'ignore-loader',
      },
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
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ],
};
