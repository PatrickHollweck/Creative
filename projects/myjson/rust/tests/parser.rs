use crate::{Json, libjson::parser::Node};

#[test]
fn lone_number() {
    let source = "1".to_string();

    assert_eq!(Json::parse(source).unwrap(), Node::Number("1".to_string()));
}

#[test]
fn lone_bool() {
    let source = "true".to_string();

    assert_eq!(Json::parse(source).unwrap(), Node::Boolean(true));
}

#[test]
fn lone_string() {
    let source = "\"hello-world\"".to_string();

    assert_eq!(
        Json::parse(source).unwrap(),
        Node::String("hello-world".to_string())
    );
}

#[test]
fn array() {
    let source = "[1, true]".to_string();

    assert_eq!(
        Json::parse(source).unwrap(),
        Node::make_array(vec![Node::Number("1".to_string()), Node::Boolean(true)])
    );
}

#[test]
fn object() {
    let source = "{ \"hello\": 123 }".to_string();

    assert_eq!(
        Json::parse(source).unwrap(),
        Node::make_object_from_entries(vec![(
            "hello".to_string(),
            Node::Number("123".to_string())
        )])
    );
}

#[test]
fn complex() {
    let source = "{ \"hello\": [1, 2, 3], \"world\": false }".to_string();

    assert_eq!(
        Json::parse(source).unwrap(),
        Node::make_object_from_entries(vec![
            (
                "hello".to_string(),
                Node::make_array(vec![
                    Node::Number("1".to_string()),
                    Node::Number(2.to_string()),
                    Node::Number(3.to_string()),
                ]),
            ),
            ("world".to_string(), Node::Boolean(false))
        ])
    );
}
