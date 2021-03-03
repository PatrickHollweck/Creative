import { parse } from './lib/parser';
import { tokenize } from "./lib/lexer";
import { convertNodeToJsValue } from './lib/generator';
import { JsonValue } from './lib/types';

export class Json {
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  static parse(source: string): JsonValue {
    return new Json(source).processSource();
  }

  processSource(): JsonValue {
    const tokens = tokenize(this.source);
    const ast = parse(tokens);
    const jsValue = convertNodeToJsValue(ast);

    return jsValue;
  }
}
