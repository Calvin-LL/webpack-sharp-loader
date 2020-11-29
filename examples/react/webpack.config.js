const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "main.js",
  },
  // to hide performance hints on compile, do not add this to your code
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|webp|tiff?)/i,
        use: [
          "file-loader",
          {
            loader: "webpack-sharp-loader",
            options: {
              processFunction: (sharp) => sharp.negate(),
            },
          },
        ],
      },
      /*
      // if you only want to process some but not all images
      {
        test: /\.(png|jpe?g|svg|gif|webp|tiff?)$/i,
        oneOf: [
          {
            // if the import url looks like "some.png?sharp..."
            resourceQuery: /sharp/,
            use: [
              "file-loader",
              {
                loader: "webpack-sharp-loader",
                options: {
                  processFunction: (sharp) => sharp.negate(),
                },
              },
            ],
          },
          {
            // if no previous resourceQuery match
            use: "file-loader",
          },
        ],
      },
      */
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
};
