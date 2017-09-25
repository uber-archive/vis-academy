const resolve = require('path').resolve
const webpack = require('webpack')

module.exports = {
  entry: resolve('./root'),

  devtool: 'source-map',

  module: {
    rules: [
      {
        // Compile ES2015 using buble
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'].map(n => require.resolve(`babel-preset-${n}`)),
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      },
    }),
  ],
}
