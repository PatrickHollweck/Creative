import { PUNCTUATION_TOKENS, Token } from "./Token";

type Tokenizer = (source: string, cursor: number) => TokenizerResult;

type TokenizerResult =
  | { matched: false }
  | { matched: true; token: Token; cursor: number };

export function tokenize(source: string): Token[] {
  let cursor = 0;
  const tokens: Token[] = [];

  const tokenizers: Tokenizer[] = [
    tokenizeWhitespace,
    tokenizePunctuation,
    tokenizeNull,
    tokenizeNumber,
    tokenizeString,
    tokenizeBoolean,
  ];

  while (cursor < source.length) {
    let didMatch = false;

    for (const tokenizer of tokenizers) {
      const result = tokenizer(source, cursor);

      if (!result.matched) {
        continue;
      }

      didMatch = true;
      cursor = result.cursor;

      // Ignore all whitespace tokens, they are not relevant to parsing
      if (!result.token.isWhitespace) {
        tokens.push(result.token);
      }

      break;
    }

    if (!didMatch) {
      throw new Error(`Unknown token at: "${source.substr(cursor, 100)}"`);
    }
  }

  return tokens;
}

function tokenizeWhitespace(source: string, cursor: number): TokenizerResult {
  const result = matchRegex(source, cursor, /^(?!\f)\s/);

  if (result.matched) {
    return {
      matched: true,
      cursor: result.cursor,
      token: new Token("whitespace", result.value),
    };
  }

  return {
    matched: false,
  };
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
  const result = matchRegex(
    source,
    cursor,
    /^(?:(?!0\d)(?!-0\d)-?(?:0(?:\.\d+)|\d+(?:\d+)?(?:\.\d+)?)(?:(?:e|E)(?:-?|\+?)\d+)?)/,
  );

  if (result.matched) {
    return {
      matched: true,
      cursor: result.cursor,
      token: new Token("number", result.value),
    };
  }

  return {
    matched: false,
  };
}

function tokenizeString(source: string, cursor: number): TokenizerResult {
  const result = matchRegex(source, cursor, /^"(?:[^\n"\\]|\\.)*"/);

  if (result.matched) {
    let value = result.value;

    if (
      // Check if we even have a value, dont run the following check if we dont
      value != null &&
      value.length > 0 &&
      // Check if the first or last character is a quotation mark, in which case we would need to remove them
      (value[0] === '"' || value[value.length - 1] === '"') &&
      // Ensure we do not remove quotation marks on a string with no content ("")
      !(value.length === 2 && value[0] === '"' && value[value.length - 1] === '"')
    ) {
      value = value.replace(/^"/, "").replace(/"$/, "");
    }

    return {
      matched: true,
      cursor: result.cursor,
      token: new Token("string", value),
    };
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

function matchRegex(
  source: string,
  cursor: number,
  regex: RegExp,
): { matched: false } | { matched: true; value: string; cursor: number } {
  const currentSource = source.substr(cursor);
  const match = currentSource.match(regex);

  if (!match || match.length === 0) {
    return {
      matched: false,
    };
  }

  if (match.length === 1) {
    const value = match[0];

    return {
      value,
      matched: true,
      cursor: cursor + value.toString().length,
    };
  }

  // We should not get here, regex passed in here should be designed
  // as such that there is only one Group match. (Use non-capture groups!).
  // Therefore it is most likely a programmer's error if we get here.
  throw new Error("Invalid regex matches! (More than one group!)");
}

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
