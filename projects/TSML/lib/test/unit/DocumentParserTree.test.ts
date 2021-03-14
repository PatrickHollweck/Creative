import { DocumentParserTree, XmlNode } from "../../src/DocumentParserTree";
import { Lexer_T } from "../../src/LexerToken";

describe("The SyntaxTree", () => {
	let tree: DocumentParserTree;

	beforeEach(() => {
		tree = new DocumentParserTree();
	});

	it("should start with no children", () => {
		expect(tree.root.children.length).toEqual(0);
	});

	it("should correctly get the upper/parent node", () => {
		expect(tree.root.up()).toEqual(tree.root);
	});

	it("should correctly get the left node", () => {
		const a = new XmlNode("a");
		const b = new XmlNode("b");
		const c = new XmlNode("c");

		tree.root.down(a);
		tree.root.down(b);
		tree.root.down(c);

		expect(tree.root.children[1].left()).toEqual(a);
	});

	it("should correctly get the right node", () => {
		const a = new XmlNode("a");
		const b = new XmlNode("b");
		const c = new XmlNode("c");

		tree.root.down(a);
		tree.root.down(b);
		tree.root.down(c);

		expect(tree.root.children[1].right()).toEqual(c);
	});

	it("should be able to insert child nodes", () => {
		const rootNode = new XmlNode("ROOT_NODE");

		const childA = new Lexer_T.Types.Text("A").toNode();
		rootNode.syntaxTree.down(childA);

		expect(rootNode.syntaxTree.children[0]).toEqual(childA);

		const childB = new Lexer_T.Types.Text("B").toNode();
		rootNode.syntaxTree.children[0].down(childB);

		expect(rootNode.syntaxTree.children[0].children[0]).toEqual(childB);
	});
});
