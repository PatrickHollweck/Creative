use core::fmt;

#[derive(PartialEq, Debug)]
pub enum Token {
    // Controls
    Comma,
    Colon,
    // Object
    ObjectOpen,
    ObjectClose,
    // Array
    ArrayOpen,
    ArrayClose,
    // Scalars
    Null,
    String { value: String },
    Number { value: String },
    Boolean { value: bool },
}

impl fmt::Display for Token {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        return match self {
            Token::Comma => write!(f, ","),
            Token::Colon => write!(f, ":"),
            Token::ObjectOpen => write!(f, "{{"),
            Token::ObjectClose => write!(f, "}}"),
            Token::ArrayOpen => write!(f, "["),
            Token::ArrayClose => write!(f, "]"),
            Token::Null => write!(f, "null"),
            Token::String { value } => write!(f, "\"{}\"", value),
            Token::Number { value } => write!(f, "{}", value),
            Token::Boolean { value } => write!(f, "{}", if *value { "true " } else { "false" }),
        };
    }
}
