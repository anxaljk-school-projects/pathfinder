import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { environment } from "../../../app/environment";
import { Events, EventType } from "../../../app/Events";
import { PathfindingResult, PathfindingStrategy } from "../utils/PathfindingStrategy";

function manhattanDistance(a: Vector, b: Vector): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

class GreedyBestFirstSearch implements PathfindingStrategy {
  public readonly name = "GBFS";

  public async solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult> {
    const frontier: Array<Vector> = [start];
    const explored = new Set<string>([start.key()]);
    const parent = new Map<string, Vector | null>([[start.key(), null]]);
    const exploredCells: Array<Vector> = [];

    while (frontier.length > 0) {
      let minIndex = 0;
      for (let i = 1; i < frontier.length; i++) {
        if (manhattanDistance(frontier[i], goal) < manhattanDistance(frontier[minIndex], goal)) {
          minIndex = i;
        }
      }
      const currentCell = frontier.splice(minIndex, 1)[0];

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

export const greedyBestFirstSearch = new GreedyBestFirstSearch();
