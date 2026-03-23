import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { environment } from "../../../app/environment";
import { Events, EventType } from "../../../app/Events";
import { PathfindingResult, PathfindingStrategy } from "../utils/PathfindingStrategy";
import { manhattanDistance } from "../utils/manhattan-distance";

class AStar implements PathfindingStrategy {
  public readonly name = "A*";

  public async solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult> {
    const frontier: Array<Vector> = [start];
    const explored = new Set<string>([start.key()]);
    const parent = new Map<string, Vector | null>([[start.key(), null]]);
    const costFromStart = new Map<string, number>([[start.key(), 0]]);
    const exploredCells: Array<Vector> = [];

    while (frontier.length > 0) {
      let bestIndex = 0;
      for (let i = 1; i < frontier.length; i++) {
        const candidateScore = costFromStart.get(frontier[i].key())! + manhattanDistance(frontier[i], goal);
        const bestScore = costFromStart.get(frontier[bestIndex].key())! + manhattanDistance(frontier[bestIndex], goal);
        if (candidateScore < bestScore) bestIndex = i;
      }
      const currentCell = frontier.splice(bestIndex, 1)[0];

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
        const newCostFromStart = costFromStart.get(currentCell.key())! + 1;
        if (!explored.has(neighbor.key()) || newCostFromStart < costFromStart.get(neighbor.key())!) {
          explored.add(neighbor.key());
          costFromStart.set(neighbor.key(), newCostFromStart);
          parent.set(neighbor.key(), currentCell);
          frontier.push(neighbor);
        }
      }
    }

    return { path: [], exploredCells };
  }
}

export const aStar = new AStar();
