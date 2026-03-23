import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { environment } from "../../../app/environment";
import { Events, EventType } from "../../../app/Events";
import { PathfindingResult, PathfindingStrategy } from "../utils/PathfindingStrategy";

class BreadthFirstSearch implements PathfindingStrategy {
  public readonly name = "BFS";

  public async solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult> {
    const frontier: Array<Vector> = [start];
    const explored = new Set<string>([start.key()]);
    const parent = new Map<string, Vector | null>([[start.key(), null]]);
    const exploredCells: Array<Vector> = [];

    while (frontier.length > 0) {
      const currentCell = frontier.shift()!;

      if (currentCell.key() === goal.key()) {
        const path: Array<Vector> = [];
        let backtrackTarget: Vector | null = currentCell;
        while (backtrackTarget) {
          path.unshift(backtrackTarget);
          backtrackTarget = parent.get(backtrackTarget.key()) ?? null;
        }
        return { path, exploredCells };
      }

      Events.emit(EventType.EXPLORED_FIELD_ADDED, currentCell);
      exploredCells.push(currentCell);
      await new Promise(resolve => setTimeout(resolve, environment.strategyStepTimeout));

      for (const neighbor of maze.getFreeNeighbouringVectors(currentCell)) {
        if (!explored.has(neighbor.key())) {
          explored.add(neighbor.key());
          parent.set(neighbor.key(), currentCell);
          frontier.push(neighbor);
        }
      }
    }

    return { path: [], exploredCells };
  }
}

export const breadthFirstSearch = new BreadthFirstSearch()
