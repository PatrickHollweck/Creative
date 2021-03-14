import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { HTMLGenerator } from "./HTMLGenerator";

export class TSML {
	static compile(source: string) {
		const tokens = Lexer.tokenize(source);
		// Schemantic validation..
		const ast = Parser.makeAST(tokens);
		// Checking..
		// Evaluating..

		return HTMLGenerator.emit(ast);
	}
}
