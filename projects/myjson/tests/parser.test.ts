import { Json } from "../src/Json";

test("Parser", () => {
  const source = '{ "name": "Patrick", "age": 20, "hobbies": ["IT", "cycling"] }';

  expect(Json.parse(source)).toEqual({
    name: "Patrick",
    age: 20,
    hobbies: ["IT", "cycling"],
  });
});
