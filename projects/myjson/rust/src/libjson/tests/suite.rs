use std::{fs, panic};

use crate::Json;

// README!
// If you want to run a single specific test case, paste the file_name into this array.
// If this array is being left empty, it will include all tests that are not skipped above!
const TESTS_TO_INCLUDE: &'static [&str] = &[];

// NOTE!
// Use the following command to run these tests (on Linux...)
// $ clear && RUST_BACKTRACE=1 RUST_MIN_STACK=1000000000 cargo test -- --nocapture

#[test]
fn test_suite() -> Result<(), Box<dyn std::error::Error>> {
    let suite_files_to_test = fs::read_dir("./../common/test_suite/spec")
        .unwrap()
        .map(|entry| entry.unwrap())
        .filter(|file_path_entry| {
            let file_name = file_path_entry.file_name().into_string().unwrap();

            return !file_name.starts_with("i")
                && (TESTS_TO_INCLUDE.is_empty() || TESTS_TO_INCLUDE.contains(&file_name.as_str()));
        })
        .map(|file_path| {
            let content = fs::read(file_path.path()).unwrap();
            let source = std::string::String::from_utf8_lossy(&content[..]).into_owned();

            return (file_path.file_name().into_string().unwrap(), source);
        });

    for (test_name, source) in suite_files_to_test {
        println!("RUNNING: {}", test_name);

        let parse_result = Json::deserialize(source);

        match test_name.chars().nth(0).unwrap() {
            // Spec-files that start with "y" are expected to parse successfully
            'y' => assert!(
                parse_result.is_ok(),
                "FAILED: {} - should be 'ok' but got: {}",
                test_name,
                parse_result.unwrap_err()
            ),
            // Spec-files that start with "n" are expected to fail to parse
            'n' => assert!(
                parse_result.is_err(),
                "FAILED: {} - should be 'error' but got: 'ok'",
                test_name
            ),
            _ => panic!("Unexpected starting char"),
        }

        println!("PASS\n---")
    }

    return Ok(());
}
