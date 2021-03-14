import { Lexer_T } from "./LexerToken";

export class TokenStream<Token> {
	private tokens: Token[];
	private previousTokens: Token[];

	constructor(tokens: Token[]) {
		this.tokens = tokens;
		this.previousTokens = [];
	}

	lookahead(index: number) {
		return this.tokens[index - 1];
	}

	lookback(index: number) {
		return this.previousTokens[this.previousTokens.length - index];
	}

	peek() {
		return this.tokens[0];
	}

	advance() {
		const shifted = this.tokens.shift()!!;
		this.previousTokens.push(shifted);
		return shifted;
	}

	hasNext() {
		return this.tokens.length > 0;
	}

	defer(token: Token) {
		this.tokens.unshift(token);
	}
}
