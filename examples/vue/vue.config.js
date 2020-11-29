module.exports = {
  publicPath: ".",
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|tiff?)$/i)
      .use("sharp")
      .loader("webpack-sharp-loader")
      .options({ processFunction: (sharp) => sharp.negate() })
      .end();

    /*
    // if you only want to process some but not all images
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|webp|tiff?)$/i)
      // if the import url looks like "some.png?sharp..."
      .oneOf("sharp")
      .resourceQuery(/sharp/)
      .use("url-loader")
      .loader(config.module.rule("images").use("url-loader").get("loader"))
      .options(config.module.rule("images").use("url-loader").get("options"))
      .end()
      .use("sharp")
      .loader("webpack-sharp-loader")
      .options({ processFunction: (sharp) => sharp.negate() })
      .end()
      .end()
      // if no previous resourceQuery match
      .oneOf("normal")
      .use("normal")
      .loader(config.module.rule("images").use("url-loader").get("loader"))
      .options(config.module.rule("images").use("url-loader").get("options"));

    config.module.rule("images").uses.delete("url-loader");
    */
  },
};
