import fs from "fs";
import path from "path";

import { IFs, Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";
import webpack5 from "webpack5";

export default (
  webpackVersion: 4 | 5,
  loaderOptions?: any,
  useFileLoad = true,
  fileName = "index.js"
) => {
  const fixturesDir = path.resolve(__dirname, "..", "fixtures");
  const fullConfig = {
    mode: "production",
    devtool: false,
    context: fixturesDir,
    entry: path.resolve(fixturesDir, fileName),
    output: {
      publicPath: "",
      path: path.resolve(__dirname, "..", "outputs"),
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|svg)/i,
          use: [
            ...(useFileLoad
              ? [
                  {
                    loader: "file-loader",
                    options: {
                      name: "[name].[ext]",
                    },
                  },
                ]
              : []),
            {
              loader: path.resolve(__dirname, "..", "..", "dist", "cjs.js"),
              options: {
                ...loaderOptions,
              },
            },
          ],
        },
      ],
    },
  };

  const wp = (webpackVersion === 5 ? webpack5 : webpack) as typeof webpack;
  const compiler = wp(fullConfig as webpack.Configuration);

  const virtualFileSystem = createFsFromVolume(new Volume()) as IFs & {
    join: typeof path.join;
  };

  virtualFileSystem.join = path.join.bind(path);

  compiler.outputFileSystem = virtualFileSystem;

  return compiler;
};
