use super::super::*;
use std::{fs, panic};

const TESTS_TO_SKIP: &'static [&str] = &[
    // Category: Escape-Sequences
    "n_string_escape_x.json",
    "y_string_null_escape.json",
    "n_string_backslash_00.json",
    "y_string_double_escape_n.json",
    "n_string_unescaped_newline.json",
    "n_string_unescaped_ctrl_char.json",
    "n_string_invalid_backslash_esc.json",
    "n_string_escaped_ctrl_char_tab.json",
    "n_string_invalid_utf8_after_escape.json",
    "n_string_incomplete_escaped_character.json",
    // Category: Unicode
    "y_string_pi.json",
    "y_string_utf8.json",
    "y_string_unicode_2.json",
    "n_string_escaped_emoji.json",
    "y_string_u+2029_par_sep.json",
    "y_string_u+2028_line_sep.json",
    "n_string_unicode_CapitalU.json",
    "y_string_three-byte-utf-8.json",
    "n_string_incomplete_escape.json",
    "n_string_incomplete_surrogate.json",
    "y_string_unicode_U+FDD0_nonchar.json",
    "n_string_invalid_unicode_escape.json",
    "n_string_invalid-utf-8-in-escape.json",
    "y_string_unicode_U+10FFFE_nonchar.json",
    "n_string_1_surrogate_then_escape_u.json",
    "n_string_1_surrogate_then_escape_u1.json",
    "y_string_nonCharacterInUTF-8_U+FFFF.json",
    "n_string_1_surrogate_then_escape_u1x.json",
    "y_string_nonCharacterInUTF-8_U+10FFFF.json",
    "y_string_unicode_U+200B_ZERO_WIDTH_SPACE.json",
    "y_string_reservedCharacterInUTF-8_U+1BFFF.json",
    "n_string_incomplete_surrogate_escape_invalid.json",
    "y_string_accepted_surrogate_pairs.json",
    "y_string_last_surrogates_1_and_2.json",
    "y_string_accepted_surrogate_pair.json",
    "y_string_double_escape_a.json",
    "y_string_unicode_U+1FFFE_nonchar.json",
    "y_string_surrogates_U+1D11E_MUSICAL_SYMBOL_G_CLEF.json",
    "n_object_lone_continuation_byte_in_key_and_trailing_comma.json",
];

// README!
// If you want to run a single specific test case, paste the file_name into this array.
// If this array is being left empty, it will include all tests that are not skipped above!
const TESTS_TO_INCLUDE: &'static [&str] = &[];

// NOTE!
// Use the following command to run these tests (on linux...)
// $ clear && RUST_BACKTRACE=1 RUST_MIN_STACK=1000000000 cargo test -- --nocapture

#[test]
fn test_suite() -> Result<(), Box<dyn std::error::Error>> {
    let suite_files_to_test = fs::read_dir("./../common/test_suite/spec")
        .unwrap()
        .map(|entry| entry.unwrap())
        .filter(|file_path_entry| {
            let file_name = file_path_entry.file_name().into_string().unwrap();

            return !TESTS_TO_SKIP.contains(&&file_name.as_str())
                && !file_name.starts_with("i")
                && (TESTS_TO_INCLUDE.is_empty() || TESTS_TO_INCLUDE.contains(&file_name.as_str()));
        })
        .map(|file_path| {
            let content = fs::read(file_path.path()).unwrap();
            let source = std::string::String::from_utf8_lossy(&content[..]).into_owned();

            return (file_path.file_name().into_string().unwrap(), source);
        });

    for (test_name, source) in suite_files_to_test {
        println!("RUNNING: {}", test_name);

        let parse_result = parse_json(source);

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
