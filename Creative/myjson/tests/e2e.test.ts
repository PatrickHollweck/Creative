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

    test("Empty Array", () => {
        const source = '[]';

        expect(Json.parse(source)).toEqual([]);
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

    test("Missmatched parens", () => {
        const source = '{ "pets": {} "name": { "first": "A", "last": "B" } } }';

        expect(Json.parse(source)).toThrow();
    });

    test("Empty Object", () => {
        const source = '{}';

        expect(Json.parse(source)).toEqual({});
    });

    test("Missing Comma", () => {
        const source = '{ "pets": ["A" "B"] }';

        expect(() => Json.parse(source)).toThrow();
    });
});
