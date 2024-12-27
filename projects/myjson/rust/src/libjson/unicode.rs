pub fn is_high_surrogate(value: u32) -> bool {
    return value >= 0xD800 && value <= 0xDBFF;
}

pub fn is_low_surrogate(value: u32) -> bool {
    return value >= 0xDC00 && value <= 0xDFFF;
}
