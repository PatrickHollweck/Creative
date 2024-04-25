mod libjson;

pub use crate::libjson::*;

#[test]
fn test_lexer() {
    let source = "{ \"name\": 1 }".to_string();

    assert_eq!(
        lex(source),
        Ok(vec![
            Token::ObjectOpen,
            Token::String {
                value: "name".to_string()
            },
            Token::Colon,
            Token::Number {
                value: "1".to_string()
            },
            Token::ObjectClose
        ])
    );
}
