import fileLoader from "file-loader";
import loaderUtils from "loader-utils";
import replaceExt from "replace-ext";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import sharp from "sharp";
import { RawSourceMap } from "source-map";
import { loader } from "webpack";

import schema from "./options.json";

export interface OPTIONS {
  processFunction: (sharp: sharp.Sharp) => sharp.Sharp;
  toBuffer?: boolean;
  fileLoaderOptions?: object;
}

export const raw = true;

export default function (
  this: loader.LoaderContext,
  content: ArrayBuffer,
  sourceMap?: RawSourceMap
) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) as Readonly<OPTIONS> | {};
  const optionsWithDefaults = {
    toBuffer: true,
    ...options,
  };

  if (!("processFunction" in optionsWithDefaults)) {
    throw new Error("Sharp Loader requires `processFunction` option to work");
  }

  validate(schema as Schema, optionsWithDefaults, {
    name: "Sharp Loader",
    baseDataPath: "options",
  });

  optionsWithDefaults
    .processFunction(sharp(Buffer.from(content)))
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      if (optionsWithDefaults.toBuffer) return callback?.(null, data);

      const fileLoaderContext = {
        ...this,
        resourcePath: replaceExt(this.resourcePath, `.${info.format}`),
        query: optionsWithDefaults.fileLoaderOptions,
      };
      const fileLoaderResult = fileLoader.call(
        fileLoaderContext,
        data,
        sourceMap
      );

      return callback?.(null, fileLoaderResult);
    })
    .catch((e) => {
      throw e;
    });
}
