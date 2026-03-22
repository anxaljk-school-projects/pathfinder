import { Vector } from "../core/maze/Vector";
import { Maze } from "../core/maze/Maze";
import { environment } from "../app/environment";

const canvas = (document.getElementById("maze") as HTMLCanvasElement).getContext("2d")!;

export function drawCell(position: Vector, color: string) {
  canvas.fillStyle = color;
  // Multiply by cellSize to map grid coordinates to pixels
  canvas.fillRect(position.x * environment.cellSize, position.y * environment.cellSize, environment.cellSize, environment.cellSize);
}

export function drawMaze(maze: Maze) {
  const canvasElement = document.getElementById("maze") as HTMLCanvasElement | null;
  if (!canvasElement) throw new Error("Canvas element #maze not found");

  canvasElement.width = environment.mazeWidth * environment.cellSize;
  canvasElement.height = environment.mazeHeight * environment.cellSize;

  for (let y = 0; y < environment.mazeHeight; y++) {
    for (let x = 0; x < environment.mazeWidth; x++) {
      drawCell(new Vector(x, y), maze.isObstacle(new Vector(x, y)) ? "black" : "white");
    }
  }
}
