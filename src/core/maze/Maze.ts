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
}
