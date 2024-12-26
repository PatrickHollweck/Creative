mod errors;
mod lexer;
mod node;
mod parser;
mod token;
mod unicode;

#[cfg(test)]
mod tests;

pub use errors::*;
pub use lexer::*;
pub use node::*;
pub use parser::*;
pub use token::*;

pub fn parse_json(source: String) -> Result<Node, JsonError> {
    let tokens = lex(source)?;

    return parse(tokens);
}
