import { Vector } from "../../maze/Vector";
import { Maze } from "../../maze/Maze";
import { PathfindingResult, PathfindingStrategy } from "../utils/PathfindingStrategy";
import { search } from "../utils/search";

class DepthFirstSearch implements PathfindingStrategy {
  public solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult> {
    return search(
      maze, start, goal,
      frontier => frontier.pop()!,
      (neighbor, _current, explored) => !explored.has(neighbor.key()),
    );
  }
}

export const depthFirstSearch = new DepthFirstSearch();
