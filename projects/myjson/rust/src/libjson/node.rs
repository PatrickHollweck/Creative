use std::collections::HashMap;

#[derive(Debug)]
pub enum Node {
    Array(Box<Vec<Node>>),
    Object(Box<HashMap<String, Node>>),
    // Scalars
    Null,
    Number(String),
    String(String),
    Boolean(bool),
}
