import { Node } from "./Node";
import { JsonValue } from "../types";

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

export class StringScalarNode extends ScalarNode<string> {}

export class NumberScalarNode extends ScalarNode<number> {
  public static fromString(value: string): NumberScalarNode {
    return new NumberScalarNode(parseInt(value));
  }
}

export class BooleanScalarNode extends ScalarNode<boolean> {
  public static fromString(value: string): BooleanScalarNode {
    if (value === "true") {
      return BOOL_NODE_TRUE;
    }

    if (value === "false") {
      return BOOL_NODE_FALSE;
    }

    throw new Error(`Invalid boolean value "${value}" could not be parsed`);
  }
}

const BOOL_NODE_TRUE = new BooleanScalarNode(true);
const BOOL_NODE_FALSE = new BooleanScalarNode(false);
