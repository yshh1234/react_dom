module.exports = {
  entry: './src/js/index.js',

  output: {
    filename: './src/js/bundle.js',
    publicPath: ''
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' }
    ]
  }
}
