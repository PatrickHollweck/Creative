import { AnyScalarNode } from "./nodes";

export const enum TokenType {
  Punctuation = 0,
  String = 1,
  Scalar = 2,
}

const enum PunctuationType {
  Colon = 0,
  Comma = 1,
  ArrayOpen = 2,
  ArrayClose = 3,
  ObjectOpen = 4,
  ObjectClose = 5,
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
    return isPredefinedPunctuation(PunctuationType.ArrayOpen, this);
  }

  public get isArrayClose(): boolean {
    return isPredefinedPunctuation(PunctuationType.ArrayClose, this);
  }

  public get isObjectOpen(): boolean {
    return isPredefinedPunctuation(PunctuationType.ObjectOpen, this);
  }

  public get isObjectClose(): boolean {
    return isPredefinedPunctuation(PunctuationType.ObjectClose, this);
  }

  public get isComma(): boolean {
    return isPredefinedPunctuation(PunctuationType.Comma, this);
  }

  public get isColon(): boolean {
    return isPredefinedPunctuation(PunctuationType.Colon, this);
  }
}

export const PUNCTUATION_TOKENS = {
  [PunctuationType.Colon]: new Token(TokenType.Punctuation, ":"),
  [PunctuationType.Comma]: new Token(TokenType.Punctuation, ","),
  [PunctuationType.ArrayOpen]: new Token(TokenType.Punctuation, "["),
  [PunctuationType.ArrayClose]: new Token(TokenType.Punctuation, "]"),
  [PunctuationType.ObjectOpen]: new Token(TokenType.Punctuation, "{"),
  [PunctuationType.ObjectClose]: new Token(TokenType.Punctuation, "}"),
};

function isPredefinedPunctuation(
  key: keyof typeof PUNCTUATION_TOKENS,
  token: Token,
): boolean {
  return PUNCTUATION_TOKENS[key].value === token.value;
}
