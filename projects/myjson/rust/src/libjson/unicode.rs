use std::num::ParseIntError;

pub struct Unicode {}

impl Unicode {
    pub fn is_high_surrogate(value: u32) -> bool {
        return value >= 0xD800 && value <= 0xDBFF;
    }

    pub fn is_low_surrogate(value: u32) -> bool {
        return value >= 0xDC00 && value <= 0xDFFF;
    }

    pub fn surrogate_parts_to_chars(high_part: u16, low_part: u16) -> Vec<char> {
        return char::decode_utf16([high_part, low_part])
            .map(|decode_result| decode_result.unwrap_or(char::REPLACEMENT_CHARACTER))
            .collect::<Vec<char>>();
    }

    pub fn chars_to_unicode_offset(offset_chars: &[char]) -> Result<u32, ParseIntError> {
        return u32::from_str_radix(
            String::from(offset_chars.iter().collect::<String>()).as_str(),
            16,
        );
    }
}
