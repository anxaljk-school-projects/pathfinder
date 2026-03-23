# Pathfinder — Path Finding Strategies

## Strategy types

There are two main strategy types: informed and uninformed search.

In uninformed search, the algorithm doesn't have any additional information on the goal — they can only search for it and they found it once they arrive there.

In informed search on the other hand, the algorithm has more information on the goal state which helps in more efficient search (by preventing the exploration of unnecessary paths, for example).

Read more [here](https://www.geeksforgeeks.org/artificial-intelligence/difference-between-informed-and-uninformed-search-in-ai/).

## Depth First Search (DFS)

> Strategy type: uninformed Search 

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

> Strategy type: uninformed Search

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

## Greedy Best First Search (GBFS)

> Strategy type: informed search

### 1. The heuristic function

GBFS is a search algorithm that continues its exploration from the cell that is still unexplored and closest to the goal. How close we are to the goal is estimated by a heuristic function $h(n)$.

One specific type of the heuristic function is the Manhattan distance. It is the type we're using in this project, too.

The Manhattan distance is calculated by "how many cells, vertically and horizontally, do I need to travel to go from a certain point to the goal". Fewer steps means closer to the goal. The walls in a maze are ignored.

The cell with the smallest value from the heuristic (the smallest Manhattan distance in our case) will be removed from the frontier and then explored.

In TypeScript, this is managed with a standard array:

* Add new neighbors to the end of the array (`frontier.push(cell)`).
* Pluck the specific best guess cell out of the list, regardless where it is sitting (`frontier.splice(minIndex, 1`).

GBFS [avoids infinite loops](#2-avoiding-infinite-loops) with the same tactic the other algorithms use. The same goes for [finding the path](#3-finding-the-path).

### 2. Trade-offs

It is important to note that the heuristic isn't a guarantee of how many steps we're actually going to have to take, it's an estimate.

There is no guarantee that GBFS will find the shortest path, either.

Because GBFS only looks at the remaining distance to the goal and ignores how much effort it took to get to the current cell, it can be easily fooled by walls. It might spend a lot of time banging its head against a wall because that wall is "closer" to the goal, rather than walking around it.

Except from that, GBFS has a memory trade-off, too. It has to keep track of the entire frontier, just like [BFS](#breadth-first-search-bfs) does, and it has to calculate the Manhattan distance on top of that.

## A Star (A*)

> Strategy type: informed search

### 1. Cost functions

A* doesn't just consider the [heuristic](#1-the-heuristic-function), but also how long it takes us to get to any particular state. That means A Star is going to explore the cell with the lowest value of $g(n) + h(n)$.

* $g(n)$ is the cost to reach the (current) cell.
* $h(n)$ is the estimated cost to the goal (the heuristic).

Cost means how many cells we had to travel in this case.

This project uses the Manhattan distance (read more about it [here](#1-the-heuristic-function)) as the heuristic for A*.

In summary, A* search is going to make a choice at every decision point based on the sum of how many steps it took the algorithm to get to its current position and how far it estimates it is from the goal.

Therefore, A* will always fid the best (shortest) path.

The A* search handles the frontier with arrays, just like [GBFS](#greedy-best-first-search-gbfs) does.

It also [avoids infinite loops](#2-avoiding-infinite-loops) with the same tactic the other algorithms use. The same goes for [finding the path](#3-finding-the-path).

### 2. Upsides and downsides

A* search is optimal if:

* The heuristic never overestimates the true cost (it has to be admissible).
* The heuristic needs to be consistent for every cell. This means that, after taking a step toward the goal, the heuristic value should have decreased.

In general, you can say: "THe better the heuristic is, the better the algorithm will be able to solve the problem and the less it'll have to explore."

A* search has a tendency to use quite a bit of memory, since it needs to keep constant track of the frontier and does a lot of calculations.
