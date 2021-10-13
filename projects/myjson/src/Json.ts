import { JsonValue } from "./lib/types";

import { parse } from "./lib/parser";
import { tokenize } from "./lib/lexer";

export class Json {
  static parse(source: string): JsonValue {
    const tokens = tokenize(source);
    const ast = parse(tokens);

    return ast.toJsValue(ast);
  }
}
