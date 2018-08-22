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
      'process.emitWarning': (any, ...more) => console.warn(any, more),
    }),
  ];

  const filename = `./webpack/discord${process.env.VERSIONED === 'false' ? '' : '.' + version}${options.mode === 'production' ? '.min' : ''}.js`; // eslint-disable-line

  return {
    entry: './browser.js',
    mode: options.mode,
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
      process: true,
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          uglifyOptions: {
            mangle: { keep_classnames: true },
            compress: { keep_classnames: true },
            output: { comments: false },
          },
        }),
      ],
    },
    plugins,
  };
};

module.exports = createVariants({}, { mode: ['development', 'production'] }, createConfig);
