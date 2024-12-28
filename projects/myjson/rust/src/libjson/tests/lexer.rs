use crate::{libjson::token::Token, Json};

#[test]
fn test_lexer() {
    let source = "{ \"name\": 1234 }".to_string();

    assert_eq!(
        Json::lex(source),
        Ok(vec![
            Token::ObjectOpen,
            Token::String {
                value: "name".to_string()
            },
            Token::Colon,
            Token::Number {
                value: "1234".to_string()
            },
            Token::ObjectClose
        ])
    );
}
