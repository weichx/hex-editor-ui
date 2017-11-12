const globby = require("globby");

const files = globby.sync([
  "./spec/spec_header.ts",
  "./spec/**/*_spec.ts"
]);

module.exports = {
  entry: files,
  output: {
    filename: './spec/spec_bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};