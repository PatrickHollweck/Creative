import { Node } from './Node';

export class ArrayNode extends Node {
  public readonly children: Node[];

  public constructor() {
    super();

    this.children = [];
  }

  public addChild(value: Node): void {
    this.children.push(value);
  }
}
