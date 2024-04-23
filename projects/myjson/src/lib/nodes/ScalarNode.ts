import { Node } from "./Node";
import { JsonValue } from "../types";
import { prepareString } from "../parser";

export abstract class ScalarNode<T extends JsonValue> extends Node {
  public readonly value: T;

  public constructor(value: T) {
    super();

    this.value = value;
  }

  public toJsValue(): JsonValue {
    return this.value;
  }
}

export type AnyScalarNode =
  | NullScalarNode
  | StringScalarNode
  | NumberScalarNode
  | BooleanScalarNode;

export class NullScalarNode extends ScalarNode<null> {
  constructor() {
    super(null);
  }
}

export class BooleanScalarNode extends ScalarNode<boolean> {}

export class StringScalarNode extends ScalarNode<string> {
  public toJsValue(): JsonValue {
    return prepareString(this.value);
  }
}

export class NumberScalarNode extends ScalarNode<number> {
  public static fromString(value: string): NumberScalarNode {
    return new NumberScalarNode(parseFloat(value));
  }
}

export const NODE_BOOL_TRUE = new BooleanScalarNode(true);
export const NODE_BOOL_FALSE = new BooleanScalarNode(false);
export const NODE_NULL = new NullScalarNode();
