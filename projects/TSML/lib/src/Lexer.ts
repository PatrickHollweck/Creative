import { Lexer_T } from "./LexerToken";

export class Lexer {
	private tokens: Lexer_T.Token[];

	constructor(private source: string) {
		this.tokens = [];
	}

	static tokenize(source: string) {
		return new Lexer(source).lex();
	}

	lex() {
		for (const currentChar of this.source) {
			switch (currentChar) {
				case "%":
					this.addToken(new Lexer_T.Types.TagDeclaration());
					break;
				case "\n":
					this.addToken(new Lexer_T.Types.Newline());
					break;
				case "\t":
				case " ":
					this.addToken(new Lexer_T.Types.Whitespace());
					break;
				default:
					this.addToken(new Lexer_T.Types.Text(currentChar));
			}
		}

		this.addToken(new Lexer_T.Types.EndOfFile());
		return this.tokens;
	}

	addToken(token: Lexer_T.Token) {
		this.tokens.push(token);
	}

	throwUserError(message: string) {
		throw new Error(`PARSER :: USER_ERROR :: ${message}`);
	}
}
