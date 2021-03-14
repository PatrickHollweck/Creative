import { Node } from './Node';

export class ObjectNode extends Node {
  public readonly entries: Map<string, Node>;

  public constructor() {
    super();

    this.entries = new Map();
  }

  public addEntry(entry: { key: string, value: Node }): void {
    this.entries.set(entry.key, entry.value);
  }
}
