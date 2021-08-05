import { Node } from './Node';
import { JsonValue } from '../types';

export abstract class ScalarNode<T extends JsonValue> extends Node {
  public readonly value: T;

  public constructor(value: T) {
    super();

    this.value = value;
  }

  public toJsValue(_root: Node): JsonValue {
    return this.value;
  }
}

export type AnyScalarNode = NullScalarNode | StringScalarNode | NumberScalarNode | BooleanScalarNode;

export class NullScalarNode extends ScalarNode<null> {
  constructor() {
    super(null);
  }
}

export class StringScalarNode extends ScalarNode<string> {}

export class NumberScalarNode extends ScalarNode<number> {
  public static fromString(value: string) {
    return new NumberScalarNode(Number(value));
  }
}

export class BooleanScalarNode extends ScalarNode<boolean> {
  public static fromString(value: string) {
    if (value === 'true') {
      return new BooleanScalarNode(true);
    }

    if (value === 'false') {
      return new BooleanScalarNode(false);
    }

    throw new Error(`Invalid boolean value "${value}" could not be parsed`);
  }
}
