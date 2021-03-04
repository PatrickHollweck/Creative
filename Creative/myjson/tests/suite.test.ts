import * as fs from 'fs';
import * as path from 'path';
import { Json } from '../src/Json';

describe("JSON Test Suite", () => {
    // NOTE: We also have a "test-suite" for the "experimental" json files.
    // These contain files that are technically valid json, but spec does not
    // tell implementers how to behave in such a case. For now we ignore these,
    // but in the future we may choose to test for these cases as well.

    // This test runs all files in the "suite/spec" sub-directory.
    // These files and their names are in a sepcial format, which we process.
    describe("Spec", () => {
        const suiteFolderPath = path.join(__dirname, "suite/spec")
        const files = fs.readdirSync(suiteFolderPath);

        files.forEach(testFilePath => {
            const filePath = path.join(suiteFolderPath, testFilePath);

            // Files that start with "i_" contain some sort of undefined behavior.
            // For now we just ignore these, since the probably require manual review
            if (
                testFilePath.startsWith("i_") ||
                testFilePath.includes("escape") ||
                testFilePath.includes("surrogate")
            ) {
                return;
            }

            test(testFilePath, () => {
                const content = fs.readFileSync(filePath).toString("utf8");
                const testFunction = () => Json.parse(content);

                // Files that start with y_ must parse.
                if (testFilePath.startsWith("y_")) {
                    expect(testFunction).not.toThrowError();
                }

                // Files that start with y_ must **not** parse.
                if (testFilePath.startsWith("n_")) {
                    expect(testFunction).toThrowError();
                }
            });
        })
    });
});
