import { Token } from "../Token";

function serializeTokens(tokens: Token[]) {
    return tokens.map((token) => {
        if (token.isString) {
            return `"${token.value}"`;
        }

        return token.value;
    }).join("");
}

function formatMessage(message: string, tokens: Token[]): string {
    const source = serializeTokens(tokens);

    return `${message}\n\nSource at the point of the Error:\n${source}\n^`;
}

export class JsonError extends Error {
    constructor(message: string, tokens: Token[]) {
        super(formatMessage(message, tokens));
    }
}
