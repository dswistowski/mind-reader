const path = require('path');

module.exports = {
  entry: './src/background.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.background.json'
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'build'),
  },
};