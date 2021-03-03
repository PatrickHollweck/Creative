import { Token } from "./lexer";

export class Node {}

export class ScalarNode extends Node {
  public readonly type: string;
  public readonly value: any;

  public constructor(type: string, value: any) {
    super();

    this.type = type;
    this.value = value;
  }
}

export class ObjectNode extends Node {
  public readonly entries: Map<string, Node>;

  public constructor() {
    super();

    this.entries = new Map();
  }

  public addEntry(key: string, value: Node) {
    this.entries.set(key, value);
  }
}

export class ArrayNode extends Node {
  public readonly children: Node[];

  public constructor() {
    super();

    this.children = [];
  }

  public addChild(value: Node) {
    this.children.push(value);
  }
}

export function parse(tokens: Token[]) {
  if (tokens.length === 0) {
    throw new Error("Unexpected end of source!");
  }

  const { type, value } = tokens[0];

  if (type !== "punctuation") {
    return parseScalar(tokens);
  }

  if (value === "{") {
    return parseObject(tokens);
  }

  if (value === "[") {
    return parseArray(tokens);
  }

  throw new Error(`Could not parse token '${type}' at this location`);
}

function parseScalar(tokens: Token[]) {
  const { type, value } = tokens[0];
  
  const scalar = new ScalarNode(type, value);

  tokens.shift();

  return scalar;
}

function parseArray(tokens: Token[]) {
  const arrayNode = new ArrayNode();
  
  tokens.shift();

  while (true) {
    const { type, value } = tokens[0];

    if (type === "punctuation" && value === "]") {
      tokens.shift();

      return arrayNode;
    }

    // TODO: Check if this works with nested arrays.
    if (type === "punctuation" && value === ",") {
      tokens.shift();
    }

    const entry = parseArrayEntry(tokens);

    arrayNode.addChild(entry);

    tokens.shift();
  }
}

function parseArrayEntry(tokens: Token[]) {
  return parse(tokens);
}

function parseObject(tokens: Token[]) {
  const objectNode = new ObjectNode();

  tokens.shift();

  while (true) {
    const { type, value } = tokens[0];

    if (type === "punctuation" && value === "}") {
      tokens.shift();

      return objectNode;
    }

    if (type === "punctuation" && value === ",") {
      tokens.shift();
    }

    // TODO: Check if this works with nested objects.
    const entry = parseObjectEntry(tokens);

    objectNode.addEntry(
      entry.key,
      entry.value
    );

    tokens.shift();
  }

  throw new Error("Unexpected end of source, while parsing object!");
}

function parseObjectEntry(tokens: Token[]) {
  const [keyToken, seperatorToken, ...rest] = tokens;

  if (!keyToken || keyToken.type !== "string") {
    throw new Error(
      `Unexpected token of type "${keyToken.type}" ("${keyToken.value}") on object key`
    );
  }

  if (!seperatorToken || seperatorToken.type !== "punctuation" && seperatorToken.value === ":") {
    throw new Error(
      `Unexpected token of type "${seperatorToken.type}" ("${seperatorToken.value}") as object key-value seperator`
    );
  }

  tokens.splice(0, 2);

  const scalarNode = parse(rest);

  return {
    key: keyToken.value,
    value: scalarNode
  };
}
