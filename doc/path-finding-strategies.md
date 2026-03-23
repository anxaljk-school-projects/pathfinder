# Pathfinder — Path Finding Strategies

## Depth First Search (DFS)

### 1. The Stack Behavior (LIFO)
DFS uses a Last-In, First-Out (=LIFO) approach — also known as "stack behavior". 

In TypeScript, this is managed with a standard array:

* Add new neighbors to the end of the array (`frontier.push(cell)`).
* Remove the most recent neighbor added (`frontier.pop()`).

This approach forces the algorithm to dive deep into one direction before trying any branches.

### 2. Avoiding Infinite Loops
Because a maze can have open areas, DFS must keep track of where it has already been.

* This project uses a `Set<string>` to store "visited" coordinates.
* Before adding a neighbor to the frontier, we check if it's already in the Set. This prevents the algorithm from spinning in circles forever.

### 3. Finding the Path
DFS doesn't inherently "know" the path to the goal; it only knows how to explore. To extract the final route, we store a Parent Map. Every time we discover a new cell, we record which cell we came from. Once the goal is found, we follow these "breadcrumbs" backward to the start.

## Breadth First Search (BFS)

### 1. The Queue Behavior (FIFO)
BFS is very similar to DFS, but it explores the maze layer by layer instead of diving in deep in one direction. It always visits the shallowest unvisited cells first. This is called the First-in, First-out (=FIFO) approach — also known as "queue behavior".

In TypeScript, this is managed with a standard array:

* Add new neighbors to the end of the array (`frontier.push(cell)`).
* Remove the oldest neighbor from the front of the array (`frontier.shift()`).

By taking the oldest node first, the algorithm finishes checking everything 1 step away before moving to nodes that are 2 steps away.

BFS [avoids infinite loops](#2-avoiding-infinite-loops) as well with the same tactic that DFS uses. The same goes for [finding the path](#3-finding-the-path). 

### 2. The Guarantee of Shortest Path
Unlike DFS, which might find a very long, winding path to the goal just because it stumbled upon it first, BFS guarantees the shortest path in an unweighted maze.

Because it explores all nodes at distance $d$ before moving to distance $d + 1$, the first time it "touches" the goal, it is mathematically impossible to have found it via a shorter route.

### 3. Memory Trade-off
While BFS finds the best path, it usually requires more memory than DFS.

* DFS only needs to remember the current path it is exploring (the stack).
* BFS has to keep track of the entire frontier, which can grow quite large in open mazes.
