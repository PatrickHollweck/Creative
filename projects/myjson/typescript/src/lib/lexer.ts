import { TokenList } from "./util/TokenList";
import { PUNCTUATION_TOKENS, Token, TokenType } from "./Token";
import { JsonLexerError } from "./util/JsonLexerError";

import {
  NODE_NULL,
  NODE_BOOL_TRUE,
  NODE_BOOL_FALSE,
  NumberScalarNode,
  StringScalarNode,
} from "./nodes";

type Tokenizer = (source: string, cursor: number) => TokenizerResult;

type TokenizerResult =
  | { matched: false; token: null; cursor: null }
  | { matched: true; token: Token; cursor: number };

const NO_MATCH = { matched: false, token: null, cursor: null } as const;

export function tokenize(source: string): TokenList {
  let cursor = 0;
  const tokens: Token[] = [];

  // TODO: Maybe we can short-circuit this logic
  const tokenizers: Tokenizer[] = [
    tokenizePunctuation,
    tokenizeString,
    tokenizeBoolean,
    tokenizeNumber,
    tokenizeNull,
  ];

  tokenLoop: while (cursor < source.length) {
    // Skip whitespace tokens
    if (
      source[cursor] === " " ||
      source[cursor] === "\n" ||
      source[cursor] === "\t" ||
      source[cursor] === "\r" ||
      source[cursor] === "\v"
    ) {
      cursor++;

      continue tokenLoop;
    }

    let didMatch = false;

    for (const tokenizer of tokenizers) {
      const result = tokenizer(source, cursor);

      if (result === NO_MATCH) {
        continue;
      }

      didMatch = true;
      cursor = result.cursor!;

      tokens.push(result.token!);

      break;
    }

    if (!didMatch) {
      throw new JsonLexerError("Unknown token", source, cursor);
    }
  }

  return new TokenList(tokens);
}

const TOKEN_NULL = new Token(TokenType.Scalar, NODE_NULL);
function tokenizeNull(source: string, cursor: number): TokenizerResult {
  if (matchLiteral(source, cursor, "null")) {
    return {
      matched: true,
      cursor: cursor + 4,
      token: TOKEN_NULL,
    };
  }

  return NO_MATCH;
}

const TOKEN_BOOL_TRUE = new Token(TokenType.Scalar, NODE_BOOL_TRUE);
const TOKEN_BOOL_FALSE = new Token(TokenType.Scalar, NODE_BOOL_FALSE);
function tokenizeBoolean(source: string, cursor: number): TokenizerResult {
  const lookaheadTrue = matchLiteral(source, cursor, "true");

  if (lookaheadTrue) {
    return {
      matched: true,
      cursor: cursor + 4,
      token: TOKEN_BOOL_TRUE,
    };
  }

  const lookaheadFalse = matchLiteral(source, cursor, "false");

  if (lookaheadFalse) {
    return {
      matched: true,
      cursor: cursor + 5,
      token: TOKEN_BOOL_FALSE,
    };
  }

  return NO_MATCH;
}

function tokenizeNumber(source: string, cursor: number): TokenizerResult {
  let internalCursor = cursor;

  function isDigit(index: number) {
    const value = source[index];

    return value >= "0" && value <= "9";
  }

  function skipDigits() {
    let hasLeadingZero = false;
    let totalDigitsMatched = 0;

    if (source[internalCursor] === "0") {
      hasLeadingZero = true;
    }

    while (internalCursor < source.length) {
      if (isDigit(internalCursor)) {
        internalCursor++;
        totalDigitsMatched++;
      } else {
        break;
      }
    }

    if (totalDigitsMatched === 0) {
      throw new JsonLexerError(
        "Invalid number! (Expected at least one digit at this location!)",
        source,
        internalCursor,
      );
    }

    return { hasLeadingZero, totalDigitsMatched };
  }

  // Parse optional sign of integer part
  if (source[internalCursor] === "-") {
    internalCursor++;

    // Throw on lonely minus
    if (!isDigit(internalCursor)) {
      throw new JsonLexerError("Invalid lonely minus sign", source, cursor);
    }
  }

  // Not a number if current cursor is not a digit - Return early
  if (!isDigit(internalCursor)) {
    return NO_MATCH;
  }

  // Parse the integer part
  const integerPart = skipDigits();

  if (integerPart!.hasLeadingZero && integerPart!.totalDigitsMatched > 1) {
    throw new JsonLexerError(
      "Invalid number! (No leading zeroes on fractions allowed!)",
      source,
      cursor,
    );
  }

  // Parse optional fraction part
  if (source[internalCursor] === ".") {
    internalCursor++;
    skipDigits();
  }

  // Parse optional exponent part
  if (source[internalCursor] === "e" || source[internalCursor] === "E") {
    internalCursor++;

    // Parse sign of exponent
    if (source[internalCursor] === "+" || source[internalCursor] === "-") {
      internalCursor++;
    }

    // Parse exponent number
    skipDigits();
  }

  return {
    matched: true,
    cursor: internalCursor,
    token: new Token(
      TokenType.Scalar,
      NumberScalarNode.fromString(source.substring(cursor, internalCursor)),
    ),
  };
}

function tokenizeString(source: string, cursor: number): TokenizerResult {
  // Early return if the current char is not a " it cannot be a string therefore exit early
  if (source[cursor] !== '"') {
    return NO_MATCH;
  }

  let nextQuoteIndex = source.indexOf('"', cursor + 1);

  // While there are more characters to process collect them into the value variable.
  while (nextQuoteIndex !== -1 && nextQuoteIndex + 1 <= source.length) {
    // The second unescaped " closes the string
    if (source[nextQuoteIndex - 1] !== "\\") {
      const content = source.substring(cursor + 1, nextQuoteIndex);

      // A json string cannot contain a new-line
      if (content.indexOf("\n") !== -1) {
        return NO_MATCH;
      }

      return {
        matched: true,
        cursor: nextQuoteIndex + 1,
        token: new Token(TokenType.String, new StringScalarNode(content)),
      };
    }

    nextQuoteIndex = source.indexOf('"', nextQuoteIndex + 1);
  }

  return NO_MATCH;
}

const PUNCTUATION_TOKEN_VALUES = Object.values(PUNCTUATION_TOKENS);
function tokenizePunctuation(source: string, cursor: number): TokenizerResult {
  const nextChar = source.substring(cursor, cursor + 1);

  for (const token of PUNCTUATION_TOKEN_VALUES) {
    if (nextChar === token.value) {
      return {
        matched: true,
        token,
        cursor: cursor + 1,
      };
    }
  }

  return NO_MATCH;
}

/*
 * Helper Functions
 */

function matchLiteral(source: string, cursor: number, search: string): boolean {
  return source.substring(cursor, cursor + search.length) === search;
}
