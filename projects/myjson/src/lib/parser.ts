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
  const token = tokens.shift();

  if (token == null) {
    throw new JsonError("Unexpected end of file!", tokens);
  }

  switch (token.type) {
    case "null":
      return new NullScalarNode();
    case "number":
      return NumberScalarNode.fromString(token.value);
    case "string":
      return new StringScalarNode(parseString(token.value, tokens));
    case "boolean":
      return BooleanScalarNode.fromString(token.value);
    default:
      throw new JsonError(
        `Could not parse scalar "${token.value}" (Unknown type "${token.type}")`,
        tokens,
      );
  }
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
      `Unexpected token of type "${keyToken.type}" ("${keyToken.value}") used as object key`,
      tokens,
    );
  }

  if (!separatorToken || !separatorToken.isColon) {
    throw new JsonError(
      `Unexpected token of type "${separatorToken.type}" ("${separatorToken.value}") used as object key-value separator`,
      tokens,
    );
  }

  tokens.splice(0, 2);

  return {
    key: parseString(keyToken.value, tokens),
    value: parseSingle(tokens),
  };
}

function parseString(value: string, tokens: Token[]) {
  // Short-circuit optimization - If the string contains no backslash
  // then it cannot include escape sequences that would need to be parsed.
  if (!value.includes("\\") && !value.includes("	")) {
    return value;
  }

  const chars = value.split("");

  for (let index = 0; index < chars.length; index++) {
    const element = chars[index];

    if (["\t", "\n", "\b", "\f", "\r"].includes(element)) {
      throw new JsonError(
        "Invalid characters in string. Control characters must be escaped!",
        tokens,
      );
    }

    // If this character is not the start of an escape sequence continue straight away...
    if (element !== "\\") {
      continue;
    }

    // Escape sequences have a minimum length of one. Example: \n
    if (chars.length <= index + 1) {
      throw new JsonError("Unexpected end of escape-sequence", tokens);
    }

    // This specifies which escape sequence is used.
    const escapeCharacter = chars[index + 1];

    // The backslash that initiates the escape sequence is always removed...
    chars[index] = "";
    index++;

    if (["\\", '"', "/", "b", "f", "n", "r", "t", '"'].includes(escapeCharacter)) {
      const simpleEscapeSequences = {
        '"': '"',
        "\\": "\\",
        // Yeah the JSON spec does this... It is called the "solidus" escape sequence
        "/": "/",
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "\t",
      };

      chars[index] =
        simpleEscapeSequences[
          // Ugly type cast needed here because typescript does not narrow the type the key because of the if above...
          escapeCharacter as keyof typeof simpleEscapeSequences
        ];

      continue;
    }

    // The escape sequence \u is special it encodes a specific character by its unicode id
    // Example: "\u1234" means unicode codepoint with id 1234 which translates to a specific character
    if (escapeCharacter === "u") {
      if (chars.length < index + 5) {
        throw new JsonError("Unexpected end of escape-sequence", tokens);
      }

      const unicodeEscapeSequence = chars.slice(index + 1, index + 5).join("");

      // Check validity of escape sequence only hex characters are allowed.
      if (!/^[0-9A-Fa-f]{4}$/.test(unicodeEscapeSequence)) {
        throw new JsonError("Invalid unicode escape sequence", tokens);
      }

      // Construct the unicode character from its numbers
      chars[index] = String.fromCodePoint(Number(`0x${unicodeEscapeSequence}`));

      // Delete the original escape sequence
      chars[index + 1] = "";
      chars[index + 2] = "";
      chars[index + 3] = "";
      chars[index + 4] = "";

      index += 4;

      continue;
    }

    throw new JsonError("Unrecognized escape sequence", tokens);
  }

  return chars.join("");
}
