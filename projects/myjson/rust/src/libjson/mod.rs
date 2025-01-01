mod errors;
mod lexer;
mod parser;
mod value_converter;

use lexer::*;
use parser::*;
use value_converter::*;

pub use errors::*;

pub struct Json {}

impl Json {
    pub fn deserialize(source: String) -> Result<(), JsonError> {
        return create_json_access(Json::parse(source)?);
    }

    pub fn parse(source: String) -> Result<Node, JsonError> {
        return parse(Json::lex(source)?);
    }

    pub fn lex(source: String) -> Result<Vec<Token>, JsonError> {
        return lex(source);
    }
}
