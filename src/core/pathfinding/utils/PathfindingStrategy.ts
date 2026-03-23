import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";

export interface PathfindingResult {
  path: Array<Vector>;
  exploredCells: Array<Vector>;
}

export interface PathfindingStrategy {
  name: string;
  solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult>;
}
