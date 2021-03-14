import { Lexer } from "../../src/Lexer";
import { Lexer_T } from "../../src/LexerToken";

describe("The Lexer", () => {
	it("should always have a end-of-file token at the end", () => {
		expect(Lexer.tokenize("")).toEqual([new Lexer_T.Types.EndOfFile()]);
	});

	it("should tokenize a tag declaration", () => {
		expect(Lexer.tokenize("%")).toEqual([
			new Lexer_T.Types.TagDeclaration(),
			new Lexer_T.Types.EndOfFile()
		]);
	});

	it("should tokenize text", () => {
		expect(Lexer.tokenize("abc")).toEqual([
			new Lexer_T.Types.Text("a"),
			new Lexer_T.Types.Text("b"),
			new Lexer_T.Types.Text("c"),
			new Lexer_T.Types.EndOfFile()
		]);
	});

	it("should tokenize seperators - Whitespace", () => {
		expect(Lexer.tokenize("ab cdef ")).toEqual([
			new Lexer_T.Types.Text("a"),
			new Lexer_T.Types.Text("b"),
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.Text("c"),
			new Lexer_T.Types.Text("d"),
			new Lexer_T.Types.Text("e"),
			new Lexer_T.Types.Text("f"),
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.EndOfFile()
		]);
	});

	it("should treath tabs and spaces equally", () => {
		expect(Lexer.tokenize("\t\t \t  ")).toEqual([
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.Whitespace(),
			new Lexer_T.Types.EndOfFile()
		]);
	});

	it("should tokenize newlines", () => {
		expect(Lexer.tokenize(`\n%h1\n`)).toEqual([
			new Lexer_T.Types.Newline(),
			new Lexer_T.Types.TagDeclaration(),
			new Lexer_T.Types.Text("h"),
			new Lexer_T.Types.Text("1"),
			new Lexer_T.Types.Newline(),
			new Lexer_T.Types.EndOfFile()
		]);
	});
});
