import { Token } from "./Token";
import { Node, ScalarNode, ObjectNode, ArrayNode } from './nodes';

export function parse(tokens: Token[]): Node {
  if (tokens.length === 0) {
    throw new Error("Unexpected end of source!");
  }

  const initialToken = tokens[0];

  if (initialToken.isScalar) {
    return parseScalar(tokens);
  }

  if (initialToken.isObjectOpen) {
    return parseObject(tokens);
  }

  if (initialToken.isArrayOpen) {
    return parseArray(tokens);
  }

  // TODO: We can improve errors, by creating a custom error type, which serializes the tokens.
  throw new Error(
      `Could not parse token of type '${initialToken.type}' at this location`
  );
}

function parseScalar(tokens: Token[]): ScalarNode {
  const { type, value } = tokens[0];

  const scalar = new ScalarNode(type, value);

  tokens.shift();

  return scalar;
}

function parseArray(tokens: Token[]): ArrayNode {
  const arrayNode = new ArrayNode();

  // Removes the opening "[" token.
  tokens.shift();

  while (tokens.length > 0) {
    const firstToken = tokens[0];

    if (firstToken.isArrayClose) {
      tokens.shift();

      return arrayNode;
    }

    if (firstToken.isComma) {
      tokens.shift();
    }

    arrayNode.addChild(parse(tokens));

    const [nextToken] = tokens;

    // If the next token "after" the value is not a comma, we do not expect
    // any more values. Technically we dont even need the comma, but we are stick
    // to the standard strictly.
    if (!nextToken.isComma) {
        tokens.shift();

        return arrayNode;
    }
  }

  throw new Error("Unexpected end of source, while parsing array");
}

function parseObject(tokens: Token[]) {
  const objectNode = new ObjectNode();

  tokens.shift();

  while (tokens.length > 0) {
    const firstToken = tokens[0];

    if (firstToken.isObjectClose) {
      tokens.shift();

      return objectNode;
    }

    if (firstToken.isComma) {
      tokens.shift();
    }

    objectNode.addEntry(
        parseObjectEntry(tokens)
    );

    const [nextToken] = tokens;

    // If the next token "after" the value is not a comma, we do not expect
    // any more values. Technically we dont even need the comma, but we are stick
    // to the standard strictly.
    if (nextToken.type !== "punctuation" || nextToken.value !== ",") {
        tokens.shift();

        return objectNode;
    }
  }

  throw new Error("Unexpected end of source, while parsing object!");
}

function parseObjectEntry(tokens: Token[]) {
  const [keyToken, seperatorToken] = tokens;

  if (!keyToken || !keyToken.isString) {
    throw new Error(
      `Unexpected token of type "${keyToken.type}" ("${keyToken.value}") on object key`,
    );
  }

  if (!seperatorToken || !seperatorToken.isColon) {
    throw new Error(
      `Unexpected token of type "${seperatorToken.type}" ("${seperatorToken.value}") as object key-value seperator`,
    );
  }

  tokens.splice(0, 2);

  return {
    key: keyToken.value,
    value: parse(tokens),
  };
}
