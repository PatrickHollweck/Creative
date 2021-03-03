import { Token } from "./Token";
import { Node, ScalarNode, ObjectNode, ArrayNode } from './nodes';
import { JsonError } from "./util/JsonError";

export function parse(tokens: Token[]): Node {
  if (tokens.length === 0) {
    throw new JsonError("Unexpected end of source!", tokens);
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

  throw new JsonError(
      `Could not parse token of type '${initialToken.type}' at this location`,
      tokens
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

    arrayNode.addChild(parse(tokens));

    // The next token is either a comma or it is the closing bracket.
    // In both cases the token needs to be removed. We just need to keep it around
    // to check if it is a comma.
    const nextToken = tokens.shift();

    // If the next token "after" the value is not a comma, we do not expect
    // any more values. Technically we dont even need the comma, but we are stick
    // to the standard strictly.
    if (nextToken && !nextToken.isComma) {
        return arrayNode;
    }
  }

  throw new JsonError(
    "Unexpected end of source, while parsing array",
    tokens
  );
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

    objectNode.addEntry(
        parseObjectEntry(tokens)
    );

    const nextToken = tokens.shift();

    if (nextToken && !nextToken.isComma) {
        return objectNode;
    }
  }

  throw new JsonError(
    "Unexpected end of source, while parsing object",
    tokens
  );
}

function parseObjectEntry(tokens: Token[]) {
  const [keyToken, seperatorToken] = tokens;

  if (!keyToken || !keyToken.isString) {
    throw new JsonError(
      `Unexpected token of type "${keyToken.type}" ("${keyToken.value}") on object key`,
      tokens
    );
  }

  if (!seperatorToken || !seperatorToken.isColon) {
    throw new JsonError(
      `Unexpected token of type "${seperatorToken.type}" ("${seperatorToken.value}") as object key-value seperator`,
      tokens,
    );
  }

  tokens.splice(0, 2);

  return {
    key: keyToken.value,
    value: parse(tokens),
  };
}
