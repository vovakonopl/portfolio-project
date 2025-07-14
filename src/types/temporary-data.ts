export class TemporaryData<T> {
  public data: T;
  readonly storedAt: number; // in milliseconds

  constructor(data: T) {
    this.data = data;
    this.storedAt = Date.now();
  }
}
