import { Lexer } from "../../src/Lexer";
import { Parser } from "../../src/Parser";
import { Lexer_T } from "../../src/LexerToken";
import { Parser_T } from "../../src/ParserToken";
import { DocumentParserTree, XmlNode } from "../../src/DocumentParserTree";

describe("The Parser", () => {
	it(`should parse "%h1 Hello World"`, () => {
		const tokens = Lexer.tokenize(`%h1 Hello World`);
		const ast = Parser.makeAST(tokens);

		const expectedAst = new DocumentParserTree();

		const h1Tag = new XmlNode();
		h1Tag.syntaxTree.down(
			new Parser_T.Types.TagStart("h1").toNode(),
			new Lexer_T.Types.Text("Hello World").toNode(),
			new Parser_T.Types.TagEnd("h1").toNode()
		);

		expectedAst.root.down(h1Tag);

		expect(ast).toEqual(expectedAst);
	});
});
