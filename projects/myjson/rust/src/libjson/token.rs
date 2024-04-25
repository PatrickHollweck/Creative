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
