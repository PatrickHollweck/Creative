use std::collections::*;

#[derive(Debug, PartialEq)]
pub enum Node {
    Array(Box<Vec<Node>>),
    Object(Box<HashMap<String, Node>>),
    // Scalars
    Null,
    Number(String),
    String(String),
    Boolean(bool),
}

impl Node {
    pub fn make_array(entries: Vec<Node>) -> Node {
        return Node::Array(Box::new(entries));
    }

    pub fn make_object(entries: HashMap<String, Node>) -> Node {
        return Node::Object(Box::new(entries));
    }

    pub fn make_object_from_entries(entries: Vec<(String, Node)>) -> Node {
        let mut map = HashMap::new();

        entries.into_iter().for_each(|entry| {
            map.insert(entry.0, entry.1);
        });

        return Node::make_object(map);
    }
}
