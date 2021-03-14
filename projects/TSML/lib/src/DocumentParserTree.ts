import { BaseToken } from "./BaseToken";
import { Lexer_T } from "./LexerToken";
import { Parser_T } from "./ParserToken";

export type AnyTokenKind = Lexer_T.TokenKind | Parser_T.TokenKind;

export class DocumentParserTree {
	public root: XmlNode;

	constructor() {
		this.root = XmlNode.makeRoot();
	}
}

export abstract class Node<TNode extends Node<TNode>> {
	public children: TNode[];

	protected index: number;
	protected parent: TNode;

	protected constructor(index: number, parent: TNode) {
		this.children = [];

		this.index = index;
		this.parent = parent;
	}

	up() {
		return this.parent;
	}

	left() {
		return this.parent.children[this.index - 1];
	}

	right() {
		return this.parent.children[this.index + 1];
	}

	abstract down(...node: TNode[]): void;
}

export class XmlNode extends Node<XmlNode> {
	public syntaxTree: SyntaxNode;

	constructor() {
		super(-1, null as any);

		this.syntaxTree = SyntaxNode.makeRoot(null as any);
	}

	static makeRoot(): XmlNode {
		const node = new XmlNode();
		node.parent = node;

		return node;
	}

	down(...nodes: XmlNode[]): void {
		for (const node of nodes) {
			node.parent = this;
			node.index = this.children.length;

			this.children.push(node);
		}
	}
}

export class SyntaxNode extends Node<SyntaxNode> {
	public token: BaseToken<AnyTokenKind>;

	constructor(token: BaseToken<AnyTokenKind>) {
		super(-1, null as any);
		this.token = token;
	}

	static makeRoot(token: BaseToken<AnyTokenKind>) {
		return new SyntaxNode(token);
	}

	down(...nodes: SyntaxNode[]): void {
		for (const node of nodes) {
			node.index = this.children.length;
			node.parent = this;

			this.children.push(node);
		}
	}
}
