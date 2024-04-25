import { join } from "path";
import { readFile } from "fs/promises";

import { Json } from "../src/Json";
import { Measurement, benchmark } from "kelonio";

describe("The performance", () => {
  test("Boolean parsing", async () => {
    const measurement = await benchmark.record(
      () => {
        Json.deserialize("true");
      },
      { iterations: 10000, meanUnder: 0.01 },
    );

    logMeasurement("Boolean", measurement);
  });

  test("String parsing", async () => {
    const measurement = await benchmark.record(
      () => {
        Json.deserialize('"Hello World"');
        Json.deserialize('"\u1022"');

        Json.deserialize(
          '"Lorem ipsum dolor sit amet consectetur adipiscing elit magnis mi, purus erat tincidunt sed fringilla suscipit euismod vivamus scelerisque rutrum, nulla dis feugiat suspendisse pretium auctor faucibus eleifend. Laoreet litora egestas dictumst interdum pretium sociis dictum, donec senectus neque habitant luctus at eget, ligula primis cubilia mauris quisque suscipit. Interdum montes condimentum dignissim augue consequat pulvinar ad, vehicula cras quam etiam magna vulputate nam rhoncus, dis hendrerit fusce porttitor lacus dui. Mauris pretium parturient odio scelerisque conubia gravida sagittis nostra netus penatibus, habitant ridiculus aliquam nascetur tellus volutpat eros hendrerit. Facilisis bibendum commodo felis justo magnis vel, cras dictumst scelerisque varius cursus, egestas litora faucibus class tortor."',
        );
      },
      { iterations: 10000, meanUnder: 0.01 },
    );

    logMeasurement("Strings", measurement);
  });

  test("Number parsing", async () => {
    const measurement = await benchmark.record(
      "Number",
      () => {
        Json.deserialize("1000000");
        Json.deserialize("69.420");
        Json.deserialize("239e10");
        Json.deserialize("-982.100e10");
      },
      { iterations: 10000, meanUnder: 0.01 },
    );

    logMeasurement("Numbers", measurement);
  });

  test("Complex parsing", async () => {
    const largeJsonContent = (
      await readFile(join(__dirname, "../../common/test_suite/test_data/large-file.json"))
    ).toString("utf8");

    const measurement = await benchmark.record(
      () => {
        Json.deserialize(largeJsonContent);
      },
      { iterations: 100, meanUnder: 100 },
    );

    logMeasurement("Large Json", measurement);
  });
});

function logMeasurement(title: string, measurement: Measurement) {
  console.log(
    title,
    "\nMIN :",
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
