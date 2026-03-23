import { Vector } from "./Vector";

export class Maze {
  public readonly width: number;
  public readonly height: number;
  private obstacles: Set<string>;

  public constructor(width: number, height: number, obstacles: Array<Vector> = []) {
    this.width = width;
    this.height = height;
    this.obstacles = new Set(obstacles.map(obstacle => obstacle.key()));
  }

  public isObstacle(position: Vector) {
    return this.obstacles.has(position.key());
  }

  public addObstacle(position: Vector) {
    this.obstacles.add(position.key());
  }

  public getFreeNeighbouringVectors(position: Vector): Array<Vector> {
    const candidates = [
      new Vector(position.x, position.y - 1),
      new Vector(position.x, position.y + 1),
      new Vector(position.x + 1, position.y),
      new Vector(position.x - 1, position.y),
    ];

    return candidates.filter(vector =>
      vector.x >= 0 && vector.x < this.width &&
      vector.y >= 0 && vector.y < this.height &&
      !this.isObstacle(vector)
    );
  }

  public getRandomFreeCell(): Vector {
    while (true) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);

      const vector = new Vector(x, y);

      if (!this.isObstacle(vector)) {
        return vector;
      }
    }
  }
}
