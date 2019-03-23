module.exports = {
  entry: './client/index.jsx',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/public',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react'],
        },
      },
    ],
  },
};
