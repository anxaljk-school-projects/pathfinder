# Pathfinder — Design Patterns

This file introduces the most important design patterns used in this project.

## Immutability

Immutability means "incapable of change". Once a value is created, it cannot be modified — you can only create a new value based on it. This prevents accidental side effects when the same object is referenced in multiple places.

In TypeScript, `readonly` prevents a property from being reassigned after construction:

```ts
class Vector {
  constructor(public readonly x: number, public readonly y: number) {}
}

const v = new Vector(3, 5);
v.x = 10; // compile error
```

An example can be found in [Vector.ts](../src/core/maze/Vector.ts).

## Observer

The Observer Pattern is a behavioral design pattern where an object (the Subject) maintains a list of dependents (Observers) and notifies them automatically of any state changes. Observers register themselves directly on the subject, so the subject knows who it is talking to.

```ts
class Subject {
  private observers: Observer[] = [];
  subscribe(o: Observer) { this.observers.push(o); }
  notify(data: any) { this.observers.forEach(o => o.update(data)); }
}
```

There are no examples for observers in this project, since it’s using [Pub-Sub](#pub-sub) instead.

## Pub-Sub

Pub-Sub means "Publisher-Subscriber". It’s conceptually very similar to the [Observer](#observer) pattern.

The key difference: publisher and subscriber never reference each other — they only know about a shared **event bus** in the middle. The publisher fires an event; any number of subscribers can react to it, and neither side is aware of who is on the other end.

```ts
// Publisher (MazeSolver) — has no idea who is listening
Events.emit(EventType.EXPLORED_FIELD_ADDED, cell);

// Subscriber (index.ts) — has no idea who fired the event
Events.on(EventType.EXPLORED_FIELD_ADDED, (cell) => drawCell(cell, color));
```

The event bus in this project is the `EventBus` class inside [Events.ts](../src/app/Events.ts). The available event types are defined in the `EventType` enum in the same file.

## Strategy

The Strategy Pattern defines a family of interchangeable algorithms behind a common interface. The caller works against the interface and never needs to know which concrete algorithm it is using.

```ts
interface PathfindingStrategy {
  solve(maze: Maze, start: Vector, goal: Vector): Promise<PathfindingResult>;
}
```

`MazeSolver` holds a `PathfindingStrategy` and calls `strategy.solve(...)`. Swapping between DFS, BFS, GBFS, or A* only requires calling `mazeSolver.setStrategy(...)` — the rest of the code is unchanged.

The interface and result type are defined in [PathfindingStrategy.ts](../src/core/pathfinding/utils/PathfindingStrategy.ts).

## Callback

A callback is a function passed as an argument to another function, to be called at a specific point during execution. Instead of hardcoding behaviour, you leave a "hole" in the logic that the caller fills in.

In this project, the shared `search` function in [search.ts](../src/core/pathfinding/utils/search.ts) uses three callbacks to capture the only parts that differ between DFS, BFS, GBFS, and A*:

```ts
search(
  maze, start, goal,
  frontier => frontier.pop(),           // pickNext: how to choose the next cell
  (neighbor, _, explored) =>            // shouldAddNeighbor: when to follow a neighbor
    !explored.has(neighbor.key()),
);
```

Each strategy passes different callbacks — `pop` for DFS, `shift` for BFS, a min-scan for GBFS — while the shared loop handles everything else.

---

## Important TypeScript Things

### What is a Map?

A `Map` stores key–value pairs and lets you look up a value by its key in constant time.

```ts
const scores = new Map<string, number>();
scores.set("alice", 42);
scores.get("alice"); // 42
scores.has("bob");   // false
```

In this project, Maps are used to find the way back from the goal to the start — each cell stores a reference to the cell it was reached from (similar to breadcrumbs):

* You move from Clearing A to Clearing B. You put a sign in B pointing to A.
* You move from Clearing B to Clearing C. You put a sign in C pointing to B.

Once the goal is reached, you follow the signs back to reconstruct the full path.

Read more about Maps [here](https://www.geeksforgeeks.org/typescript/typescript-map/).

### What is a Set?

A `Set` stores unique values — adding the same value twice has no effect. Checking whether a value is already in the set is fast (constant time), which makes Sets ideal for tracking visited items.

```ts
const visited = new Set<string>();
visited.add("a");
visited.add("a"); // ignored, already present
visited.has("a"); // true
visited.has("b"); // false
```

In this project, a `Set<string>` tracks which cells have already been explored so the search never visits the same cell twice. Each cell is identified by the string returned by `vector.key()` (e.g. `"3,7"`).

Read more about Sets [here](https://www.geeksforgeeks.org/typescript/typescript-set/).

### Array functionality

#### `.pop()`

Removes and returns the **last** element of an array.

```ts
const stack = [1, 2, 3];
stack.pop(); // returns 3, stack is now [1, 2]
```

Used in `DepthFirstSearch` to treat the frontier as a **stack** (last in, first out), which produces the depth-first exploration order.

#### `.shift()`

Removes and returns the **first** element of an array.

```ts
const queue = [1, 2, 3];
queue.shift(); // returns 1, queue is now [2, 3]
```

Used in `BreadthFirstSearch` to treat the frontier as a **queue** (first in, first out), which explores cells level by level.

#### `.splice(index, deleteCount)`

Removes `deleteCount` elements starting at `index` and returns them as an array.

```ts
const items = ["a", "b", "c", "d"];
items.splice(1, 1); // returns ["b"], items is now ["a", "c", "d"]
```

Used in `GreedyBestFirstSearch` and `AStar` to remove whichever frontier cell has the best score, regardless of its position in the array.
