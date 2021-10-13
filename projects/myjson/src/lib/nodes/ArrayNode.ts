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

  public toJsValue(root: ArrayNode): JsonValue {
    const result: JsonArray = [];

    for (const value of root.children) {
      result.push(value.toJsValue(value));
    }

    return result;
  }
}
