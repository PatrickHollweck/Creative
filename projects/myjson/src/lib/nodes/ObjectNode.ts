import { Node } from "./Node";
import { JsonObject, JsonValue } from "../types";

export class ObjectNode extends Node {
  public readonly entries: Map<string, Node>;

  public constructor() {
    super();

    this.entries = new Map();
  }

  public addEntry(entry: { key: string; value: Node }): void {
    this.entries.set(entry.key, entry.value);
  }

  public toJsValue(): JsonValue {
    const result: JsonObject = {};

    this.entries.forEach((value, key) => {
      result[key] = value.toJsValue();
    });

    return result;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      value: this.toJsValue(),
    };
  }
}
