import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { environment } from "../../../app/environment";
import { Events, EventType } from "../../../app/Events";
import { PathfindingResult } from "./PathfindingStrategy";

export async function search(
  maze: Maze,
  start: Vector,
  goal: Vector,
  pickNext: (frontier: Vector[]) => Vector,
  shouldAddNeighbor: (neighbor: Vector, current: Vector, explored: Set<string>) => boolean,
  onNeighborAdded: (neighbor: Vector, current: Vector) => void = () => {},
): Promise<PathfindingResult> {
  const frontier: Array<Vector> = [start];
  const explored = new Set<string>([start.key()]);
  const parent = new Map<string, Vector | null>([[start.key(), null]]);
  const exploredCells: Array<Vector> = [];

  while (frontier.length > 0) {
    const currentCell = pickNext(frontier);

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
      if (shouldAddNeighbor(neighbor, currentCell, explored)) {
        explored.add(neighbor.key());
        parent.set(neighbor.key(), currentCell);
        frontier.push(neighbor);
        onNeighborAdded(neighbor, currentCell);
      }
    }
  }

  return { path: [], exploredCells };
}
