export class JsonLexerError extends Error {
  constructor(message: string, source: string, cursor: number) {
    super(
      `Failed to parse:\nReason: ${message}\nLocation: ${source.substring(cursor - 2, cursor + 100)}\n            ^`,
    );
  }
}
