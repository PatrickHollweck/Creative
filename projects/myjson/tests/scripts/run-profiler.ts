// This script will generate a CPU-Profile
// Examine the profile:
//   Navigate to chrome://inspect
//   Click Open dedicated DevTools for Node
//   Select the "Performance" tab
//   Load your file

import * as fs from "fs";
import * as path from "path";
import * as v8Profiler from "v8-profiler-next";

import { Json } from "../../src/Json";

const title = "manual";

const profilePath = path.join(
  __dirname,
  "../__artifacts__",
  `${title}-${Date.now()}.cpuprofile`,
);

console.log("Starting to profile...");

v8Profiler.setGenerateType(1);
v8Profiler.startProfiling(title, true);

/// START # Code to profile

const largeJsonContent = fs
  .readFileSync(path.join(__dirname, "../suite/test_data/large-file.json"))
  .toString("utf8");

Json.deserialize(largeJsonContent);

/// END # Code to profile

const profile = v8Profiler.stopProfiling(title);

console.log("Profiling done...");
console.log("Exporting profile...");

profile.export((error, result) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(profile, result);

  fs.writeFileSync(profilePath, result!);
  profile.delete();

  console.log("DONE");
});
