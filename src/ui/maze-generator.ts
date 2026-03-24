import { Maze } from "../core/maze/Maze";
import { Vector } from "../core/maze/Vector";

export function generateMaze(width: number, height: number, loopFactor: number = 0): Maze {
  const maze = new Maze(width, height);

  /**
   * Create a grid filled with obstacles
   * Example: [
   *   [1, 1, 1, 1],
   *   [1, 1, 1, 1],
   *   [1, 1, 1, 1]
   * ]
   * Outer array = rows (=height) and inner array = columns (=width)
   * 1 means obstacle, 0 will later mean path
   */
  const grid = Array.from({ length: height }, () =>
    Array(width).fill(1)
  );

  /**
   * Iteratively carve paths into the grid using an explicit stack to avoid call stack overflow on large mazes.
   * Directions are in steps of 2 because we leave an obstacle between cells and then break it.
   * The sort is random so the maze won't be a perfect spiral but be unpredictable.
   */
  const carve = (startX: number, startY: number) => {
    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];

      const directions = [
        [0, -2],
        [2, 0],
        [0, 2],
        [-2, 0],
      ].sort(() => Math.random() - 0.5);

      const next = directions.find(([directionX, directionY]) => {
        const nextX = x + directionX;
        const nextY = y + directionY;
        return (
          nextY > 0 &&
          nextY < height - 1 &&
          nextX > 0 &&
          nextX < width - 1 &&
          grid[nextY][nextX] === 1
        );
      });

      if (next) {
        const [directionX, directionY] = next;
        // Make the cell between the next cell and the current position to a path
        grid[y + directionY / 2][x + directionX / 2] = 0;
        // Make the next cell to a path
        grid[y + directionY][x + directionX] = 0;
        stack.push([x + directionX, y + directionY]);
      } else {
        stack.pop();
      }
    }
  };

  /**
   * (1, 1) is inside the maze (not on the border)
   * Starting on an odd coordinate ensures symmetry
   * Marks the start cell as open
   * Begins recursive carving
   */
  grid[1][1] = 0;
  carve(1, 1);

  /**
   * After carving a perfect maze (one path between any two cells), optionally punch extra holes
   * in walls to create loops (=multiple paths between start and goal).
   *
   * A "removable wall" is an interior wall cell with open path cells on both sides:
   *   - horizontal: grid[y][x-1] and grid[y][x+1] are both open, x is even, y is odd
   *   - vertical:   grid[y-1][x] and grid[y+1][x] are both open, x is odd, y is even
   * Removing such a wall creates a new junction without touching the border.
   * loopFactor (0–1) controls what fraction of removable walls get knocked down.
   */
  if (loopFactor > 0) {
    const removableWalls: [number, number][] = [];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (grid[y][x] !== 1) continue;
        const isHorizontalWall = x % 2 === 0 && y % 2 === 1
          && grid[y][x - 1] === 0 && grid[y][x + 1] === 0;
        const isVerticalWall = x % 2 === 1 && y % 2 === 0
          && grid[y - 1][x] === 0 && grid[y + 1][x] === 0;
        if (isHorizontalWall || isVerticalWall) {
          removableWalls.push([x, y]);
        }
      }
    }

    // Shuffle and remove the first loopFactor fraction of them
    removableWalls.sort(() => Math.random() - 0.5);
    const toRemove = Math.floor(loopFactor * removableWalls.length);
    for (let i = 0; i < toRemove; i++) {
      const [x, y] = removableWalls[i];
      grid[y][x] = 0;
    }
  }

  // Iterates over every cell in the grid to convert the cells with the value 1 to Maze obstacles
  // We are using this obstacle approach because they are better for path finding and for large mazes
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 1) {
        maze.addObstacle(new Vector(x, y));
      }
    }
  }

  return maze;
}
