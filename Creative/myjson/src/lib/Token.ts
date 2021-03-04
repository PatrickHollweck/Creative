type TokenType = "punctuation" | "boolean" | "string" | "number" | "null";

export class Token {
  public readonly type: TokenType;
  public readonly value: string;

  public constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }

  public get isString(): boolean {
    return this.type === "string";
  }

  public get isNumber(): boolean {
    return this.type === "number";
  }

  public get isBoolean(): boolean {
    return this.type === "boolean";
  }

  public get isNull(): boolean {
    return this.type === "null";
  }

  public get isScalar(): boolean {
    return this.isNull || this.isString || this.isNumber || this.isBoolean;
  }

  public get isPunctuation(): boolean {
    return this.type === "punctuation";
  }

  public get isArrayOpen(): boolean {
    return isPredefinedPunctuation("arrayOpen", this);
  }

  public get isArrayClose(): boolean {
    return isPredefinedPunctuation("arrayClose", this);
  }

  public get isObjectOpen(): boolean {
    return isPredefinedPunctuation("objectOpen", this);
  }

  public get isObjectClose(): boolean {
    return isPredefinedPunctuation("objectClose", this);
  }

  public get isComma(): boolean {
    return isPredefinedPunctuation("comma", this);
  }

  public get isColon(): boolean {
    return isPredefinedPunctuation("colon", this);
  }
}

export const PUNCTUATION_TOKENS = {
  comma: new Token("punctuation", ","),
  colon: new Token("punctuation", ":"),
  arrayOpen: new Token("punctuation", "["),
  arrayClose: new Token("punctuation", "]"),
  objectOpen: new Token("punctuation", "{"),
  objectClose: new Token("punctuation", "}"),
};

function isPredefinedPunctuation(
  key: keyof typeof PUNCTUATION_TOKENS,
  token: Token,
): boolean {
  return token.isPunctuation && PUNCTUATION_TOKENS[key].value === token.value;
}
