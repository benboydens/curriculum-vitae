const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      main: './assets/js/app.js'
    },
    
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      clean: true,
      assetModuleFilename: 'assets/[hash][ext][query]'
    },
    
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]'
          }
        }
      ]
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'head',
        scriptLoading: 'defer'
      }),
      
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css'
        })
      ] : []),
      
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/img',
            to: 'img',
            noErrorOnMissing: true
          },
          {
            from: 'assets/css',
            to: 'css'
          }
        ]
      })
    ],
    
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true,
      watchFiles: ['public/**/*', 'assets/**/*']
    },
    
    resolve: {
      extensions: ['.js', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'assets'),
        '@css': path.resolve(__dirname, 'assets/css'),
        '@js': path.resolve(__dirname, 'assets/js'),
        '@img': path.resolve(__dirname, 'public/img')
      }
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};
