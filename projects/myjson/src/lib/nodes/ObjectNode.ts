import { Node } from './Node';
import { JsonObject, JsonValue } from '../types';

export class ObjectNode extends Node {
  public readonly entries: Map<string, Node>;

  public constructor() {
    super();

    this.entries = new Map();
  }

  public addEntry(entry: { key: string, value: Node }): void {
    this.entries.set(entry.key, entry.value);
  }

  public toJsValue(root: ObjectNode): JsonValue {
    const result: JsonObject = {};

    for (const [key, value] of root.entries) {
      result[key] = value.toJsValue(value);
    }

    return result;
  }
}
