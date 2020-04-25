import { SyntaxTreeNode, BinaryOperation } from "./Parser";
import { TokenKind, TokenFactory } from "./Lexer";

export function evaluate(ast: SyntaxTreeNode) {
	ast.children = ast.children.map(child => {
		if (child instanceof BinaryOperation) {
			return evaluateBinaryExpression(child);
		}

		return child;
	});

	console.log(ast);
	return (ast.children[0] as any).value;
}

function evaluateBinaryExpression(op: BinaryOperation) {
	const left = Number(op.left.value);
	const right = Number(op.right.value);

	switch (op.operator.kind) {
		case TokenKind.Plus:
			return TokenFactory.number((left + right).toString());
		default:
			throw new Error(
				"Unknown Operator in Binary expression: " + op.operator.kind
			);
	}
}
