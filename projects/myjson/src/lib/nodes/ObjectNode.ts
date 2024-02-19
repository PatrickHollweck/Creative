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

    for (const [key, value] of this.entries) {
      result[key] = value.toJsValue();
    }

    return result;
  }

  toJSON() {
    return this.toJsValue();
  }
}
