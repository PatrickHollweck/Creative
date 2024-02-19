import { Node } from "./Node";
import { JsonArray, JsonValue } from "../types";

export class ArrayNode extends Node {
  public readonly children: Node[];

  public constructor() {
    super();

    this.children = [];
  }

  public addChild(value: Node): void {
    this.children.push(value);
  }

  public toJsValue(): JsonValue {
    const result: JsonArray = [];

    for (const value of this.children) {
      result.push(value.toJsValue());
    }

    return result;
  }
}
