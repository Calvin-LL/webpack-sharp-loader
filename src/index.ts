import fileLoader from "file-loader";
import loaderUtils from "loader-utils";
import replaceExt from "replace-ext";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { RawSourceMap } from "source-map";
import { loader } from "webpack";

import schema from "./options.json";

export interface Options {
  readonly processFunction: (sharp: sharp.Sharp) => sharp.Sharp;
  readonly toBuffer?: boolean;
  readonly fileLoaderOptions?: Record<string, unknown>;
}

export type FullOptions = Options & Required<Pick<Options, "toBuffer">>;

export const raw = true;

export default function (
  this: loader.LoaderContext,
  content: ArrayBuffer,
  sourceMap?: RawSourceMap
): void {
  const callback = this.async() as loader.loaderCallback;
  const defaultOptions = {
    toBuffer: true,
  } as FullOptions;
  const options: FullOptions = {
    ...defaultOptions,
    ...loaderUtils.getOptions(this),
  };

  validate(schema as Schema, options, {
    name: "Sharp Loader",
    baseDataPath: "options",
  });

  options
    .processFunction(sharp(Buffer.from(content)))
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      if (options.toBuffer) return callback(null, data);

      const fileLoaderContext = {
        ...this,
        resourcePath: replaceExt(this.resourcePath, `.${info.format}`),
        query: options.fileLoaderOptions,
      };
      const fileLoaderResult = fileLoader.call(
        fileLoaderContext,
        data,
        sourceMap
      );

      return callback(null, fileLoaderResult);
    })
    .catch((e) => {
      throw e;
    });
}
