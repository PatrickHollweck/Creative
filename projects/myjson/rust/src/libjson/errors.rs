use std::{
    collections::LinkedList,
    fmt::{self, Debug},
};

use super::lexer::Token;

#[derive(Debug, PartialEq)]
pub struct JsonError {
    pub message: String,
    pub source: String,
    pub column: usize,
}

impl JsonError {
    pub fn new(message: &str, source: String, column: usize) -> Self {
        Self {
            message: message.to_string(),
            source,
            column,
        }
    }

    pub fn new_from_char_vec(message: &str, source: &Vec<char>, column: usize) -> Self {
        return JsonError::new(message, source.into_iter().collect(), column);
    }

    pub fn new_from_tokens(
        message: &str,
        tokens: &LinkedList<Token>,
        column: Option<usize>,
    ) -> Self {
        return JsonError::new(
            message,
            tokens.iter().map(|token| token.to_string()).collect(),
            column.unwrap_or(0 as usize),
        );
    }
}

impl fmt::Display for JsonError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        return write!(
            f,
            "Failed to parse JSON - {} - Column: {}\nSource at the location of the error:\n{}\n{}^",
            self.message,
            self.column,
            self.source,
            "-".repeat(if self.column <= 0 { 0 } else { self.column - 1 })
        );
    }
}
