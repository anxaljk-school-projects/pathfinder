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
