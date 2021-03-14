import { JsonValue } from './lib/types';

import { parse } from './lib/parser';
import { tokenize } from "./lib/lexer";
import { convertNodeToJsValue } from './lib/generator';

export class Json {
  static parse(source: string): JsonValue {
    const tokens = tokenize(source);
    const ast = parse(tokens);
    const jsValue = convertNodeToJsValue(ast);

    return jsValue;
  }
}
