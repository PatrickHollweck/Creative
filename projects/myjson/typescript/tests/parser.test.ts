import { Json } from "../src/Json";

test("Parser", () => {
  const source = '{ "name": "Patrick", "age": 20, "hobbies": ["IT", "cycling"] }';

  expect(Json.deserialize(source)).toEqual({
    name: "Patrick",
    age: 20,
    hobbies: ["IT", "cycling"],
  });
});
