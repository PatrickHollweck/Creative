import { Json } from "../src/Json";
import { createInterface } from "readline";

async function main() {
  while (true) {
    await processInput();
  }
}

async function processInput() {
  return new Promise((resolve, reject) => {
    const inputInterface = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    inputInterface.question("JSON source input: ", source => {
      try {
        console.log("\nTOKENS\n-------\n");
        console.log(JSON.stringify(Json.tokenize(source), null, 4));
        console.log("\nAST\n-------\n");
        console.log(JSON.stringify(Json.parse(source), null, 4));
        console.log("\nRESULT\n-------\n");
        console.log(JSON.stringify(Json.deserialize(source), null, 4));
        console.log("\n-------\n");
      } catch (e) {
        console.log("ERROR:", e);
      } finally {
        inputInterface.question("Press <Enter> to continue...", () => {
          console.clear();
          inputInterface.close();

          return resolve(null);
        });
      }
    });
  });
}

main();
