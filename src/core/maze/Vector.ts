export class Vector {
  constructor(public readonly x: number,  public readonly y: number) {
  }

  public key(): string {
    return `${this.x},${this.y}`;
  }
}
