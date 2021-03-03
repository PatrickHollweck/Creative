import { parse } from './lib/parser';
import { tokenize } from "./lib/lexer";
import { convertNodeToJsValue } from './lib/generator';

export class Json {
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  static fromString(source: string) {
    return new Json(source).processSource();
  }

  processSource() {
    const tokens = tokenize(this.source);
    const ast = parse(tokens);
    const jsValue = convertNodeToJsValue(ast);

    return jsValue;
  }
}
