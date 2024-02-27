import { TokenList } from "./TokenList";

export class JsonError extends Error {
  constructor(message: string, tokens: TokenList) {
    super(formatMessage(message, tokens));
  }
}

function serializeTokens(tokens: TokenList) {
  return tokens
    .asArray()
    .map(token => {
      if (token.isString) {
        return `"${token.value}"`;
      }

      return token.value;
    })
    .join("");
}

function formatMessage(message: string, tokens: TokenList): string {
  const source = serializeTokens(tokens);

  return `${message}\n\nSource at the point of the Error:\n${source}\n^`;
}
