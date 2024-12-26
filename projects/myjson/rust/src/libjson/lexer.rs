use super::{
    errors::JsonError,
    token::Token,
    unicode::{is_high_surrogate, is_low_surrogate},
};

type LexerReturnType = Result<bool, JsonError>;
type LexerFunction =
    fn(source: &mut Vec<char>, cursor: &mut usize, tokens: &mut Vec<Token>) -> LexerReturnType;

const UNICODE_CHAR_FORMFEED: char = '\u{12}';
const UNICODE_CHAR_BACKSPACE: char = '\u{8}';

const LEXER_FUNCTIONS: [LexerFunction; 5] = [
    match_punctuation,
    match_string,
    match_bool,
    match_null,
    match_number,
];

pub fn lex(source: String) -> Result<Vec<Token>, JsonError> {
    println!("LEXING: {}", source);

    let mut cursor = 0;
    let mut tokens = Vec::new();

    let mut chars = source.chars().collect::<Vec<char>>();

    while cursor < chars.len() {
        let current = chars[cursor];

        if current == ' ' || current == '\t' || current == '\n' || current == '\r' {
            cursor += 1;
            continue;
        }

        let mut did_match = false;

        for lexer in LEXER_FUNCTIONS {
            if lexer(&mut chars, &mut cursor, &mut tokens)? {
                did_match = true;
                break;
            }
        }

        if !did_match {
            return Err(JsonError::new("Unknown token!", source, cursor));
        }
    }

    return Ok(tokens);
}

fn match_number(
    source: &mut Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> LexerReturnType {
    let mut internal_cursor = *cursor;

    // Parse optional sign of the number | -10
    // Spec-Note: Positive signs are assumed and their explicit mention not allowed.
    if source[internal_cursor] == '-' {
        internal_cursor += 1;

        if !source[internal_cursor].is_ascii_digit() {
            return Err(JsonError::new_from_char_vec(
                "Invalid lonely minus sign",
                source,
                *cursor,
            ));
        }
    }

    if !source[internal_cursor].is_ascii_digit() {
        return Ok(false);
    }

    let match_result = skip_digits(source, internal_cursor)?;

    internal_cursor += match_result.total_digits_matched;

    if match_result.has_leading_zero && match_result.total_digits_matched > 1 {
        return Err(JsonError::new_from_char_vec(
            "Invalid number! (No leading zero on fractions allowed!)",
            source,
            *cursor,
        ));
    }

    // Parse optional fraction part
    if internal_cursor < source.len() && source[internal_cursor] == '.' {
        internal_cursor += 1;
        internal_cursor += skip_digits(source, internal_cursor)?.total_digits_matched;
    }

    // Parse optional exponent part
    if internal_cursor < source.len()
        && (source[internal_cursor] == 'e' || source[internal_cursor] == 'E')
    {
        internal_cursor += 1;

        // Parse optional sign of exponent | 10e-21, 10e+25
        if internal_cursor < source.len() && source[internal_cursor] == '+'
            || source[internal_cursor] == '-'
        {
            internal_cursor += 1;
        }

        internal_cursor += skip_digits(source, internal_cursor)?.total_digits_matched;
    }

    tokens.push(Token::Number {
        value: source[*cursor..internal_cursor].iter().collect::<String>(),
    });

    *cursor = internal_cursor;

    return Ok(true);
}

fn match_string(
    source: &mut Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> LexerReturnType {
    // If current char is not a " it cannot be a string... Skip!
    if source[*cursor] != '"' {
        return Ok(false);
    }

    // Consume the initial opening quote
    let mut end = *cursor + 1;

    // TODO: This solution is ugly
    let mut ignore_next_quote = false;

    loop {
        if end >= source.len() {
            return Err(JsonError::new_from_char_vec(
                "Missing closing quote mark in string",
                source,
                *cursor,
            ));
        }

        match source[end] {
            '"' if !ignore_next_quote => break,
            '\\' => {
                let (escaped, parsed_chars) = process_escape_sequence(source, end)?;

                source.splice(end - 1..end + parsed_chars, [escaped]);

                if escaped == '"' {
                    ignore_next_quote = true;
                }
            }
            '\t' | '\n' | '\r' | UNICODE_CHAR_BACKSPACE | UNICODE_CHAR_FORMFEED => {
                return Err(JsonError::new_from_char_vec(
                    "Invalid characters in string. Control-characters must be escaped!",
                    source,
                    end,
                ))
            }
            _ => {
                end += 1;
                ignore_next_quote = false;
            }
        }
    }

    tokens.push(Token::String {
        value: source[*cursor + 1..end].iter().collect::<String>(),
    });

    *cursor = end + 1;

    return Ok(true);
}

fn process_escape_sequence(source: &Vec<char>, cursor: usize) -> Result<(char, usize), JsonError> {
    let source_len = source.len();

    if source_len <= cursor + 1 {
        return Err(JsonError::new_from_char_vec(
            "Unexpected end of escape-sequence",
            source,
            cursor,
        ));
    }

    let escape_type = source[cursor + 1];

    return match escape_type {
        '\\' => Ok(('\\', 1)),
        '"' => Ok(('"', 1)),
        '/' => Ok(('/', 1)),
        'n' => Ok(('\n', 1)),
        'r' => Ok(('\r', 1)),
        't' => Ok(('\t', 1)),
        'f' => Ok((UNICODE_CHAR_FORMFEED, 1)),
        'b' => Ok((UNICODE_CHAR_BACKSPACE, 1)),
        'u' => parse_unicode_sequence(source, cursor),
        _ => Err(JsonError::new_from_char_vec(
            "Invalid escape character",
            source,
            cursor,
        )),
    };
}

fn parse_unicode_sequence(source: &Vec<char>, cursor: usize) -> Result<(char, usize), JsonError> {
    if source.len() <= cursor + 5 {
        return Err(JsonError::new_from_char_vec(
            "Invalid length of escape sequence",
            source,
            cursor,
        ));
    }

    let unicode_offset = parse_unicode_offset(source, cursor)?;

    // TODO: Implement surrogate parsing!

    // Try to parse as utf-8 char
    if let Some(unicode_character) = char::from_u32(unicode_offset) {
        return Ok((unicode_character, 5));
    } else {
        return Err(JsonError::new_from_char_vec(
            "Invalid unicode hex",
            source,
            cursor,
        ));
    }
}

fn parse_unicode_offset(source: &Vec<char>, cursor: usize) -> Result<u32, JsonError> {
    let unicode_offset_digits = &source[cursor + 2..cursor + 6];

    for offset_digit in unicode_offset_digits {
        if !offset_digit.is_ascii_hexdigit() {
            return Err(JsonError::new_from_char_vec(
                "Invalid hex-digit in unicode escape sequence",
                source,
                cursor,
            ));
        }
    }

    // TODO: Optimize this! Parse and add each char individually?
    let offset = u32::from_str_radix(
        std::string::String::from(unicode_offset_digits.iter().collect::<String>()).as_str(),
        16,
    );

    // TODO: Handle error here
    return Ok(offset.unwrap());
}

fn match_bool(
    source: &mut Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> LexerReturnType {
    if lookahead(&source, *cursor, "true") {
        tokens.push(Token::Boolean { value: true });
        *cursor += 4;

        return Ok(true);
    }

    if lookahead(&source, *cursor, "false") {
        tokens.push(Token::Boolean { value: false });
        *cursor += 5;

        return Ok(true);
    }

    return Ok(false);
}

fn match_null(
    source: &mut Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> LexerReturnType {
    if lookahead(&source, *cursor, "null") {
        tokens.push(Token::Null);
        *cursor += 4;

        return Ok(true);
    }

    return Ok(false);
}

fn match_punctuation(
    source: &mut Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> LexerReturnType {
    let current = source[*cursor];

    let mut push_token = |token: Token| -> Result<bool, JsonError> {
        tokens.push(token);
        *cursor += 1;

        return Ok(true);
    };

    return match current {
        ':' => push_token(Token::Colon),
        ',' => push_token(Token::Comma),
        '{' => push_token(Token::ObjectOpen),
        '}' => push_token(Token::ObjectClose),
        '[' => push_token(Token::ArrayOpen),
        ']' => push_token(Token::ArrayClose),
        _ => Ok(false),
    };
}

fn lookahead(source: &Vec<char>, cursor: usize, search: &str) -> bool {
    let end = cursor + search.len();

    if end > source.len() {
        return false;
    }

    return source[cursor..end].iter().collect::<String>() == search;
}

struct SkipDigitsResult {
    has_leading_zero: bool,
    total_digits_matched: usize,
}

fn skip_digits(source: &Vec<char>, cursor: usize) -> Result<SkipDigitsResult, JsonError> {
    let mut internal_cursor = cursor;
    let mut has_leading_zero = false;

    if source[internal_cursor] == '0' {
        has_leading_zero = true;
    }

    while internal_cursor < source.len() {
        if source[internal_cursor].is_ascii_digit() {
            internal_cursor += 1;
        } else {
            break;
        }
    }

    let total_digits_matched = internal_cursor - cursor;

    if total_digits_matched == 0 {
        return Err(JsonError::new_from_char_vec(
            "Invalid number! (Expected at least one digit as this location!)",
            source,
            cursor,
        ));
    }

    return Ok(SkipDigitsResult {
        has_leading_zero,
        total_digits_matched,
    });
}
