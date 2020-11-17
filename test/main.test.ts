import { toMatchImageSnapshot } from "jest-image-snapshot";
import { Sharp } from "sharp";
import webpack from "webpack";

import compile from "./helpers/compile";
import convertToPng from "./helpers/convertToPng";
import getCompiler from "./helpers/getCompiler";
import readAsset from "./helpers/readAsset";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)(
  'v%d "processFunction" option',
  (webpackVersion) => {
    it("should work with flip", async () => {
      const compiler = getCompiler(webpackVersion, {
        processFunction: (sharp: Sharp) => sharp.flip(),
      });
      const stats = await compile(webpackVersion, compiler);

      expect(
        await convertToPng(
          readAsset(
            "Macaca_nigra_self-portrait_large.jpg",
            compiler,
            stats as webpack.Stats,
            true
          )
        )
      ).toMatchImageSnapshot({
        customDiffConfig: { threshold: 0 },
        customSnapshotIdentifier: "image-flipped",
      });
    });

    it("should work when changing file format", async () => {
      const compiler = getCompiler(
        webpackVersion,
        {
          processFunction: (sharp: Sharp) => sharp.flip().webp(),
          toBuffer: false,
          fileLoaderOptions: { name: "[name].[ext]" },
        },
        false
      );
      const stats = await compile(webpackVersion, compiler);

      expect(
        await convertToPng(
          readAsset(
            "Macaca_nigra_self-portrait_large.webp",
            compiler,
            stats as webpack.Stats,
            true
          )
        )
      ).toMatchImageSnapshot({
        customDiffConfig: { threshold: 0 },
        customSnapshotIdentifier: "image-flipped-webp",
      });
    });
  }
);
