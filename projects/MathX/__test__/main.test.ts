import { parse, SyntaxTreeNode, BinaryOperation } from "../src/Parser";
import { lex, TokenFactory } from "../src/Lexer";
import { evaluate } from "../src/Evaluator";

test("Lex '14+2'", () => {
	const tokens = lex("14+2");

	expect(tokens).toEqual([
		TokenFactory.number("14"),
		TokenFactory.plus(),
		TokenFactory.number("2")
	]);
});

test("Parse '14+2'", () => {
	const tokens = lex("14+2");
	const ast = parse(tokens);

	const expectedAst = new SyntaxTreeNode();

	expectedAst.children.push(
		new BinaryOperation(
			TokenFactory.number("14"),
			TokenFactory.plus(),
			TokenFactory.number("2")
		)
	);

	expect(ast).toEqual(expectedAst);
});

test("Evaluate '14+2'", () => {
	const tokens = lex("14+2");
	const ast = parse(tokens);
	const result = evaluate(ast);

	expect(result).toEqual("16");
});
