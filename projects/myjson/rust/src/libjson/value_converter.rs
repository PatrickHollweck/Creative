use super::{parser::Node, JsonError};

pub fn create_json_access(_node: Node) -> Result<(), JsonError> {
    // TODO: Implement a data-structure to nicely access the data in nodes.
    // Maybe a get_by_path("people.0.name") function?

    todo!();
}
