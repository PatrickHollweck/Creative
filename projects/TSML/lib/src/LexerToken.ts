import { BaseToken } from "./BaseToken";

export namespace Lexer_T {
	export enum TokenKind {
		TagDeclaration = "TagDeclaration",
		Text = "Text",
		Whitespace = "Whitespace",
		Newline = "Newline",
		EndOfFile = "EndOfFile"
	}

	export class Token extends BaseToken<TokenKind> {}

	export namespace Types {
		export class TagDeclaration extends Token {
			constructor() {
				super(TokenKind.TagDeclaration);
			}
		}

		export class Text extends Token {
			public readonly value: string;

			constructor(value: string) {
				super(TokenKind.Text);
				this.value = value;
			}
		}

		export class Whitespace extends Token {
			constructor() {
				super(TokenKind.Whitespace);
			}
		}

		export class Newline extends Token {
			constructor() {
				super(TokenKind.Newline);
			}
		}

		export class EndOfFile extends Token {
			constructor() {
				super(TokenKind.EndOfFile);
			}
		}
	}
}
