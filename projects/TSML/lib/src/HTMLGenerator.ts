import { DocumentParserTree, XmlNode } from "./DocumentParserTree";
import { Lexer_T } from "./LexerToken";
import { Parser_T } from "./ParserToken";

export class HTMLGenerator {
	private ast: DocumentParserTree;
	private output: string;

	constructor(ast: DocumentParserTree) {
		this.ast = ast;
		this.output = "";
	}

	static emit(ast: DocumentParserTree) {
		return new HTMLGenerator(ast).makeOutput();
	}

	makeOutput() {
		for (const node of this.ast.root.children) {
			this.makeForNode(node);
		}

		return this.output;
	}

	makeForNode(node: XmlNode) {
		for (const syntaxNode of node.syntaxTree.children) {
			const currentSyntax = syntaxNode.token;

			switch (currentSyntax.kind) {
				case Lexer_T.TokenKind.Newline:
					this.render("\n");
					break;
				case Lexer_T.TokenKind.Text:
					const textToken = currentSyntax as Lexer_T.Types.Text;
					this.render(textToken.value);
					break;
				case Lexer_T.TokenKind.Equals:
					break;
				case Lexer_T.TokenKind.Whitespace:
					break;
				case Parser_T.TokenKind.TagStart:
					const tagStartToken = currentSyntax as Parser_T.Types.TagStart;
					this.render(`<${tagStartToken.tagName}>`);
					break;
				case Parser_T.TokenKind.TagEnd:
					const tagEndToken = currentSyntax as Parser_T.Types.TagEnd;
					this.render(`</${tagEndToken.tagName}>`);
					break;
				case Lexer_T.TokenKind.EndOfFile:
					break;
				default:
					throw this.makeUserError(`Could not handle token type : ${currentSyntax.kind}`);
			}
		}
	}

	render(text: string) {
		this.output += text;
	}

	makeUserError(message: string) {
		return new Error(`CodeGen :: USER_ERROR :: ${message}`);
	}
}
