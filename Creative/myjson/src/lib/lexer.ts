export type Token = {
  type: "punctuation" | "boolean" | "string" | "number" | "null";
  value: string;
};

type TokenizerResult =
  | { matched: false }
  | { matched: true; token: Token; cursor: number };

type Tokenizer = (source: string, cursor: number) => TokenizerResult;

export function tokenize(source: string): Token[] {
  const trimmedSource = source.replace(/\s/g, "");

  let cursor = 0;
  const tokens: Token[] = [];

  const tokenizers: Tokenizer[] = [tokenizeSimpleToken, tokenizeString, tokenizeNumber];

  while (cursor < trimmedSource.length) {
    let didMatch = false;

    for (const tokenizer of tokenizers) {
      const result = tokenizer(trimmedSource, cursor);

      if (result.matched) {
        didMatch = true;
        cursor = result.cursor;
        tokens.push(result.token);

        break;
      }
    }

    if (!didMatch) {
      console.log(tokens);
      throw new Error(`Could not lex token: "${trimmedSource.substr(cursor)}"`);
    }
  }

  return tokens;
}

function tokenizeNumber(source: string, cursor: number): TokenizerResult {
  // This only supports simple numbers, not floats or anything, also no decimal point.
  // TODO: Implement more spec-compliant number parsing
  const result = matchRegex(source, cursor, /[0-9]+/);

  if (result.matched) {
    return {
      matched: true,
      cursor: result.cursor,
      token: {
        type: "number",
        value: result.value,
      },
    };
  }

  return {
    matched: false,
  };
}

function tokenizeString(source: string, cursor: number): TokenizerResult {
  // This does not do any of the backslash or escape-sequence parsing
  // We also do not allow all of the unicode character set, which is technically required.
  // TODO: Implement more spec-compliant string parsing
  const result = matchRegex(source, cursor, /"[a-zA-Z]*"/);

  if (result.matched) {
    let value = result.value;

    if (value == null || value.length === 0) {
      throw new Error("Empty string is not allowed!");
    }

    if (value[0] === '"' || value[value.length - 1] === '"') {
      value = value.replace(/"/g, "");
    }

    return {
      matched: true,
      cursor: result.cursor,
      token: {
        type: "string",
        value,
      },
    };
  }

  return {
    matched: false,
  };
}

function tokenizeSimpleToken(source: string, cursor: number): TokenizerResult {
  const simpleTokenDefinitions: Token[] = [
    // Simple Literals
    { type: "boolean", value: "false" },
    { type: "boolean", value: "true" },
    { type: "null", value: "null" },
    // Punctuation
    { type: "punctuation", value: "{" },
    { type: "punctuation", value: "}" },
    { type: "punctuation", value: "[" },
    { type: "punctuation", value: "]" },
    { type: "punctuation", value: ":" },
    { type: "punctuation", value: "," },
  ];

  for (const token of simpleTokenDefinitions) {
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

  throw new Error("Invalid regex parse.");
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
