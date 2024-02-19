import { Token } from "./Token";
import { JsonError } from "./util/JsonError";

import {
  Node,
  ArrayNode,
  ObjectNode,
  AnyScalarNode,
  NullScalarNode,
  NumberScalarNode,
  StringScalarNode,
  BooleanScalarNode,
} from "./nodes";

export function parse(tokens: Token[]): Node {
  const rootNode = parseSingle(tokens);

  if (tokens.length > 0) {
    throw new JsonError("Unexpected tokens at the end of source", tokens);
  }

  return rootNode;
}

export function parseSingle(tokens: Token[]): Node {
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
    tokens,
  );
}

function parseScalar(tokens: Token[]): AnyScalarNode {
  const { type, value } = tokens[0];

  if (type === "string") {
    validateString(value, tokens);
  }

  let scalar = null;

  switch (type) {
    case "null":
      scalar = new NullScalarNode();
      break;
    case "number":
      scalar = NumberScalarNode.fromString(value);
      break;
    case "string":
      scalar = new StringScalarNode(value);
      break;
    case "boolean":
      scalar = BooleanScalarNode.fromString(value);
      break;
    default:
      throw new JsonError(
        `Could not parse scalar "${value}" (Unknown type "${type}")`,
        tokens,
      );
  }

  tokens.shift();

  return scalar;
}

function parseArray(tokens: Token[]): ArrayNode {
  const arrayNode = new ArrayNode();

  // Removes the opening "[" token.
  tokens.shift();

  const firstToken = tokens[0];

  // Empty Array, exit early.
  if (firstToken && firstToken.isArrayClose) {
    tokens.shift();

    return arrayNode;
  }

  while (tokens.length > 0) {
    arrayNode.addChild(parseSingle(tokens));

    // The next token is either a comma or it is the closing bracket.
    // In both cases the token needs to be removed. We just need to keep it around
    // to check if it is a comma.
    const nextToken = tokens.shift();

    // If the next token "after" the value is not a comma, we do not expect
    // any more values. Technically we don't even need the comma, but we stick
    // to the standard strictly.
    if (nextToken && nextToken.isComma) {
      continue;
    }

    if (nextToken && nextToken.isArrayClose) {
      return arrayNode;
    }

    throw new JsonError("Additional comma at end of array entries", tokens);
  }

  throw new JsonError(
    "Unexpected token at the end of an array entry, most likely a missing comma",
    tokens,
  );
}

function parseObject(tokens: Token[]) {
  const objectNode = new ObjectNode();

  tokens.shift();

  const firstToken = tokens[0];

  // Empty Object, exit early
  if (firstToken && firstToken.isObjectClose) {
    tokens.shift();

    return objectNode;
  }

  while (tokens.length > 0) {
    objectNode.addEntry(parseObjectEntry(tokens));

    const nextToken = tokens.shift();

    // If there is a comma, the json spec specifies that there *must*
    // be another entry on the object
    if (nextToken && nextToken.isComma) {
      continue;
    }

    // If the next token is not a comma, there are no more entries
    // which means that the next token *must* be a "}"
    if (nextToken && nextToken.isObjectClose) {
      return objectNode;
    }

    throw new JsonError(
      "Unexpected token at the end of an object entry, most likely a missing comma",
      tokens,
    );
  }

  throw new JsonError("Unexpected end of source, while parsing object", tokens);
}

function parseObjectEntry(tokens: Token[]) {
  const [keyToken, separatorToken] = tokens;

  if (!keyToken || !keyToken.isString) {
    throw new JsonError(
      `Unexpected token of type "${keyToken.type}" ("${keyToken.value}") on object key`,
      tokens,
    );
  }

  if (!separatorToken || !separatorToken.isColon) {
    throw new JsonError(
      `Unexpected token of type "${separatorToken.type}" ("${separatorToken.value}") as object key-value separator`,
      tokens,
    );
  }

  tokens.splice(0, 2);

  return {
    key: keyToken.value,
    value: parseSingle(tokens),
  };
}

function validateString(value: string, tokens: Token[]) {
  const chars = value.split("");

  for (let index = 0; index < chars.length; index++) {
    const element = chars[index];

    if (
      element === "\t" ||
      element === "\n" ||
      element === "\b" ||
      element === "\f" ||
      element === "\r"
    ) {
      throw new JsonError(
        "Invalid characters in string. Control characters must be escaped!",
        tokens,
      );
    }

    if (element !== "\\") {
      continue;
    }

    if (chars.length <= index + 1) {
      throw new JsonError("Unexpected end of escape-sequence", tokens);
    }

    const escapeCharacter = chars[index + 1];

    if (escapeCharacter === "\\" || escapeCharacter === "/") {
      index++;

      continue;
    }

    if (["b", "f", "n", "r", "t", '"'].includes(escapeCharacter)) {
      continue;
    }

    if (escapeCharacter === "u") {
      if (chars.length >= index + 6) {
        const unicodeEscapeSequence = chars.slice(index + 2, index + 6).join("");

        if (/^[0-9A-Fa-f]{4}$/.test(unicodeEscapeSequence)) {
          index += 5;

          continue;
        } else {
          throw new JsonError("Invalid unicode escape sequence", tokens);
        }
      } else {
        throw new JsonError("Unexpected end of escape-sequence", tokens);
      }
    }

    throw new JsonError("Unrecognized escape sequence", tokens);
  }
}
