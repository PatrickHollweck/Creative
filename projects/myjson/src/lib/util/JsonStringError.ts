export class JsonStringError extends Error {
  constructor(message: string, value: string) {
    super(formatMessage(message, value));
  }
}

function formatMessage(message: string, value: string): string {
  return `Could not validate JSON string!\nReason: ${message}\nSource point: ${value}\n              ^`;
}
