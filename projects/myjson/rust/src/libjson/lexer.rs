use super::token::Token;

pub fn lex(source: String) -> Result<Vec<Token>, String> {
    let mut cursor = 0;
    let mut tokens = Vec::new();

    let chars = source.chars().collect::<Vec<char>>();

    let mut lexers = vec![
        match_punctuation,
        match_string,
        match_bool,
        match_null,
        match_number,
    ];

    while cursor < source.len() {
        let current = chars[cursor];

        if current == ' ' || current == '\t' || current == '\n' || current == '\r' {
            cursor += 1;
            continue;
        }

        let mut did_match = false;

        for lexer in &mut lexers[..] {
            if lexer(&chars, &mut cursor, &mut tokens)? {
                did_match = true;
                break;
            }
        }

        if !did_match {
            return Err(format!("Unknown token! (Position: {})", cursor).to_string());
        }
    }

    return Ok(tokens);
}

fn match_number(
    source: &Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> Result<bool, String> {
    let mut internal_cursor = *cursor;

    if source[internal_cursor] == '-' {
        internal_cursor += 1;

        if !is_digit(source, internal_cursor) {
            return Err("Invalid lonely minus sign".to_string());
        }
    }

    if !is_digit(source, internal_cursor) {
        return Ok(false);
    }

    let (int_has_leading_zero, int_digits) = skip_digits(source, internal_cursor)?;

    internal_cursor += int_digits;

    if int_has_leading_zero && int_digits > 1 {
        return Err("Invalid number! (No leading zero on fractions allowed!)".to_string());
    }

    // Parse optional fraction part
    if internal_cursor < source.len() && source[internal_cursor] == '.' {
        internal_cursor += 1;
        internal_cursor += skip_digits(source, internal_cursor)?.1;
    }

    // Parse optional exponent part
    if internal_cursor < source.len()
        && (source[internal_cursor] == 'e' || source[internal_cursor] == 'E')
    {
        internal_cursor += 1;

        if internal_cursor < source.len() && source[internal_cursor] == '+'
            || source[internal_cursor] == '-'
        {
            internal_cursor += 1;
        }

        internal_cursor += skip_digits(source, internal_cursor)?.1;
    }

    tokens.push(Token::Number {
        value: source[*cursor..internal_cursor].iter().collect::<String>(),
    });

    *cursor = internal_cursor;

    return Ok(true);
}

fn match_string(
    source: &Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> Result<bool, String> {
    if source[*cursor] == '"' {
        let mut end = *cursor + 1;

        while end < source.len() && source[end] != '"' && source[end - 1] != '\\' {
            end += 1;
        }

        tokens.push(Token::String {
            value: source[*cursor + 1..end].iter().collect::<String>(),
        });

        *cursor = end + 1;

        return Ok(true);
    }

    return Ok(false);
}

fn match_bool(
    source: &Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> Result<bool, String> {
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
    source: &Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> Result<bool, String> {
    if lookahead(&source, *cursor, "null") {
        tokens.push(Token::Null);
        *cursor += 4;

        return Ok(true);
    }

    return Ok(false);
}

fn match_punctuation(
    source: &Vec<char>,
    cursor: &mut usize,
    tokens: &mut Vec<Token>,
) -> Result<bool, String> {
    let current = source[*cursor];

    if current == ':' {
        tokens.push(Token::Colon);
        *cursor += 1;

        return Ok(true);
    }

    if current == ',' {
        tokens.push(Token::Comma);
        *cursor += 1;

        return Ok(true);
    }

    if current == '{' {
        tokens.push(Token::ObjectOpen);
        *cursor += 1;

        return Ok(true);
    }

    if current == '}' {
        tokens.push(Token::ObjectClose);
        *cursor += 1;

        return Ok(true);
    }

    if current == '[' {
        tokens.push(Token::ArrayOpen);
        *cursor += 1;

        return Ok(true);
    }

    if current == ']' {
        tokens.push(Token::ArrayClose);
        *cursor += 1;

        return Ok(true);
    }

    return Ok(false);
}

fn is_digit(source: &Vec<char>, position: usize) -> bool {
    let current = source[position];

    return current == '0'
        || current == '1'
        || current == '2'
        || current == '3'
        || current == '4'
        || current == '5'
        || current == '6'
        || current == '7'
        || current == '8'
        || current == '9';
}

fn lookahead(source: &Vec<char>, cursor: usize, search: &str) -> bool {
    let end = cursor + search.len();

    if end > source.len() {
        return false;
    }

    return source[cursor..end].iter().collect::<String>() == search;
}

fn skip_digits(source: &Vec<char>, cursor: usize) -> Result<(bool, usize), String> {
    let mut internal_cursor = cursor;
    let mut has_leading_zero = false;

    if source[internal_cursor] == '0' {
        has_leading_zero = true;
    }

    while internal_cursor < source.len() {
        if is_digit(source, internal_cursor) {
            internal_cursor += 1;
        } else {
            break;
        }
    }

    let total_digits_matched = internal_cursor - cursor;

    if total_digits_matched == 0 {
        return Err("Invalid number! (Expected at least one digit as this location!)".to_string());
    }

    return Ok((has_leading_zero, total_digits_matched));
}
