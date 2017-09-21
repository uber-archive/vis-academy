const resolve = require('path').resolve
const webpack = require('webpack')

const token = process.env.MapboxAccessToken || process.env.MAPBOX_TOKEN

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

  resolve: {
    alias: {
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        MapboxAccessToken: JSON.stringify(token),
      },
    }),
  ],
}
