import { Token, TokenKind } from "./Lexer";

// ------- Base Types

export abstract class SyntaxTreeNode {
	public children: SyntaxTreeNode[];

	constructor() {
		this.children = [];
	}
}

export abstract class Expression<T> extends SyntaxTreeNode {
	constructor() {
		super();
	}

	abstract evaluate(): Value;
}

// ------- SyntaxTree

export class SyntaxTree extends SyntaxTreeNode {}

// ------- Literals

export class Literal<T> extends Expression<T> {
	public value: T;

	constructor(value: T) {
		super();

		this.value = value;
	}

	public evaluate() {
		return this.value;
	}
}

export class NumberLiteral extends Literal<number> {}

// ------- Operations

export abstract class BinaryOperation<T> extends Expression<T> {
	public right: Token;
	public left: Token;
	public operator: Token;

	constructor(left: Expression, operator: Token, right: Expression) {
		super();

		this.left = left;
		this.right = right;
		this.operator = operator;
	}
}

class AddExpression extends BinaryOperation<number> {
	evaluate(): number {}
}

// -------

export function parse(tokens: Token[]) {
	const ast = new SyntaxTree();

	while (tokens.length > 0) {
		if (
			tokens.length >= 2 &&
			tokens[0].kind === TokenKind.Number &&
			tokens[1].kind === TokenKind.Plus &&
			tokens[2].kind === TokenKind.Number
		) {
			ast.children.push(
				new BinaryOperation(tokens[0], tokens[1], tokens[2])
			);

			tokens.splice(0, 3);
			continue;
		}

		throw new Error("Cannot parse tokens" + tokens);
	}

	return ast;
}
