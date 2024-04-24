import { Token } from "../Token";

// This is effectively an ArrayView implementation
// It has some extra functionality that makes it
// more ergonomic when using it in a parser context.
export class TokenList {
  private tokens: Token[];
  private position: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.position = 0;
  }

  get length() {
    return this.tokens.length - this.position;
  }

  get(index: number) {
    return this.tokens[this.position + index];
  }

  next() {
    this.position++;

    return this.tokens[this.position - 1];
  }

  asArray() {
    // There is no way to return just the elements "after" the current position
    // without mutating the array or making copies. Therefore we use this opportunity
    // to mutate the current array as a "cleanup" measure and return that.

    this.tokens = this.tokens.splice(0, this.position);
    this.position = 0;

    return this.tokens;
  }
}
