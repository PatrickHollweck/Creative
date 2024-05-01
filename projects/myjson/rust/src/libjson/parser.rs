use std::borrow::BorrowMut;

use crate::{Node, Token};

pub fn parse(tokens: &mut Vec<Token>) -> Result<Node, String> {
    tokens.reverse();

    let root_node = parse_single(tokens.borrow_mut());

    if tokens.len() > 0 {
        return Err("Unexpected tokens at the end of source".to_string());
    }

    return root_node;
}

fn parse_single(tokens: &mut Vec<Token>) -> Result<Node, String> {
    let initial_token = tokens.pop().ok_or("Unexpected end of source!")?;

    match initial_token {
        Token::ObjectOpen => todo!(),
        Token::ArrayOpen => todo!(),
        Token::Null => Ok(Node::Null),
        Token::String { value } => Ok(Node::String(value.clone())),
        Token::Number { value } => Ok(Node::Number(value.clone())),
        Token::Boolean { value } => Ok(Node::Boolean(value)),
        _ => Err("Could not parse this token at this location!".to_string()),
    }
}
