import { Sharp } from "sharp";
import webpack from "webpack";

import WSLWebpackTestCompiler from "./helpers/WSLWebpackTestCompiler";

describe.each([4, 5] as const)("v%d validate options", (webpackVersion) => {
  const tests = {
    processFunction: {
      success: [(sharp: Sharp) => sharp.flip()],
      failure: [true, undefined, () => undefined],
    },
    toBuffer: {
      success: [true, false],
      failure: [1],
    },
    fileLoaderOptions: {
      success: [{}],
      failure: [1],
    },
  };

  function createTestCase(
    key: string,
    value: any,
    type: "success" | "failure"
  ): void {
    it(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with ${JSON.stringify(value)} value`, async () => {
      const compiler = new WSLWebpackTestCompiler({ webpackVersion });

      let stats: webpack.Stats | undefined;

      try {
        stats = (
          await compiler.compile({
            loaderOptions: {
              processFunction: (sharp: Sharp) => sharp.flip(),
              [key]: value,
            },
            throwOnError: false,
          })
        ).stats;
      } finally {
        if (type === "success") {
          expect(stats!.hasErrors()).toBe(false);
        } else if (type === "failure") {
          const errors = stats!.compilation.errors;

          expect(errors).toHaveLength(1);
          expect(errors[0].error.message).toMatchSnapshot();
        }
      }
    }, 60000);
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values) as ("success" | "failure")[]) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
