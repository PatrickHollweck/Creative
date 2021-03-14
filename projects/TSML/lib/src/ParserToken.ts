import { BaseToken } from "./BaseToken";

export namespace Parser_T {
	export enum TokenKind {
		TagStart = "TagStart",
		TagEnd = "TagEnd"
	}

	export class Token extends BaseToken<TokenKind> {}

	export namespace Types {
		export class TagStart extends Token {
			public tagName: string;

			constructor(tagName: string) {
				super(TokenKind.TagStart);
				this.tagName = tagName;
			}
		}

		export class TagEnd extends Token {
			public tagName: string;

			constructor(tagName: string) {
				super(TokenKind.TagEnd);
				this.tagName = tagName;
			}
		}
	}
}
