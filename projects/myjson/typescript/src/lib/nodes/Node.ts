import { JsonValue } from "../types";

/**
 * Simple node base class.
 *
 * This class mainly exists to make typing a little easier.
 */
export abstract class Node {
  public abstract toJsValue(): JsonValue;

  public toJSON() {
    const name = this.constructor.name;

    return {
      name: name,
      value: this.toJsValue(),
    };
  }
}
