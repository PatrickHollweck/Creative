import { Token } from "../src/lib/Token";
import { TokenList } from "../src/lib/util/TokenList";

const tokenA = new Token("string", "a");
const tokenB = new Token("punctuation", "}");

describe("The TokenList", () => {
  it("should calculate its length", () => {
    const tokens = new TokenList([tokenA, tokenB]);

    expect(tokens.length).toEqual(2);
  });

  it("should get a token by index", () => {
    const tokens = new TokenList([tokenA, tokenB]);

    expect(tokens.get(0)).toEqual(tokenA);
    expect(tokens.get(1)).toEqual(tokenB);
  });

  it("should shift tokens", () => {
    const tokens = new TokenList([tokenA, tokenB]);

    expect(tokens.length).toEqual(2);
    expect(tokens.next()).toEqual(tokenA);
    expect(tokens.length).toEqual(1);
    expect(tokens.next()).toEqual(tokenB);
    expect(tokens.length).toEqual(0);
  });
});
