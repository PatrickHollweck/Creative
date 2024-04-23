import { TokenList } from "./util/TokenList";
import { Node, AnyScalarNode, ArrayNode, ObjectNode, StringScalarNode } from "./nodes";

import { JsonParserError } from "./util/JsonParserError";
import { JsonStringError } from "./util/JsonStringError";

export function parse(tokens: TokenList): Node {
  const rootNode = parseSingle(tokens);

  if (tokens.length > 0) {
    throw new JsonParserError("Unexpected tokens at the end of source", tokens);
  }

  return rootNode;
}

export function parseSingle(tokens: TokenList): Node {
  if (tokens.length === 0) {
    throw new JsonParserError("Unexpected end of source!", tokens);
  }

  const initialToken = tokens.get(0);

  if (initialToken.isScalar || initialToken.isString) {
    return tokens.next().value as AnyScalarNode;
  }

  if (initialToken.isObjectOpen) {
    return parseObject(tokens);
  }

  if (initialToken.isArrayOpen) {
    return parseArray(tokens);
  }

  throw new JsonParserError(`Could not parse token at this location`, tokens);
}

function parseArray(tokens: TokenList): ArrayNode {
  const arrayNode = new ArrayNode();

  // Removes the opening "[" token.
  tokens.next();

  const firstToken = tokens.get(0);

  // Empty Array, exit early.
  if (firstToken && firstToken.isArrayClose) {
    tokens.next();

    return arrayNode;
  }

  while (tokens.length > 0) {
    arrayNode.addChild(parseSingle(tokens));

    // The next token is either a comma or it is the closing bracket.
    // In both cases the token needs to be removed. We just need to keep it around
    // to check if it is a comma.
    const nextToken = tokens.next();

    // If the next token "after" the value is not a comma, we do not expect
    // any more values. Technically we don't even need the comma, but we stick
    // to the standard strictly.
    if (nextToken && nextToken.isComma) {
      continue;
    }

    if (nextToken && nextToken.isArrayClose) {
      return arrayNode;
    }

    throw new JsonParserError("Additional comma at end of array entries", tokens);
  }

  throw new JsonParserError(
    "Unexpected token at the end of an array entry, most likely a missing comma",
    tokens,
  );
}

function parseObject(tokens: TokenList) {
  const objectNode = new ObjectNode();

  tokens.next();

  const firstToken = tokens.get(0);

  // Empty Object, exit early
  if (firstToken && firstToken.isObjectClose) {
    tokens.next();

    return objectNode;
  }

  while (tokens.length > 0) {
    objectNode.addEntry(parseObjectEntry(tokens));

    const nextToken = tokens.next();

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

    throw new JsonParserError(
      "Unexpected token at the end of an object entry, most likely a missing comma",
      tokens,
    );
  }

  throw new JsonParserError("Unexpected end of source, while parsing object", tokens);
}

function parseObjectEntry(tokens: TokenList) {
  const keyToken = tokens.next();
  const separatorToken = tokens.next();

  if (!keyToken || !keyToken.isString) {
    throw new JsonParserError(
      `Unexpected token ("${keyToken.value}") used as object key`,
      tokens,
    );
  }

  if (!separatorToken || !separatorToken.isColon) {
    throw new JsonParserError(
      `Unexpected token ("${separatorToken.value}") used as object key-value separator`,
      tokens,
    );
  }

  return {
    key: (keyToken.value as StringScalarNode).toJsValue() as string,
    value: parseSingle(tokens),
  };
}

export function prepareString(value: string): string {
  // Short-circuit optimization - If the string contains no backslash
  // then it cannot include escape sequences that would need to be parsed.
  if (value.indexOf("\\") === -1 && value.indexOf("	") === -1) {
    return value;
  }

  // TODO: Optimize this!
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
      throw new JsonStringError(
        "Invalid characters in string. Control characters must be escaped!",
        value,
      );
    }

    // If this character is not the start of an escape sequence continue straight away...
    if (element !== "\\") {
      continue;
    }

    // Escape sequences have a minimum length of one. Example: \n
    if (chars.length <= index + 1) {
      throw new JsonStringError("Unexpected end of escape-sequence", value);
    }

    // This specifies which escape sequence is used.
    const escapeCharacter = chars[index + 1];

    // The backslash that initiates the escape sequence is always removed...
    chars[index] = "";
    index++;

    if (
      escapeCharacter === "\\" ||
      escapeCharacter === '"' ||
      escapeCharacter === "/" ||
      escapeCharacter === "b" ||
      escapeCharacter === "f" ||
      escapeCharacter === "n" ||
      escapeCharacter === "r" ||
      escapeCharacter === "t" ||
      escapeCharacter === '"'
    ) {
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
        throw new JsonStringError("Unexpected end of escape-sequence", value);
      }

      const unicodeEscapeSequence = chars.slice(index + 1, index + 5).join("");

      // Check validity of escape sequence only hex characters are allowed.
      if (!/^[0-9A-Fa-f]{4}$/.test(unicodeEscapeSequence)) {
        throw new JsonStringError("Invalid unicode escape sequence", value);
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

    throw new JsonStringError("Unrecognized escape sequence", value);
  }

  return chars.join("");
}
