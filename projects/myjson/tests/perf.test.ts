import { join } from "path";
import { readFile } from "fs/promises";

import { Json } from "../src/Json";
import { benchmark } from "kelonio";

describe("The performance", () => {
  test("Boolean parsing", async () => {
    await benchmark.record(
      () => {
        return Json.deserialize('"true"');
      },
      { iterations: 10000, meanUnder: 1 },
    );
  });

  test("Complex parsing", async () => {
    const largeJsonContent = (
      await readFile(join(__dirname, "suite/test_data/large-file.json"))
    ).toString("utf8");

    await benchmark.record(
      () => {
        return Json.deserialize(largeJsonContent);
      },
      { iterations: 5, meanUnder: 1 },
    );
  });
});
