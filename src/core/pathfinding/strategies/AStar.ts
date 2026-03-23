import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { PathfindingResult, PathfindingStrategy } from "../utils/PathfindingStrategy";
import { search } from "../utils/search";
import { manhattanDistance } from "../utils/manhattan-distance";

class AStar implements PathfindingStrategy {
  public solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult> {
    const costFromStart = new Map<string, number>([[start.key(), 0]]);

    return search(
      maze, start, goal,
      frontier => {
        let bestIndex = 0;
        for (let i = 1; i < frontier.length; i++) {
          const candidateScore = costFromStart.get(frontier[i].key())! + manhattanDistance(frontier[i], goal);
          const bestScore = costFromStart.get(frontier[bestIndex].key())! + manhattanDistance(frontier[bestIndex], goal);
          if (candidateScore < bestScore) bestIndex = i;
        }
        return frontier.splice(bestIndex, 1)[0];
      },
      (neighbor, current, explored) => {
        const newCost = costFromStart.get(current.key())! + 1;
        return !explored.has(neighbor.key()) || newCost < costFromStart.get(neighbor.key())!;
      },
      (neighbor, current) => {
        costFromStart.set(neighbor.key(), costFromStart.get(current.key())! + 1);
      },
    );
  }
}

export const aStar = new AStar();
