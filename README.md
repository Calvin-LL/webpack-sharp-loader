# webpack-sharp-loader

[![npm](https://img.shields.io/npm/v/webpack-sharp-loader?style=flat)](https://www.npmjs.com/package/webpack-sharp-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader enable you to process [sharp](https://sharp.pixelplumbing.com/) on images when webpack bundles them.

According to [sharp](https://sharp.pixelplumbing.com/):

> This module supports reading JPEG, PNG, WebP, TIFF, GIF and SVG images.
>
> Output images can be in JPEG, PNG, WebP and TIFF formats as well as uncompressed raw pixel data.

## Install

Install with npm:

```bash
npm install webpack-sharp-loader --save-dev
```

Install with yarn:

```bash
yarn add webpack-sharp-loader --dev
```

## Usage

This loader outputs a raw image file by default. `"file-loader"` or another loader capable of handling image files should be place before this loader (_before_ since webpack loaders are run from the last one to the first).

If you only want to process some but not all images, or to process some images differently, check out [webpack-query-loader](https://github.com/Calvin-LL/webpack-query-loader) or use webpack's `resourceQuery`.

#### webpack.config.js

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|tiff?)/i,
        use: [
          "file-loader",
          {
            loader: "webpack-sharp-loader",
            options: {
              processFunction: (sharp) => sharp.flip(),
            },
          },
        ],
      },
    ],
  },
};

```

##### Or if you want to change the file format

Due to limitations of webpack, if you want to change the file format, this loader has to handle saving the file to output.

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|tiff?)/i,
        use: [
          {
            loader: "webpack-sharp-loader",
            options: {
              toBuffer: false,
              processFunction: (sharp) => sharp.flip().webp(),
              // optional options passed to internal file-loader
              fileLoaderOptions: {
                name: "[name]-[contenthash].[ext]"
              },
            },
          },
        ],
      },
    ],
  },
};

```

## Options

| Name                                          | Type       | Default     | Description                                                                                                                                           |
| --------------------------------------------- | ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[`processFunction`](#processfunction)**     | `function` | `undefined` | The function to specify how to process with sharp.                                                                                                    |
| **[`toBuffer`](#tobuffer)**                   | `boolean`  | `true`      | Whether to output as buffer.                                                                                                                          |
| **[`fileLoaderOptions`](#fileloaderoptions)** | `object`   | `undefined` | Additional options for the internal [file-loader](https://github.com/webpack-contrib/file-loader). Only used when [`toBuffer`](#tobuffer) is `false`. |

### `processfunction`

The function to specify how to process with [sharp](https://sharp.pixelplumbing.com/).

See [sharp's API page](https://sharp.pixelplumbing.com/api-operation) for details.

The function is called with a parameter named `sharp`, it is an object of the same type as the `sharp()`'s in [sharp's API page](https://sharp.pixelplumbing.com/api-operation).

The return type of the function should be an `sharp` object.

### `tobuffer`

Whether to output as buffer.

This should only be needed if you want to output the image in a different format.

When `false`, you'll need to use `"file-loader"` or another loader capable of handling raw image files.

### `fileLoaderOptions`

fileLoaderOptions is passed as the options object internally to [file-loader](https://github.com/webpack-contrib/file-loader) to save a file. Go to [file-loader](https://github.com/webpack-contrib/file-loader) to find the available options.
