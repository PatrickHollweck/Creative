import { PUNCTUATION_TOKENS, Token } from "./Token";

type TokenizerResult =
  | { matched: false, cursor?: number }
  | { matched: true; token: Token; cursor: number };

type Tokenizer = (source: string, cursor: number) => TokenizerResult;

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

      if (result.matched) {
        didMatch = true;
        cursor = result.cursor;
        tokens.push(result.token);

        break;
      }

      // Even if a tokenizer did not match, it is free to move the cursor
      // this is usefull for example when parsing white-space, which does not result in a token
      if (!result.matched && typeof result.cursor === "number") {
          cursor = result.cursor;
      }
    }

    if (!didMatch) {
      throw new Error(`Could not lex token: "${source.substr(cursor)}"`);
    }
  }

  return tokens;
}

function tokenizeWhitespace(source: string, cursor: number): TokenizerResult {
    const result = matchRegex(source, cursor, /^\s/);

    if (result.matched) {
        return {
            matched: false,
            cursor: result.cursor
        };
    }

    return {
        matched: false
    };
}

function tokenizeNull(source: string, cursor: number): TokenizerResult {
    return matchStaticToken(source, cursor, new Token("null", "null"));
}

function tokenizeBoolean(source: string, cursor: number): TokenizerResult {
    const booleanTokens = [
        new Token("boolean", "true"),
        new Token("boolean", "false"),
    ];

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
      /^(0$|-?(0(\.\d+)|[1-9]+([0-9]+)?(\.\d+)?)((e|E)(-?|\+?)\d+)?)/
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
  // TODO: Implement more spec-compliant string parsing
  // This does not do any of the backslash or escape-sequence parsing
  // We also do not allow all of the unicode character set, which is technically required.
  const result = matchRegex(source, cursor, /^"[^"]*"/u);

  if (result.matched) {
    let value = result.value;

    if (
        (value != null && value.length > 0) &&
        (value[0] === '"' || value[value.length - 1] === '"')
    ) {
      value = value
        .replace(/^"/, "")
        .replace(/"$/, "");
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

  const value = match[0];

  return {
    value,
    matched: true,
    cursor: cursor + value.toString().length,
  };
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
            token
        };
    }

    return {
        matched: false
    };
}
