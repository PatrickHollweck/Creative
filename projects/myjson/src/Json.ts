import { JsonValue } from "./lib/types";

import { Node } from "./lib/nodes/Node";
import { Token } from "./lib/Token";

import { parse } from "./lib/parser";
import { tokenize } from "./lib/lexer";

export class Json {
  static deserialize(source: string): JsonValue {
    const root = this.parse(source);

    return root.toJsValue();
  }

  static tokenize(source: string): Token[] {
    return tokenize(source);
  }

  static parse(source: string): Node {
    return parse(tokenize(source));
  }
}
