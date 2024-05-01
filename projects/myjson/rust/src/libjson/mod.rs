mod lexer;
mod node;
mod parser;
mod token;

pub use lexer::*;
pub use node::*;
pub use parser::*;
pub use token::*;

pub fn parse_json(source: String) -> Result<Node, String> {
    let mut tokens = lex(source)?;
    let ast = parse(&mut tokens);

    ast
}
