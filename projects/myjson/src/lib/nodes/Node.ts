import { JsonValue } from "../types";

/**
 * Simple node base class.
 *
 * This class mainly exists to make typing a little easier.
 */
export abstract class Node {
  public abstract toJsValue(root: Node): JsonValue;
}
