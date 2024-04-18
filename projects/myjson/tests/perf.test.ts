import { join } from "path";
import { readFile } from "fs/promises";

import { Json } from "../src/Json";
import { Measurement, benchmark } from "kelonio";

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

    const measurement = await benchmark.record(
      () => {
        return Json.deserialize(largeJsonContent);
      },
      { iterations: 50, meanUnder: 200 },
    );

    logMeasurement(measurement);
  });
});

function logMeasurement(measurement: Measurement) {
  console.log(
    "MIN :",
    measurement.min,
    "\nMAX :",
    measurement.max,
    "\nMOE :",
    measurement.marginOfError,
    "\nSTD :",
    measurement.standardDeviation,
    "\nMEAN:",
    measurement.mean,
  );
}
