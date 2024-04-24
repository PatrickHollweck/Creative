import { TokenList } from "./TokenList";

export class JsonParserError extends Error {
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

  return `Could not parse JSON!\nReason: ${message}\nSource point: ${source}\n              ^`;
}
