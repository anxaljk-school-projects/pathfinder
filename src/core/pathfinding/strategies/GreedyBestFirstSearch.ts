import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { PathfindingResult, PathfindingStrategy } from "../utils/PathfindingStrategy";
import { search } from "../utils/search";
import { manhattanDistance } from "../utils/manhattan-distance";

class GreedyBestFirstSearch implements PathfindingStrategy {
  public solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult> {
    return search(
      maze, start, goal,
      frontier => {
        let minIndex = 0;
        for (let i = 1; i < frontier.length; i++) {
          if (manhattanDistance(frontier[i], goal) < manhattanDistance(frontier[minIndex], goal)) minIndex = i;
        }
        return frontier.splice(minIndex, 1)[0];
      },
      (neighbor, _current, explored) => !explored.has(neighbor.key()),
    );
  }
}

export const greedyBestFirstSearch = new GreedyBestFirstSearch();
