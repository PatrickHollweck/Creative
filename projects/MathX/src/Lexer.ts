export enum TokenKind {
	Number,
	Plus
}

export class Token {
	public kind: TokenKind;
	public value?: string;

	constructor(kind: TokenKind, value?: string) {
		this.kind = kind;
		this.value = value;
	}
}

export class TokenFactory {
	public static number(value: string) {
		return new Token(TokenKind.Number, value);
	}

	public static plus() {
		return new Token(TokenKind.Plus);
	}
}

export function isWhitespace(input: string) {
	return /\s/.test(input);
}

export function lex(source: string) {
	const tokens = new Array<Token>();

	const numberRegex = /\d+/;

	while (source.length > 0) {
		if (isWhitespace(source[0])) {
			source = source.trim();
			continue;
		}

		if (numberRegex.test(source)) {
			const result = numberRegex.exec(source);
			const parsedNumber = result[0];

			tokens.push(new Token(TokenKind.Number, parsedNumber));
			source = source.substring(parsedNumber.length);
		}

		if (source[0] === "+") {
			tokens.push(new Token(TokenKind.Plus));
			source = source.substring(1);
		}
	}

	return tokens;
}
