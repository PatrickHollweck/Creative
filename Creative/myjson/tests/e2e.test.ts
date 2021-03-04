import { Json } from "../src/Json";

describe("End2End", () => {
    test("Simple Object", () => {
        const source = '{ "name": "Patrick" }';

        expect(Json.parse(source)).toEqual({
            name: "Patrick"
        });
    });

    test("Scalar Values", () => {
        expect(Json.parse('"Patrick"')).toEqual("Patrick");
        expect(Json.parse("true")).toEqual(true);
        expect(Json.parse("false")).toEqual(false);
        expect(Json.parse("10")).toEqual(10);
        expect(Json.parse("null")).toEqual(null);
    });

    test("Number Formats", () => {
        // Basic
        expect(Json.parse("0")).toEqual(0);
        expect(Json.parse("1")).toEqual(1);
        expect(Json.parse("100")).toEqual(100);
        expect(Json.parse("8747540")).toEqual(8747540);

        // Large Numbers
        expect(Json.parse("-9223372036854775808")).toEqual(-9223372036854775808);

        // Negatives
        expect(Json.parse("-10")).toEqual(-10);

        // Fractions
        expect(Json.parse("0.178")).toEqual(0.178);

        // Exponents
        expect(Json.parse("2e10")).toEqual(2e10);
        expect(Json.parse("2E10")).toEqual(2E10);
        expect(Json.parse("2E+10")).toEqual(2E10);
        expect(Json.parse("123.456e-789")).toEqual(123.456e-789);

        // Invalid Basic
        expect(() => Json.parse("+178")).toThrow();

        // Invalid Fractions
        expect(() => Json.parse("1,178")).toThrow();
        expect(() => Json.parse("01.178")).toThrow();
        expect(() => Json.parse("-01.715")).toThrow();

        // Invalid Exponents
        expect(() => Json.parse("10e0.41")).toThrow();
        expect(() => Json.parse("10e10e10")).toThrow();

        // Invalid negatives
        expect(() => Json.parse("1-0")).toThrow();
    });

    test("String Formats", () => {
        // Unicode support
        expect(Json.parse('"😀"')).toEqual("😀");
        expect(Json.parse('"äöü"')).toEqual("äöü");
        expect(Json.parse('"Привет"')).toEqual("Привет");
        expect(Json.parse('"与熊见面"')).toEqual("与熊见面");
        expect(Json.parse('"γειασας"')).toEqual("γειασας");

        // Whitespace
        expect(Json.parse('"Hello World"')).toEqual("Hello World");
    });

    test("Mixed Types", () => {
        const source = '{ "name": "Patrick", "age": 20, "hobbies": ["IT", "cycling"] }';

        expect(Json.parse(source)).toEqual({
            name: "Patrick",
            age: 20,
            hobbies: ["IT", "cycling"],
        });
    });

    test('Nested Arrays', () => {
        const source = '{ "names": [["A", "B"], ["C", "D"]] }';

        expect(Json.parse(source)).toEqual({
            names: [
                ["A", "B"],
                ["C", "D"]
            ]
        });
    });

    test("Nested Objects", () => {
        const source = '{ "pets": { "name": { "first": "A", "last": "B" } } }';

        expect(Json.parse(source)).toEqual({
            pets: {
                name: {
                    first: "A",
                    last: "B"
                }
            }
        });
    });

    test("Empty Array", () => {
        const source = '[]';

        expect(Json.parse(source)).toEqual([]);
    });

    test("Empty Object", () => {
        const source = '{}';

        expect(Json.parse(source)).toEqual({});
    });

    test("Missing comma between object key and value", () => {
        const source = '{ "hello" "world" }';

        expect(() => Json.parse(source)).toThrow();
    });

    test("Missmatched parens", () => {
        expect(
            () => Json.parse('{ "pets": {}}, "name": "A" }')
        ).toThrow();

        expect(
            () => Json.parse('{ "pets": [[], "name": "A" }')
        ).toThrow();
    });

    test("Missing Comma", () => {
        const source = '{ "pets": ["A" "B"] }';

        expect(() => Json.parse(source)).toThrow();
    });
});
