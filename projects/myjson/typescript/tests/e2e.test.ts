import { Json } from "../src/Json";

describe("End2End", () => {
  test("Simple Object", () => {
    const source = '{ "name": "Patrick" }';

    expect(Json.deserialize(source)).toEqual({
      name: "Patrick",
    });
  });

  test("Scalar Values", () => {
    expect(Json.deserialize('"Patrick"')).toEqual("Patrick");
    expect(Json.deserialize("true")).toEqual(true);
    expect(Json.deserialize("false")).toEqual(false);
    expect(Json.deserialize("10")).toEqual(10);
    expect(Json.deserialize("null")).toEqual(null);
  });

  test("String Formats", () => {
    expect(() => Json.deserialize('"Hello \\a World"')).toThrow();

    expect(() => Json.deserialize('["\\n"]')).not.toThrow();
    expect(() => Json.deserialize('["\\\\n"]')).not.toThrow();
  });

  test("Number Formats", () => {
    // Basic
    expect(Json.deserialize("0")).toEqual(0);
    expect(Json.deserialize("1")).toEqual(1);
    expect(Json.deserialize("100")).toEqual(100);
    expect(Json.deserialize("8747540")).toEqual(8747540);

    // Large Numbers
    expect(Json.deserialize("-9223372036854775808")).toEqual(-9223372036854775808);

    // Negatives
    expect(Json.deserialize("-10")).toEqual(-10);

    // Fractions
    expect(Json.deserialize("0.178")).toEqual(0.178);

    // Exponents
    expect(Json.deserialize("2e10")).toEqual(2e10);
    expect(Json.deserialize("2E10")).toEqual(2e10);
    expect(Json.deserialize("2E+10")).toEqual(2e10);
    expect(Json.deserialize("10e001")).toEqual(100);
    expect(Json.deserialize("123.456e-789")).toEqual(123.456e-789);

    // Invalid Basic
    expect(() => Json.deserialize("-")).toThrow();
    expect(() => Json.deserialize("+178")).toThrow();

    // Invalid Fractions
    expect(() => Json.deserialize("1,178")).toThrow();
    expect(() => Json.deserialize("01.178")).toThrow();
    expect(() => Json.deserialize(".178")).toThrow();
    expect(() => Json.deserialize("-01.715")).toThrow();

    // Invalid Exponents
    expect(() => Json.deserialize("10e")).toThrow();
    expect(() => Json.deserialize("10e1.001")).toThrow();
    expect(() => Json.deserialize("10e0.41")).toThrow();
    expect(() => Json.deserialize("10e10e10")).toThrow();

    // Invalid negatives
    expect(() => Json.deserialize("1-0")).toThrow();
  });

  test("String Formats", () => {
    // Unicode support
    expect(Json.deserialize('"😀"')).toEqual("😀");
    expect(Json.deserialize('"äöü"')).toEqual("äöü");
    expect(Json.deserialize('"Привет"')).toEqual("Привет");
    expect(Json.deserialize('"与熊见面"')).toEqual("与熊见面");
    expect(Json.deserialize('"γειασας"')).toEqual("γειασας");

    // Whitespace
    expect(Json.deserialize('"Hello World"')).toEqual("Hello World");
  });

  test("Mixed Types", () => {
    const source = '{ "name": "Patrick", "age": 20, "hobbies": ["IT", "cycling"] }';

    expect(Json.deserialize(source)).toEqual({
      name: "Patrick",
      age: 20,
      hobbies: ["IT", "cycling"],
    });
  });

  test("Nested Arrays", () => {
    const source = '{ "names": [["A", "B"], ["C", "D"]] }';

    expect(Json.deserialize(source)).toEqual({
      names: [
        ["A", "B"],
        ["C", "D"],
      ],
    });
  });

  test("Nested Objects", () => {
    const source = '{ "pets": { "name": { "first": "A", "last": "B" } } }';

    expect(Json.deserialize(source)).toEqual({
      pets: {
        name: {
          first: "A",
          last: "B",
        },
      },
    });
  });

  test("Empty Array", () => {
    const source = "[]";

    expect(Json.deserialize(source)).toEqual([]);
  });

  test("Empty Object", () => {
    const source = "{}";

    expect(Json.deserialize(source)).toEqual({});
  });

  test("Missing comma between object key and value", () => {
    const source = '{ "hello" "world" }';

    expect(() => Json.deserialize(source)).toThrow();
  });

  test("Mismatched parens", () => {
    expect(() => Json.deserialize('{ "pets": {}}, "name": "A" }')).toThrow();

    expect(() => Json.deserialize('{ "pets": [[], "name": "A" }')).toThrow();
  });

  test("Missing Comma", () => {
    const source = '{ "pets": ["A" "B"] }';

    expect(() => Json.deserialize(source)).toThrow();
  });
});
