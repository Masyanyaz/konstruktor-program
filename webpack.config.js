const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {};

  if (isProd) {
    config.minimizer = [
      new TerserWebpackPlugin()
    ]
  }

  return config
};

const jsLoaders = () => {
  return [{
    loader: 'babel-loader',
    options: babelOptions()
  }]
};

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ]
  };

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
};

module.exports = {
  entry: {
    index: ['regenerator-runtime/runtime', './src/index.js']
  },
  output: {
    filename: "./js/script.js",
    path: path.resolve(__dirname, './')
  },
  resolve: {
    extensions: ['.js', '.json', '.scss'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/main.css',
    }),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                isProd ? require('cssnano') : () => {
                },
                require('autoprefixer')()
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
};