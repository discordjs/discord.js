/*
  ONLY RUN BUILDS WITH `npm run web-dist`!
  DO NOT USE NORMAL WEBPACK! IT WILL NOT WORK!
*/

const webpack = require('webpack');
const createVariants = require('parallel-webpack').createVariants;

const createConfig = (options) => {
  const plugins = [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ];

  const rules = [
    { test: /\.md$/, loader: 'ignore-loader' },
  ];

  if (options.minify) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: { plugins: ['transform-es2015-template-literals'] },
    });
  }

  const filename = `./webpack/discord${options.minify ? '.min' : ''}.js`; // eslint-disable-line

  return {
    entry: './src/index.js',
    output: {
      path: __dirname,
      filename,
    },
    module: { rules },
    node: {
      fs: 'empty',
      dns: 'mock',
      tls: 'mock',
      child_process: 'empty',
      dgram: 'empty',
      zlib: 'empty',
      __dirname: true,
    },
    plugins,
  };
};

module.exports = createVariants({}, { minify: [false, true] }, createConfig);
