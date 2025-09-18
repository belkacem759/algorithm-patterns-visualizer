import type { AlgorithmPattern } from '../types/algorithm'

export const algorithmPatterns: AlgorithmPattern[] = [
  // Array Patterns
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Array',
    description: 'Use two pointers moving towards each other or in the same direction to solve problems efficiently.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    difficulty: 'Easy',
    tags: ['array', 'pointers', 'optimization'],
    visualizationType: 'array',
    examples: [
      {
        id: 'two-sum-sorted',
        name: 'Two Sum in Sorted Array',
        description: 'Find two numbers that add up to a target sum in a sorted array.',
        input: [1, 2, 3, 4, 6, 8, 9],
        expectedOutput: [2, 4],
        steps: [
          {
            id: 'step-1',
            description: 'Initialize left pointer at start and right pointer at end',
            data: [1, 2, 3, 4, 6, 8, 9],
            pointers: [
              { id: 'left', name: 'L', position: 0, color: '#ef4444', type: 'left' },
              { id: 'right', name: 'R', position: 6, color: '#3b82f6', type: 'right' }
            ]
          },
          {
            id: 'step-2',
            description: 'Sum = 1 + 9 = 10, greater than target 7, move right pointer left',
            data: [1, 2, 3, 4, 6, 8, 9],
            pointers: [
              { id: 'left', name: 'L', position: 0, color: '#ef4444', type: 'left' },
              { id: 'right', name: 'R', position: 5, color: '#3b82f6', type: 'right' }
            ]
          },
          {
            id: 'step-3',
            description: 'Sum = 1 + 8 = 9, greater than target 7, move right pointer left',
            data: [1, 2, 3, 4, 6, 8, 9],
            pointers: [
              { id: 'left', name: 'L', position: 0, color: '#ef4444', type: 'left' },
              { id: 'right', name: 'R', position: 4, color: '#3b82f6', type: 'right' }
            ]
          },
          {
            id: 'step-4',
            description: 'Sum = 1 + 6 = 7, equals target! Found the pair.',
            data: [1, 2, 3, 4, 6, 8, 9],
            pointers: [
              { id: 'left', name: 'L', position: 0, color: '#10b981', type: 'left' },
              { id: 'right', name: 'R', position: 4, color: '#10b981', type: 'right' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Array',
    description: 'Maintain a window of elements and slide it across the array to find optimal solutions.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    difficulty: 'Medium',
    tags: ['array', 'window', 'optimization'],
    visualizationType: 'array',
    examples: [
      {
        id: 'max-sum-subarray',
        name: 'Maximum Sum Subarray of Size K',
        description: 'Find the maximum sum of any contiguous subarray of size k.',
        input: [2, 1, 5, 1, 3, 2],
        expectedOutput: 9,
        steps: [
          {
            id: 'step-1',
            description: 'Initialize window of size 3, sum = 2 + 1 + 5 = 8',
            data: [2, 1, 5, 1, 3, 2],
            pointers: [
              { id: 'start', name: 'Start', position: 0, color: '#ef4444', type: 'left' },
              { id: 'end', name: 'End', position: 2, color: '#3b82f6', type: 'right' }
            ]
          },
          {
            id: 'step-2',
            description: 'Slide window: remove 2, add 1, sum = 1 + 5 + 1 = 7',
            data: [2, 1, 5, 1, 3, 2],
            pointers: [
              { id: 'start', name: 'Start', position: 1, color: '#ef4444', type: 'left' },
              { id: 'end', name: 'End', position: 3, color: '#3b82f6', type: 'right' }
            ]
          },
          {
            id: 'step-3',
            description: 'Slide window: remove 1, add 3, sum = 5 + 1 + 3 = 9 (max so far)',
            data: [2, 1, 5, 1, 3, 2],
            pointers: [
              { id: 'start', name: 'Start', position: 2, color: '#ef4444', type: 'left' },
              { id: 'end', name: 'End', position: 4, color: '#3b82f6', type: 'right' }
            ]
          },
          {
            id: 'step-4',
            description: 'Slide window: remove 5, add 2, sum = 1 + 3 + 2 = 6',
            data: [2, 1, 5, 1, 3, 2],
            pointers: [
              { id: 'start', name: 'Start', position: 3, color: '#ef4444', type: 'left' },
              { id: 'end', name: 'End', position: 5, color: '#3b82f6', type: 'right' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    category: 'Array',
    description: 'Use two pointers moving at different speeds to detect cycles or find middle elements.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    difficulty: 'Medium',
    tags: ['pointers', 'cycle-detection', 'linked-list'],
    visualizationType: 'array',
    examples: [
      {
        id: 'find-duplicate',
        name: 'Find Duplicate Number',
        description: 'Find the duplicate number in an array using Floyd\'s cycle detection.',
        input: [1, 3, 4, 2, 2],
        expectedOutput: 2,
        steps: [
          {
            id: 'step-1',
            description: 'Initialize slow and fast pointers at start',
            data: [1, 3, 4, 2, 2],
            pointers: [
              { id: 'slow', name: 'Slow', position: 0, color: '#8b5cf6', type: 'slow' },
              { id: 'fast', name: 'Fast', position: 0, color: '#ec4899', type: 'fast' }
            ]
          },
          {
            id: 'step-2',
            description: 'Move slow 1 step, fast 2 steps',
            data: [1, 3, 4, 2, 2],
            pointers: [
              { id: 'slow', name: 'Slow', position: 1, color: '#8b5cf6', type: 'slow' },
              { id: 'fast', name: 'Fast', position: 2, color: '#ec4899', type: 'fast' }
            ]
          },
          {
            id: 'step-3',
            description: 'Continue moving until they meet (cycle detected)',
            data: [1, 3, 4, 2, 2],
            pointers: [
              { id: 'slow', name: 'Slow', position: 2, color: '#8b5cf6', type: 'slow' },
              { id: 'fast', name: 'Fast', position: 2, color: '#ec4899', type: 'fast' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    category: 'Array',
    description: 'Merge overlapping intervals or insert new intervals into existing ones.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    difficulty: 'Medium',
    tags: ['intervals', 'sorting', 'merging'],
    visualizationType: 'array',
    examples: [
      {
        id: 'merge-overlapping',
        name: 'Merge Overlapping Intervals',
        description: 'Merge all overlapping intervals in a list.',
        input: [[1,3],[2,6],[8,10],[15,18]],
        expectedOutput: [[1,6],[8,10],[15,18]],
        steps: [
          {
            id: 'step-1',
            description: 'Sort intervals by start time',
            data: [[1,3],[2,6],[8,10],[15,18]],
            pointers: []
          },
          {
            id: 'step-2',
            description: 'Compare [1,3] and [2,6] - they overlap, merge to [1,6]',
            data: [[1,6],[8,10],[15,18]],
            pointers: []
          }
        ]
      }
    ]
  },
  {
    id: 'cyclic-sort',
    name: 'Cyclic Sort',
    category: 'Sorting',
    description: 'Sort arrays containing numbers in a given range by placing each number at its correct index.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    difficulty: 'Easy',
    tags: ['sorting', 'in-place', 'cyclic'],
    visualizationType: 'array',
    examples: [
      {
        id: 'cyclic-sort-basic',
        name: 'Basic Cyclic Sort',
        description: 'Sort array [1,n] using cyclic sort technique.',
        input: [3, 1, 5, 4, 2],
        expectedOutput: [1, 2, 3, 4, 5],
        steps: [
          {
            id: 'step-1',
            description: 'Start at index 0, value 3 should be at index 2',
            data: [3, 1, 5, 4, 2],
            pointers: [{ id: 'current', name: 'i', position: 0, color: '#f59e0b', type: 'current' }]
          },
          {
            id: 'step-2',
            description: 'Swap 3 with element at index 2 (value 5)',
            data: [5, 1, 3, 4, 2],
            pointers: [{ id: 'current', name: 'i', position: 0, color: '#f59e0b', type: 'current' }]
          }
        ]
      }
    ]
  },

  // Tree Patterns
  {
    id: 'tree-dfs',
    name: 'Tree Depth-First Search',
    category: 'Tree',
    description: 'Traverse tree using DFS (preorder, inorder, postorder) to solve tree problems.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    difficulty: 'Medium',
    tags: ['tree', 'dfs', 'recursion'],
    visualizationType: 'tree',
    examples: [
      {
        id: 'tree-path-sum',
        name: 'Path Sum',
        description: 'Find if there exists a root-to-leaf path with given sum.',
        input: { val: 5, left: { val: 4, left: { val: 11, left: { val: 7 }, right: { val: 2 } } }, right: { val: 8, left: { val: 13 }, right: { val: 4, right: { val: 1 } } } },
        expectedOutput: true,
        steps: [
          {
            id: 'step-1',
            description: 'Start DFS from root, target sum = 22',
            data: { current: 5, path: [5], sum: 5 },
            pointers: []
          }
        ]
      }
    ]
  },
  {
    id: 'tree-bfs',
    name: 'Tree Breadth-First Search',
    category: 'Tree',
    description: 'Traverse tree level by level using BFS to solve level-order problems.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(w)',
    difficulty: 'Easy',
    tags: ['tree', 'bfs', 'level-order'],
    visualizationType: 'tree',
    examples: [
      {
        id: 'level-order',
        name: 'Level Order Traversal',
        description: 'Traverse tree level by level from left to right.',
        input: { val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } },
        expectedOutput: [[3], [9, 20], [15, 7]],
        steps: [
          {
            id: 'step-1',
            description: 'Process level 0: [3]',
            data: { level: 0, nodes: [3], queue: [9, 20] },
            pointers: []
          }
        ]
      }
    ]
  },

  // Dynamic Programming Patterns
  {
    id: '0-1-knapsack',
    name: '0/1 Knapsack',
    category: 'Dynamic Programming',
    description: 'Solve optimization problems by choosing items with maximum value within weight constraint.',
    timeComplexity: 'O(n*W)',
    spaceComplexity: 'O(n*W)',
    difficulty: 'Medium',
    tags: ['dp', 'optimization', 'knapsack'],
    visualizationType: 'matrix',
    examples: [
      {
        id: 'knapsack-basic',
        name: 'Basic Knapsack',
        description: 'Find maximum value that can be obtained with given weight limit.',
        input: { weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 },
        expectedOutput: 9,
        steps: [
          {
            id: 'step-1',
            description: 'Initialize DP table',
            data: { dp: [[0, 0, 0, 0, 0, 0, 0, 0]], item: 0 },
            pointers: []
          }
        ]
      }
    ]
  },
  {
    id: 'unbounded-knapsack',
    name: 'Unbounded Knapsack',
    category: 'Dynamic Programming',
    description: 'Similar to 0/1 knapsack but items can be used multiple times.',
    timeComplexity: 'O(n*W)',
    spaceComplexity: 'O(W)',
    difficulty: 'Medium',
    tags: ['dp', 'optimization', 'unbounded'],
    visualizationType: 'matrix',
    examples: [
      {
        id: 'coin-change',
        name: 'Coin Change',
        description: 'Find minimum number of coins needed to make a given amount.',
        input: { coins: [1, 3, 4], amount: 6 },
        expectedOutput: 2,
        steps: [
          {
            id: 'step-1',
            description: 'Initialize DP array for amount 6',
            data: { dp: [0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity], amount: 0 },
            pointers: []
          }
        ]
      }
    ]
  },

  // Graph Patterns
  {
    id: 'graph-dfs',
    name: 'Graph Depth-First Search',
    category: 'Graph',
    description: 'Explore graph deeply before backtracking, useful for connectivity and cycle detection.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    difficulty: 'Medium',
    tags: ['graph', 'dfs', 'traversal'],
    visualizationType: 'graph',
    examples: [
      {
        id: 'connected-components',
        name: 'Connected Components',
        description: 'Find number of connected components in an undirected graph.',
        input: { nodes: 5, edges: [[0,1], [1,2], [3,4]] },
        expectedOutput: 2,
        steps: [
          {
            id: 'step-1',
            description: 'Start DFS from node 0',
            data: { visited: [true, false, false, false, false], current: 0, component: 1 },
            pointers: []
          }
        ]
      }
    ]
  },
  {
    id: 'graph-bfs',
    name: 'Graph Breadth-First Search',
    category: 'Graph',
    description: 'Explore graph level by level, useful for shortest path in unweighted graphs.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    difficulty: 'Medium',
    tags: ['graph', 'bfs', 'shortest-path'],
    visualizationType: 'graph',
    examples: [
      {
        id: 'shortest-path',
        name: 'Shortest Path',
        description: 'Find shortest path between two nodes in unweighted graph.',
        input: { nodes: 4, edges: [[0,1], [0,2], [1,3], [2,3]], start: 0, end: 3 },
        expectedOutput: 2,
        steps: [
          {
            id: 'step-1',
            description: 'Start BFS from node 0',
            data: { queue: [0], visited: [true, false, false, false], distance: [0, -1, -1, -1] },
            pointers: []
          }
        ]
      }
    ]
  },

  // Additional patterns would continue here...
  // For brevity, I'm including a few more key patterns

  {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'Graph',
    description: 'Linear ordering of vertices in a directed acyclic graph.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    difficulty: 'Medium',
    tags: ['graph', 'topological', 'dag'],
    visualizationType: 'graph',
    examples: [
      {
        id: 'course-schedule',
        name: 'Course Schedule',
        description: 'Determine if all courses can be finished given prerequisites.',
        input: { numCourses: 4, prerequisites: [[1,0], [2,0], [3,1], [3,2]] },
        expectedOutput: [0, 1, 2, 3],
        steps: [
          {
            id: 'step-1',
            description: 'Calculate in-degrees for all nodes',
            data: { inDegree: [0, 1, 1, 2], queue: [0] },
            pointers: []
          }
        ]
      }
    ]
  },

  {
    id: 'binary-search',
    name: 'Modified Binary Search',
    category: 'Searching',
    description: 'Apply binary search on sorted arrays, rotated arrays, or search spaces.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    difficulty: 'Medium',
    tags: ['binary-search', 'sorted-array', 'search-space'],
    visualizationType: 'array',
    examples: [
      {
        id: 'search-rotated',
        name: 'Search in Rotated Sorted Array',
        description: 'Find target in a rotated sorted array.',
        input: [4, 5, 6, 7, 0, 1, 2],
        expectedOutput: 4,
        steps: [
          {
            id: 'step-1',
            description: 'Initialize binary search pointers',
            data: [4, 5, 6, 7, 0, 1, 2],
            pointers: [
              { id: 'left', name: 'L', position: 0, color: '#ef4444', type: 'left' },
              { id: 'right', name: 'R', position: 6, color: '#3b82f6', type: 'right' },
              { id: 'mid', name: 'M', position: 3, color: '#f59e0b', type: 'current' }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'Backtracking',
    description: 'Explore all possible solutions by building candidates incrementally and abandoning invalid ones.',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
    difficulty: 'Hard',
    tags: ['backtracking', 'recursion', 'exploration'],
    visualizationType: 'tree',
    examples: [
      {
        id: 'n-queens',
        name: 'N-Queens',
        description: 'Place N queens on NxN chessboard such that no two queens attack each other.',
        input: 4,
        expectedOutput: 2,
        steps: [
          {
            id: 'step-1',
            description: 'Try placing queen in first row, first column',
            data: { board: [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], row: 0 },
            pointers: []
          }
        ]
      }
    ]
  }
]

// Helper function to get patterns by category
export const getPatternsByCategory = (category: string) => {
  return algorithmPatterns.filter(pattern => pattern.category === category)
}

// Helper function to get pattern by id
export const getPatternById = (id: string) => {
  return algorithmPatterns.find(pattern => pattern.id === id)
}

// Get all categories
export const getAllCategories = () => {
  return [...new Set(algorithmPatterns.map(pattern => pattern.category))]
}