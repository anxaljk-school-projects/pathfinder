import { Vector } from "../../maze/Vector";

export function manhattanDistance(a: Vector, b: Vector): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
