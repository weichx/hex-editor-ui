const webpack = require("webpack");
const globby = require("globby");

const entryFiles = globby.sync([
  "./src/editor/main.tsx"
  // "./src/editor/property_drawers/**/*.ts"
]);

module.exports = {
  entry: entryFiles,
  output: {
    filename: './dist/bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor_static',
      filename: './dist/vendor_static.js',
      minChunks(module, count) {
        var context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    })
  ]
};