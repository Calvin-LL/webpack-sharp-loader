import path from "path";

import {
  CompileOptions,
  WebpackTestBundle,
  WebpackTestCompiler,
} from "@calvin-l/webpack-loader-test-util";

interface WSLCompileOptions extends Omit<CompileOptions, "entryFilePath"> {
  entryFileName?: string;
  loaderOptions?: any;
  useFileLoader?: boolean;
}

export default class WSLWebpackTestCompiler extends WebpackTestCompiler {
  compile(options: WSLCompileOptions = {}): Promise<WebpackTestBundle> {
    const {
      loaderOptions = {},
      entryFileName = "index.js",
      useFileLoader = true,
    } = options;
    const fixturesDir = path.resolve(__dirname, "..", "fixtures");

    this.webpackConfig = {
      context: fixturesDir,
      outputPath: path.resolve(__dirname, "..", "outputs"),
      rules: [
        {
          test: /\.(png|jpg|svg)/i,
          use: [
            ...(useFileLoader
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
    };

    return super.compile({
      ...options,
      entryFilePath: path.resolve(fixturesDir, entryFileName),
    });
  }
}
