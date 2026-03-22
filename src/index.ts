import { generateMaze } from "./ui/maze-generator";
import { environment } from "./app/environment";
import { drawMaze } from "./ui/draw-cells";

const generateMazeButton = document.getElementById("generate")!;

generateMazeButton.addEventListener("click", () => {
  const maze = generateMaze(environment.mazeWidth, environment.mazeHeight);
  drawMaze(maze);
});
