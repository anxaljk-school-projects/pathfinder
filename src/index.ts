import { generateMaze } from "./ui/maze-generator";
import { environment } from "./app/environment";
import { MazeSolver } from "./app/MazeSolver";
import { drawCell, drawMaze } from "./ui/draw-cells";
import { Maze } from "./core/maze/Maze";
import { Events, EventType } from "./app/Events";
import { Vector } from "./core/maze/Vector";
import { depthFirstSearch } from "./core/pathfinding/strategies/DepthFirstSearch";

let maze: Maze | null = null;
let mazeSolver: MazeSolver | null = null;
let start: Vector | null = null;
let goal: Vector | null = null;

const generateMazeButton = document.getElementById("generate")!;
const generateStartButton = document.getElementById("generate-start")!;
const generateGoalButton = document.getElementById("generate-goal")!;
const searchAlgorithm = document.getElementById("algorithm") as HTMLSelectElement;
const startSearchButton = document.getElementById("start-search")!;
const clearPathButton = document.getElementById("clear-path")!;
const root = document.documentElement;

root.style.setProperty('--start-color', environment.startCellColor);
root.style.setProperty('--goal-color', environment.goalCellColor);
root.style.setProperty('--explored-color', environment.exploredCellColor);
root.style.setProperty('--path-color', environment.pathCellColor);

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

generateMazeButton.addEventListener("click", () => {
  maze = generateMaze(environment.mazeWidth, environment.mazeHeight);
  mazeSolver = new MazeSolver(maze);
  drawMaze(maze);
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
    drawMaze(maze);
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
        await mazeSolver.run();
        break;
      case "BFS":
        break;
      case "GBFS":
        break;
      case "A-star":
        break;
      default:
        alert("Please select the search algorithm first.");
    }
  })
})

Events.on(EventType.MISSING_INFORMATION, () => {
  alert('Make sure to set the start, goal, and strategy first.');
});

Events.on(EventType.START_POSITION_CHANGED, (startPosition: Vector) => {
  withMaze((maze) => {
    start = startPosition;
    drawMaze(maze);
    drawCell(start, environment.startCellColor);
    if (goal) drawCell(goal, environment.goalCellColor);
  })
})

Events.on(EventType.GOAL_POSITION_CHANGED, (goalPosition: Vector)=> {
  withMaze((maze) => {
    goal = goalPosition;
    drawMaze(maze);
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
