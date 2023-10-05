export class NotFoundError extends Error {
  message: string;
  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export class ClientError extends Error {
  message: string;
  constructor(message: string) {
    super(message);

    this.message = message;
  }
}
