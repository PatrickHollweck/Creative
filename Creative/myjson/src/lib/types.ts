export type JsonScalar = boolean | number | string | null;

export type JsonObject = { [key: string]: JsonValue };

export type JsonArray = JsonValue[];

export type JsonValue = JsonObject | JsonArray | JsonScalar;
