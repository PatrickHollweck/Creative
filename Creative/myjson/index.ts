import { Json } from "./lib-json/Json";

function main() {
  console.log(
    Json.fromString('{ "isAdmin": false, "id": 591, "names": ["patrick", "hubert"] }')
  );
}

main();
