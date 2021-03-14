import { SyntaxNode } from "./DocumentParserTree";

export abstract class BaseToken<TokenKind> {
	public readonly kind: TokenKind;

	toNode(): SyntaxNode {
		return new SyntaxNode(this as any);
	}

	constructor(kind: TokenKind) {
		this.kind = kind;
	}
}
