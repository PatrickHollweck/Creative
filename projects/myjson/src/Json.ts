import { Node } from "./lib/nodes/Node";
import { parse } from "./lib/parser";
import { tokenize } from "./lib/lexer";
import { JsonValue } from "./lib/types";
import { TokenList } from "./lib/util/TokenList";

export class Json {
  static deserialize(source: string): JsonValue {
    const root = this.parse(source);

    return root.toJsValue();
  }

  static tokenize(source: string): TokenList {
    return tokenize(source);
  }

  static parse(source: string): Node {
    return parse(tokenize(source));
  }
}
