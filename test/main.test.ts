import { toMatchImageSnapshot } from "jest-image-snapshot";
import { Sharp } from "sharp";

import WSLWebpackTestCompiler from "./helpers/WSLWebpackTestCompiler";

expect.extend({ toMatchImageSnapshot });

describe.each([4, 5] as const)(
  'v%d "processFunction" option',
  (webpackVersion) => {
    it("should work with flip", async () => {
      const compiler = new WSLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          processFunction: (sharp: Sharp) => sharp.flip(),
        },
      });

      expect(
        await bundle.readAssetAsPNG("Macaca_nigra_self-portrait_large.jpg")
      ).toMatchImageSnapshot({
        customDiffConfig: { threshold: 0 },
        customSnapshotIdentifier: "image-flipped",
      });
    });

    it("should work when changing file format", async () => {
      const compiler = new WSLWebpackTestCompiler({ webpackVersion });
      const bundle = await compiler.compile({
        loaderOptions: {
          processFunction: (sharp: Sharp) => sharp.flip().png(),
          toBuffer: false,
          fileLoaderOptions: { name: "[name].png" },
        },
        useFileLoader: false,
      });

      expect(
        await bundle.readAssetAsPNG("Macaca_nigra_self-portrait_large.png")
      ).toMatchImageSnapshot({
        customDiffConfig: { threshold: 0 },
        customSnapshotIdentifier: "image-flipped-png",
      });
    });
  }
);
