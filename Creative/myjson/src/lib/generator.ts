import { JsonArray, JsonObject, JsonValue } from "./types";
import { Node, ObjectNode, ArrayNode, ScalarNode } from "./nodes";

export function convertNodeToJsValue(root: Node): JsonValue {
  if (root instanceof ScalarNode) {
    return scalarToJsValue(root);
  }

  if (root instanceof ObjectNode) {
    const result: JsonObject = {};

    for (const [key, value] of root.entries) {
      result[key] = convertNodeToJsValue(value);
    }

    return result;
  }

  if (root instanceof ArrayNode) {
      const result: JsonArray = [];

      for (const value of root.children) {
          result.push(convertNodeToJsValue(value));
      }

      return result;
  }

  throw new Error(`Unknown node type "${root.constructor.name}" found while deserializing tree`);
}

function scalarToJsValue(node: ScalarNode) {
  const { type, value } = node;

  switch (type) {
    case "boolean":
      if (value === "true") {
        return true;
      }

      if (value === "false") {
        return false;
      }

      throw new Error(`Invalid boolean value "${value}" found.`);
    case "null":
      return null;
    case "number":
      return parseInt(value as string, 10);
    case "string":
      return value;
    default:
      throw new Error(`Unknown node of type "${type}" cannot be converted to a js value`);
  }
}
