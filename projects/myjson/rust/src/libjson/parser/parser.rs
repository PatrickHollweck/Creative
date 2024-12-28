use std::borrow::Borrow;
use std::collections::LinkedList;
use std::{borrow::BorrowMut, collections::HashMap};

use super::{super::lexer::Token, super::JsonError, node::Node};

pub fn parse(tokens: Vec<Token>) -> Result<Node, JsonError> {
    let mut token_list = LinkedList::from_iter(tokens);
    let root_node = parse_single(token_list.borrow_mut())?;

    if token_list.len() > 0 {
        return Err(JsonError::new_from_tokens(
            "Unexpected tokens at the end of source",
            &token_list,
            None,
        ));
    }

    return Ok(root_node);
}

fn parse_single(tokens: &mut LinkedList<Token>) -> Result<Node, JsonError> {
    let initial_token = tokens
        .pop_front()
        .ok_or_else(|| JsonError::new_from_tokens("Unexpected end of source!", tokens, None))?;

    return match initial_token {
        // Compound types
        Token::ObjectOpen => parse_object(tokens),
        Token::ArrayOpen => parse_array(tokens),
        // Scalars
        Token::Null => Ok(Node::Null),
        Token::String { value } => Ok(Node::String(value.clone())),
        Token::Number { value } => Ok(Node::Number(value.clone())),
        Token::Boolean { value } => Ok(Node::Boolean(value.clone())),
        // Default case
        _ => Err(JsonError::new_from_tokens(
            format!(
                "Could not parse this token at this location! (Token was: {:?})",
                initial_token,
            )
            .borrow(),
            tokens,
            None,
        )),
    };
}

fn parse_array(tokens: &mut LinkedList<Token>) -> Result<Node, JsonError> {
    let next_token = tokens
        .front()
        .ok_or_else(|| JsonError::new_from_tokens("Unexpected end of array", tokens, None))?;

    let mut content: Vec<Node> = vec![];

    // Empty array check
    if let Token::ArrayClose = next_token {
        tokens.pop_front();

        return Ok(Node::Array(Box::new(content)));
    }

    loop {
        content.push(parse_single(tokens)?);

        let next_token = tokens
            .pop_front()
            .ok_or_else(|| JsonError::new_from_tokens("Unexpected end of array", tokens, None))?;

        match next_token {
            Token::Comma => continue,
            Token::ArrayClose => return Ok(Node::Array(Box::new(content))),
            _ => {
                return Err(JsonError::new_from_tokens(
                    "Unexpected token in array!",
                    tokens,
                    None,
                ))
            }
        }
    }
}

fn parse_object(tokens: &mut LinkedList<Token>) -> Result<Node, JsonError> {
    let mut content = HashMap::new();

    if let Token::ObjectClose = tokens
        .front()
        .ok_or_else(|| JsonError::new_from_tokens("Unexpected end of object", tokens, None))?
    {
        tokens.pop_front();

        return Ok(Node::make_object(content));
    }

    loop {
        let (key, value) = parse_object_entry(tokens)?;

        content.insert(key, value);

        let next_token = tokens
            .pop_front()
            .ok_or_else(|| JsonError::new_from_tokens("Unexpected end of object", tokens, None))?;

        match next_token {
            Token::Comma => continue,
            Token::ObjectClose => return Ok(Node::Object(Box::new(content))),
            _ => {
                return Err(JsonError::new_from_tokens(
                    "Unexpected token in object!",
                    tokens,
                    None,
                ))
            }
        }
    }
}

fn parse_object_entry(tokens: &mut LinkedList<Token>) -> Result<(String, Node), JsonError> {
    let key_token = tokens.pop_front().ok_or_else(|| {
        JsonError::new_from_tokens("Expected a string as the object key", tokens, None)
    })?;

    let separator_token = tokens.pop_front().ok_or_else(|| {
        JsonError::new_from_tokens("Expected colon after object key", tokens, None)
    })?;

    return match (key_token, separator_token) {
        (Token::String { value }, Token::Colon) => Ok((value, parse_single(tokens)?)),
        _ => Err(JsonError::new_from_tokens(
            "Unexpected token used as object key",
            tokens,
            None,
        )),
    };
}
