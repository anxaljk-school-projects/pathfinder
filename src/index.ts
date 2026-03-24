import { generateMaze } from "./ui/maze-generator";
import { environment } from "./app/environment";
import { MazeSolver } from "./app/MazeSolver";
import { drawCell, drawMaze } from "./ui/draw-cells";
import { Maze } from "./core/maze/Maze";
import { Events, EventType } from "./app/Events";
import { Vector } from "./core/maze/Vector";
import { depthFirstSearch } from "./core/pathfinding/strategies/DepthFirstSearch";
import { breadthFirstSearch } from "./core/pathfinding/strategies/BreadthFirstSearch";
import { greedyBestFirstSearch } from "./core/pathfinding/strategies/GreedyBestFirstSearch";
import { aStar } from "./core/pathfinding/strategies/AStar";

let mazeSolver: MazeSolver | null = null;
let maze: Maze | null = null;
let mazeWidth: number = environment.mazeMaxWidth;
let mazeHeight: number = environment.mazeMaxHeight;
let start: Vector | null = null;
let goal: Vector | null = null;
let scaleFactor = 1.0;
const scaleStep = 1.1;

const generateMazeButton = document.getElementById("generate")!;
const loopFactorSlider = document.getElementById("loop-factor") as HTMLInputElement;
const loopFactorValue = document.getElementById("loop-factor-value")!;
const generateStartButton = document.getElementById("generate-start")!;
const generateGoalButton = document.getElementById("generate-goal")!;
const searchAlgorithm = document.getElementById("algorithm") as HTMLSelectElement;
const startSearchButton = document.getElementById("start-search")!;
const clearPathButton = document.getElementById("clear-path")!;
const scaleUpButton = document.getElementById("scale-up")!;
const scaleDownButton = document.getElementById("scale-down")!;
const mazeDimensionsDisplay = document.getElementById("maze-dimensions")!;
const root = document.documentElement;

root.style.setProperty('--start-color', environment.startCellColor);
root.style.setProperty('--goal-color', environment.goalCellColor);
root.style.setProperty('--explored-color', environment.exploredCellColor);
root.style.setProperty('--path-color', environment.pathCellColor);

function toOdd(n: number): number {
  const rounded = Math.round(n);
  return rounded % 2 === 0 ? rounded - 1 : rounded;
}

function applyScale(factor: number): void {
  scaleFactor = Math.max(environment.mazeMinHeight / environment.mazeMaxHeight, Math.min(1.0, factor));
  mazeWidth = Math.max(environment.mazeMinWidth, toOdd(environment.mazeMaxWidth * scaleFactor));
  mazeHeight = Math.max(environment.mazeMinHeight, toOdd(environment.mazeMaxHeight * scaleFactor));
  mazeDimensionsDisplay.textContent = `${mazeWidth} x ${mazeHeight}`;
  if (maze) {
    start = null;
    goal = null;
    maze = generateMaze(mazeWidth, mazeHeight, getLoopFactor());
    mazeSolver = new MazeSolver(maze);
    drawMaze(maze, mazeWidth, mazeHeight);
  }
}

function withMaze(action: (maze: Maze, mazeSolver: MazeSolver) => void) {
  if (!maze || !mazeSolver) {
    alert('Please generate the maze first.');
    return;
  }
  action(maze, mazeSolver);
}

function drawStartAndGoalCells() {
  if (start) drawCell(start, environment.startCellColor);
  if (goal) drawCell(goal, environment.goalCellColor);
}

function getLoopFactor(): number {
  return parseInt(loopFactorSlider.value) / 100;
}

loopFactorSlider.addEventListener("input", () => {
  loopFactorValue.textContent = `${loopFactorSlider.value}%`;
});

scaleUpButton.addEventListener("click", () => applyScale(scaleFactor * scaleStep));
scaleDownButton.addEventListener("click", () => applyScale(scaleFactor / scaleStep));

generateMazeButton.addEventListener("click", () => {
  start = null;
  goal = null;
  maze = generateMaze(mazeWidth, mazeHeight, getLoopFactor());
  mazeSolver = new MazeSolver(maze);
  drawMaze(maze, mazeWidth, mazeHeight);
});

generateStartButton.addEventListener("click", () => {
  withMaze((maze, mazeSolver) => {
    mazeSolver.setStartPosition(maze.getRandomFreeCell());
  });
});

generateGoalButton.addEventListener("click", () => {
  withMaze((maze, mazeSolver) => {
    mazeSolver.setGoalPosition(maze.getRandomFreeCell());
  });
});

clearPathButton.addEventListener("click", () => {
  withMaze((maze) => {
    drawMaze(maze, mazeWidth, mazeHeight);
    drawStartAndGoalCells();
  })
})

startSearchButton.addEventListener("click", async () => {
  if (!start || !goal) {
    alert("Generate start and goal first.");
    return;
  }

  withMaze(async (maze, mazeSolver) => {
    switch (searchAlgorithm.value) {
      case "DFS":
        mazeSolver.setStrategy(depthFirstSearch);
        break;
      case "BFS":
        mazeSolver.setStrategy(breadthFirstSearch);
        break;
      case "GBFS":
        mazeSolver.setStrategy(greedyBestFirstSearch);
        break;
      case "A-star":
        mazeSolver.setStrategy(aStar);
        break;
    }

    await mazeSolver.run()
  })
})

Events.on(EventType.MISSING_INFORMATION, () => {
  alert('Make sure to set the start, goal, and strategy first.');
});

Events.on(EventType.START_POSITION_CHANGED, (startPosition: Vector) => {
  withMaze((maze) => {
    start = startPosition;
    drawMaze(maze, mazeWidth, mazeHeight);
    drawCell(start, environment.startCellColor);
    if (goal) drawCell(goal, environment.goalCellColor);
  })
})

Events.on(EventType.GOAL_POSITION_CHANGED, (goalPosition: Vector)=> {
  withMaze((maze) => {
    goal = goalPosition;
    drawMaze(maze, mazeWidth, mazeHeight);
    drawCell(goal, environment.goalCellColor);
    if (start) drawCell(start, environment.startCellColor);
  })
})

Events.on(EventType.EXPLORED_FIELD_ADDED, (cell: Vector) => {
  drawCell(cell, environment.exploredCellColor);
});

Events.on(EventType.FINAL_PATH_ADDED, (cell: Vector) => {
  drawCell(cell, environment.pathCellColor);
});
