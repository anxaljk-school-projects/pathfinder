import { Maze } from '../core/maze/Maze';
import { PathfindingStrategy } from '../core/pathfinding/utils/PathfindingStrategy';
import { Events, EventType } from './Events';
import { Vector } from "../core/maze/Vector";

export class MazeSolver {
  private readonly maze: Maze;
  private startPosition: Vector | null = null;
  private goalPosition: Vector | null = null;
  private strategy: PathfindingStrategy | null = null;

  constructor(maze: Maze) {
    this.maze = maze;
  }

  setStartPosition(startPosition: Vector): void {
    this.startPosition = startPosition;
    Events.emit(EventType.START_POSITION_CHANGED, startPosition);
  }

  setGoalPosition(endPosition: Vector): void {
    this.goalPosition = endPosition;
    Events.emit(EventType.GOAL_POSITION_CHANGED, endPosition);
  }

  setStrategy(newStrategy: PathfindingStrategy) {
    this.strategy = newStrategy;
    Events.emit(EventType.STRATEGY_CHANGED, this.strategy.name);
  }

  async run() {
    if (!this.startPosition || !this.goalPosition || !this.strategy) {
      Events.emit(EventType.MISSING_INFORMATION);
    } else {
      const result = await this.strategy.solve(this.maze, this.startPosition, this.goalPosition);
      for (const cell of result.path) {
        Events.emit(EventType.FINAL_PATH_ADDED, cell);
      }
    }
  }
}
