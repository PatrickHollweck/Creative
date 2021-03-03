import { Node } from './Node';

export class ScalarNode extends Node {
  public readonly type: string;
  public readonly value: string;

  public constructor(type: string, value: string) {
    super();

    this.type = type;
    this.value = value;
  }
}
