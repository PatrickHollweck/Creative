import { AnyScalarNode } from "./nodes";

export const enum TokenType {
  Punctuation = 0,
  String = 1,
  Scalar = 2,
}

export class Token {
  public readonly value: string | AnyScalarNode;
  private readonly type: TokenType;

  public constructor(type: TokenType, value: string | AnyScalarNode) {
    this.type = type;
    this.value = value;
  }

  public get isString(): boolean {
    return this.type === TokenType.String;
  }

  public get isScalar(): boolean {
    return this.type === TokenType.Scalar;
  }

  public get isPunctuation(): boolean {
    return this.type === TokenType.Punctuation;
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
  colon: new Token(TokenType.Punctuation, ":"),
  comma: new Token(TokenType.Punctuation, ","),
  arrayOpen: new Token(TokenType.Punctuation, "["),
  arrayClose: new Token(TokenType.Punctuation, "]"),
  objectOpen: new Token(TokenType.Punctuation, "{"),
  objectClose: new Token(TokenType.Punctuation, "}"),
};

function isPredefinedPunctuation(
  key: keyof typeof PUNCTUATION_TOKENS,
  token: Token,
): boolean {
  return PUNCTUATION_TOKENS[key].value === token.value;
}
