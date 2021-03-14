import { DocumentParserTree, XmlNode } from "./DocumentParserTree";
import { TokenStream } from "./TokenStream";
import { equalsAnyOf } from "./util";
import { Parser_T } from "./ParserToken";
import { Lexer_T } from "./LexerToken";

export class Parser {
	private stream: TokenStream<Lexer_T.Token>;
	private ast: DocumentParserTree;

	constructor(tokens: Lexer_T.Token[]) {
		this.stream = new TokenStream(tokens);
		this.ast = new DocumentParserTree();
	}

	static makeAST(tokens: Lexer_T.Token[]) {
		return new Parser(tokens).parse();
	}

	parse() {
		const context = {
			astRoot: this.ast.root,
			indent: {
				current: 0,
				previous: 0
			},
			// TODO: Remove this concept of a line. Will make it easier to later implement multi-line stuff.
			line: {
				number: 0,
				tagName: "",
				hasTagDeclaration: false
			},
			reset() {
				// Add end tag to syntax tree.
				context.astRoot.syntaxTree.down(
					new Parser_T.Types.TagEnd(context.line.tagName).toNode()
				);

				// Reset state
				this.line.number++;

				this.indent.previous = this.indent.current;
				this.indent.current = 0;

				this.line.tagName = "";

				this.line.hasTagDeclaration = false;
			}
		};

		while (this.stream.hasNext()) {
			const currentToken = this.stream.advance()!!;

			switch (currentToken.kind) {
				case Lexer_T.TokenKind.TagDeclaration:
					context.line.hasTagDeclaration = true;

					// Add the new xml tag.
					context.astRoot.down(new XmlNode());
					context.astRoot = context.astRoot.children[0];

					if (this.stream.lookahead(1).kind !== Lexer_T.TokenKind.Text) {
						throw this.makeUserError(`A tag declaration must be followed by text!`);
					}

					const tagName = this.buildString(Lexer_T.TokenKind.Whitespace);

					if (!tagName) {
						throw this.makeUserError(
							"Could not build the tag name after a tag declaration!"
						);
					}

					// Add the tag name to the xml root node.
					context.astRoot.syntaxTree.down(new Parser_T.Types.TagStart(tagName).toNode());
					// Update context ( this value is later used to add the end tag! )
					context.line.tagName = tagName;
					break;
				case Lexer_T.TokenKind.Text:
					// Go back one token. Since otherwise we would skip this ( the "currentToken" ) value.
					this.stream.defer(this.stream.lookback(1));
					// Get the summary of the folowing text.
					const text = this.buildString(Lexer_T.TokenKind.Newline);
					// This should never happen... Hopefully. Basically just here to please the type system.
					if (!text) {
						throw this.makeUserError("Could not build text!");
					}

					// Add the text node.
					context.astRoot.syntaxTree.down(new Lexer_T.Types.Text(text).toNode());
					break;
				case Lexer_T.TokenKind.Newline:
					/**
					 * In TSML all statements are terminated by newlines.
					 * For the moment there is no way to put one tag on multiple lines.
					 *
					 * So we reset the context everytime we get a newline.
					 */
					context.reset();
					break;
				case Lexer_T.TokenKind.Whitespace:
					/**
					 * If Whitespace is on a line that already has a XML Tag declaration, like:
					 *
					 * Example:
					 * %h1 Hello
					 * ---^
					 *
					 * The Whitespace is a "seperator" since it seperates two tokens, duh.
					 * We need this information in the token-stream since we need to respect
					 * whitespace when generating strings. ( @see this.buildString )
					 *
					 * If this Whitespace is before a the tag declaration of a line, like:
					 *
					 * Example:
					 * 			%h1 Hellooo
					 * ^^^^^^^^^-----------
					 *
					 * The Whitespace are counted as indents. Indents are then used to determin the
					 * level of nesting in the xml tree.
					 */
					if (!context.line.hasTagDeclaration) {
						context.indent.current++;
					}
					break;
				case Lexer_T.TokenKind.EndOfFile:
					/**
					 * There may be cases when the context needs to be reset at the end of a file.
					 * Here these edge-cases are handled.
					 *
					 * Example:
					 * "%h1 TEXT"
					 *
					 * In the example above the context will never be reset, because there is no newline.
					 * And thus there will be no end tag.
					 *
					 * In cases like this:
					 *
					 * Example:
					 * "
					 * %h1 TEXT
					 * "
					 *
					 * Is a newline at the end of the file. And thus the context will be reset correctly at
					 * the end of the file. Like it should be.
					 *
					 * We check if the context was already reset. It is reset if the tagname equals a empty string.
					 * If not the context was not reset and we need to reset it, before the file ends.
					 */
					if (context.line.tagName !== "") {
						context.reset();
					}
					break;
				default:
					this.makeUserError(`Can not parse token: "${currentToken.kind}"`);
			}
		}

		return this.ast;
	}

	private buildString(...breakTokens: Lexer_T.TokenKind[]) {
		// Make sure we never parse past the end of the file. -> We always return a string.
		breakTokens.push(Lexer_T.TokenKind.EndOfFile);
		// Init text
		let text = "";

		do {
			const currentToken = this.stream.peek();

			if (equalsAnyOf(currentToken.kind, breakTokens)) {
				return text;
			}

			// TODO: This should be refactored.
			switch (currentToken.kind) {
				case Lexer_T.TokenKind.Text:
					const textNode = currentToken as Lexer_T.Types.Text;
					text += textNode.value;
					break;
				case Lexer_T.TokenKind.Whitespace:
					// TODO: Does not differentiate between space and tab.
					text += " ";
					break;
				case Lexer_T.TokenKind.TagDeclaration:
					text += "%";
					break;
				default:
					throw this.makeUserError(
						`Can not build string for token "${currentToken.kind}"`
					);
			}

			this.stream.advance();
		} while (this.stream.hasNext());
	}

	makeUserError(message: string): never {
		throw new Error(`PARSER :: USER_ERROR :: ${message}`);
	}
}
