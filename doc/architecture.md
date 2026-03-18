# Pathfinder — Architecture

## Physical Directory Structure

```
src/
│
├── core/                   -> pure logic (no UI)
│   ├── maze/
│   │   ├── Maze.ts
│   │   └── Vector.ts
│   │
│   └── pathfinding/
│       ├── strategies/
│       │   ├── bfs.ts
│       │   ├── dfs.ts
│       │   ├── ...
│       │
│       └─── utils/
│           ├── PathfindingStrategy.ts
│           ├── ...
│
├── app/
│   ├── MazeSolver.ts      -> connects maze + strategy
│   ├── events.ts          -> observer / event system
│   └── environment.ts     -> global variables / settings
│
├── ui/                    -> canvas stuff (UI)
│   ├── draw-cells.ts
│   ├── generate-maze.ts
│   ├── ...
│
└── index.ts
```

> The `index.html` file is outside the `src` folder so it can easily be rendered by vite without any additional configuration.

## Layers

1. `core` domain -> Maze, Vectors
2. `core` algorithms (strategies) -> BFS, DFS, GBFS, A* + utils
3. `ui` presentation -> draw canvas
4. `app` orchestration -> connecting `ui` and `core`

## Reasons for picking this architecture

- Clean separation of concerns
- Balancing OOP (e.g. Maze, Cell) and functional programming (e.g. BFS, DFS, utils)
- Matches the technology stack
- Scalable
