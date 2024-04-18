import { TokenList } from "./util/TokenList";
import { PUNCTUATION_TOKENS, Token } from "./Token";

type Tokenizer = (source: string, cursor: number) => TokenizerResult;

type TokenizerResult =
  | { matched: false }
  | { matched: true; token: Token; cursor: number };

export function tokenize(source: string): TokenList {
  let cursor = 0;
  const tokens: Token[] = [];

  const tokenizers: Tokenizer[] = [
    tokenizePunctuation,
    tokenizeNull,
    tokenizeNumber,
    tokenizeString,
    tokenizeBoolean,
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

      if (!result.matched) {
        continue;
      }

      didMatch = true;
      cursor = result.cursor;

      tokens.push(result.token);

      break;
    }

    if (!didMatch) {
      throw new Error(`Unknown token at: "${source.substr(cursor, 100)}"`);
    }
  }

  return new TokenList(tokens);
}

function tokenizeNull(source: string, cursor: number): TokenizerResult {
  return matchStaticToken(source, cursor, new Token("null", "null"));
}

function tokenizeBoolean(source: string, cursor: number): TokenizerResult {
  const booleanTokens = [new Token("boolean", "true"), new Token("boolean", "false")];

  for (const token of booleanTokens) {
    const result = matchStaticToken(source, cursor, token);

    if (result.matched) {
      return result;
    }
  }

  return {
    matched: false,
  };
}

function tokenizeNumber(source: string, cursor: number): TokenizerResult {
  let state = "sign";
  let previousState: string | null = null;

  let wholeState;
  let internalCursor = cursor;

  function isDigit(c: number) {
    return (
      source[c] === "0" ||
      source[c] === "1" ||
      source[c] === "2" ||
      source[c] === "3" ||
      source[c] === "4" ||
      source[c] === "5" ||
      source[c] === "6" ||
      source[c] === "7" ||
      source[c] === "8" ||
      source[c] === "9"
    );
  }

  function skipDigits() {
    let matched = false;
    let hasLeadingZero = false;
    let totalDigitsMatched = 0;

    if (source[internalCursor] === "0") {
      hasLeadingZero = true;
    }

    while (internalCursor < source.length) {
      if (isDigit(internalCursor)) {
        matched = true;
        internalCursor++;
        totalDigitsMatched++;
      } else {
        if (!matched) {
          throw new Error("Invalid number! (No digits!)");
        }

        break;
      }
    }

    return { hasLeadingZero, totalDigitsMatched };
  }

  function setState(
    newState: "sign" | "whole" | "fraction" | "exponent-sign" | "exponent" | "done",
  ) {
    previousState = state;
    state = newState;

    if (previousState === state) {
      throw new Error("Invalid number! (Repeat state!)");
    }
  }

  while (internalCursor < source.length) {
    if (state === "sign") {
      if (source[internalCursor] === "-") {
        internalCursor++;
      }

      setState("whole");
    }

    if (state === "whole") {
      if (!isDigit(internalCursor)) {
        return {
          matched: false,
        };
      }

      wholeState = skipDigits();
      setState("fraction");
    }

    if (state === "fraction") {
      if (source[internalCursor] === ".") {
        internalCursor++;
        skipDigits();
      }

      if (wholeState!.hasLeadingZero && wholeState!.totalDigitsMatched > 1) {
        throw new Error("Invalid number! (No leading zeroes on fractions allowed!)");
      }

      setState("exponent-sign");
    }

    if (state === "exponent-sign") {
      if (source[internalCursor] === "e" || source[internalCursor] === "E") {
        internalCursor++;

        if (source[internalCursor] === "+" || source[internalCursor] === "-") {
          internalCursor++;
        }

        setState("exponent");
      } else {
        setState("done");
      }
    }

    if (state === "exponent") {
      if (skipDigits().hasLeadingZero) {
        throw new Error("Invalid Number! (No leading zeros on exponent allowed!)");
      }

      setState("done");
    }

    if (state === "done") {
      return {
        matched: true,
        cursor: internalCursor,
        token: new Token("number", source.substring(cursor, internalCursor)),
      };
    }
  }

  return {
    matched: false,
  };
}

function tokenizeString(source: string, cursor: number): TokenizerResult {
  // Early return if the current char is not a " it cannot be a string therefore exit early
  if (source[cursor] !== '"') {
    return {
      matched: false,
    };
  }

  let nextQuoteIndex = source.indexOf('"', cursor + 1);

  // While there are more characters to process collect them into the value variable.
  while (nextQuoteIndex !== -1 && nextQuoteIndex + 1 <= source.length) {
    // The second unescaped " closes the string
    if (source[nextQuoteIndex - 1] !== "\\") {
      const content = source.substring(cursor + 1, nextQuoteIndex);

      // A json string cannot contain a new-line
      if (content.indexOf("\n") !== -1) {
        return {
          matched: false,
        };
      }

      return {
        matched: true,
        cursor: nextQuoteIndex + 1,
        token: new Token("string", content),
      };
    }

    nextQuoteIndex = source.indexOf('"', nextQuoteIndex + 1);
  }

  return {
    matched: false,
  };
}

function tokenizePunctuation(source: string, cursor: number): TokenizerResult {
  for (const token of Object.values(PUNCTUATION_TOKENS)) {
    const matchResult = matchLiteral(source, cursor, token.value);

    if (matchResult.matched) {
      return {
        matched: true,
        token,
        cursor: matchResult.cursor,
      };
    }
  }

  return {
    matched: false,
  };
}

/*
 * Helper Functions
 */

function matchLiteral(
  source: string,
  cursor: number,
  token: string,
): { matched: false } | { matched: true; cursor: number } {
  if (source.substr(cursor, token.length) === token) {
    return {
      matched: true,
      cursor: cursor + token.length,
    };
  }

  return {
    matched: false,
  };
}

function matchStaticToken(source: string, cursor: number, token: Token): TokenizerResult {
  const lookahead = matchLiteral(source, cursor, token.value);

  if (lookahead.matched) {
    return {
      matched: true,
      cursor: lookahead.cursor,
      token,
    };
  }

  return {
    matched: false,
  };
}
