import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { PathfindingResult, PathfindingStrategy } from "../utils/PathfindingStrategy";
import { search } from "../utils/search";

class BreadthFirstSearch implements PathfindingStrategy {
  public solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult> {
    return search(
      maze, start, goal,
      frontier => frontier.shift()!,
      (neighbor, _current, explored) => !explored.has(neighbor.key()),
    );
  }
}

export const breadthFirstSearch = new BreadthFirstSearch();
