/*
  ONLY RUN BUILDS WITH `npm run webpack`!
  DO NOT USE NORMAL WEBPACK! IT WILL NOT WORK!
*/

const webpack = require('webpack');
const createVariants = require('parallel-webpack').createVariants;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const version = require('./package.json').version;

const createConfig = options => {
  const plugins = [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        __DISCORD_WEBPACK__: '"true"',
      },
    }),
  ];

  if (options.minify) {
    plugins.push(new UglifyJSPlugin({
      uglifyOptions: {
        mangle: { keep_classnames: true },
        output: { comments: false },
      },
    }));
  }

  const filename = `./webpack/discord${process.env.VERSIONED === 'false' ? '' : '.' + version}${options.minify ? '.min' : ''}.js`; // eslint-disable-line

  return {
    entry: './browser.js',
    output: {
      path: __dirname,
      filename,
    },
    module: {
      rules: [
        { test: /\.md$/, loader: 'ignore-loader' },
      ],
    },
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
