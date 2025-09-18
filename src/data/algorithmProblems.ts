import type { AlgorithmProblem } from '../types/algorithm'

export const algorithmProblems: AlgorithmProblem[] = [
  // Array Problems
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'Array',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists'
    ],
    examples: [
      {
        id: 'example-1',
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: [0, 1],
        explanation: 'Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].'
      },
      {
        id: 'example-2',
        input: { nums: [3, 2, 4], target: 6 },
        output: [1, 2],
        explanation: 'Because nums[1] + nums[2] = 2 + 4 = 6, we return [1, 2].'
      }
    ],
    solution: {
      id: 'two-sum-hashmap',
      approach: 'Hash Map (One Pass)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
      explanation: 'We iterate through the array once, for each element checking if its complement (target - current) exists in our hash map. If found, we return the indices. Otherwise, we store the current element and its index in the map.',
      keyInsights: [
        'Hash map provides O(1) lookup time',
        'We only need one pass through the array',
        'Store elements as we go to avoid using extra space upfront'
      ],
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Initialize',
          description: 'Create empty hash map and start iterating from index 0',
          data: { nums: [2, 7, 11, 15], target: 9, map: {}, currentIndex: 0 },
          pointers: [
            { id: 'current', name: 'i', position: 0, color: '#3b82f6', type: 'current', description: 'Current element being processed' }
          ],
          animations: [
            { type: 'highlight', targets: ['element-0'], duration: 0.6 }
          ]
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Check Complement',
          description: 'Calculate complement = 9 - 2 = 7. Check if 7 exists in map. Not found.',
          data: { nums: [2, 7, 11, 15], target: 9, map: {}, currentIndex: 0, complement: 7 },
          pointers: [
            { id: 'current', name: 'i', position: 0, color: '#3b82f6', type: 'current' }
          ],
          animations: [
            { type: 'highlight', targets: ['complement-display'], duration: 0.6 }
          ]
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: 'Store in Map',
          description: 'Add nums[0] = 2 with index 0 to the map',
          data: { nums: [2, 7, 11, 15], target: 9, map: { '2': 0 }, currentIndex: 0 },
          pointers: [
            { id: 'current', name: 'i', position: 0, color: '#3b82f6', type: 'current' }
          ],
          animations: [
            { type: 'insert', targets: ['map-entry'], duration: 0.6 }
          ]
        },
        {
          id: 'step-4',
          stepNumber: 4,
          title: 'Move to Next',
          description: 'Move to index 1, nums[1] = 7',
          data: { nums: [2, 7, 11, 15], target: 9, map: { '2': 0 }, currentIndex: 1 },
          pointers: [
            { id: 'current', name: 'i', position: 1, color: '#3b82f6', type: 'current' }
          ],
          animations: [
            { type: 'move', targets: ['pointer-current'], duration: 0.6 }
          ]
        },
        {
          id: 'step-5',
          stepNumber: 5,
          title: 'Found Solution',
          description: 'Calculate complement = 9 - 7 = 2. Found 2 in map at index 0! Return [0, 1]',
          data: { nums: [2, 7, 11, 15], target: 9, map: { '2': 0 }, currentIndex: 1, complement: 2, result: [0, 1] },
          pointers: [
            { id: 'current', name: 'i', position: 1, color: '#10b981', type: 'current' },
            { id: 'found', name: 'found', position: 0, color: '#10b981', type: 'target' }
          ],
          animations: [
            { type: 'highlight', targets: ['element-0', 'element-1'], duration: 0.8, properties: { color: '#10b981' } }
          ]
        }
      ]
    },
    relatedPatterns: ['Hash Map', 'Array Traversal'],
    tags: ['hash-map', 'array', 'easy', 'fundamental'],
    visualizationType: 'array'
  },

  {
    id: 'merge-sorted-arrays',
    title: 'Merge Sorted Array',
    category: 'Array',
    difficulty: 'Easy',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array.',
    constraints: [
      'nums1.length == m + n',
      'nums2.length == n',
      '0 ≤ m, n ≤ 200',
      '1 ≤ m + n ≤ 200',
      '-10⁹ ≤ nums1[i], nums2[j] ≤ 10⁹'
    ],
    examples: [
      {
        id: 'example-1',
        input: { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 },
        output: [1, 2, 2, 3, 5, 6],
        explanation: 'The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6].'
      }
    ],
    solution: {
      id: 'merge-two-pointers',
      approach: 'Two Pointers (Backward)',
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(1)',
      code: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    let i = m - 1;  // Last element in nums1
    let j = n - 1;  // Last element in nums2
    let k = m + n - 1;  // Last position in merged array
    
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }
    
    // Copy remaining elements from nums2
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }
}`,
      explanation: 'We use three pointers starting from the end of both arrays. We compare elements and place the larger one at the end of nums1, working backwards to avoid overwriting elements.',
      keyInsights: [
        'Working backwards avoids overwriting unprocessed elements',
        'No extra space needed since nums1 has enough capacity',
        'Only need to copy remaining elements from nums2 if any'
      ],
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Initialize Pointers',
          description: 'Set up three pointers: i at last element of nums1, j at last element of nums2, k at last position',
          data: { 
            nums1: [1, 2, 3, 0, 0, 0], 
            nums2: [2, 5, 6], 
            m: 3, 
            n: 3,
            i: 2,
            j: 2,
            k: 5
          },
          pointers: [
            { id: 'i', name: 'i', position: 2, color: '#ef4444', type: 'left', description: 'nums1 pointer' },
            { id: 'j', name: 'j', position: 2, color: '#3b82f6', type: 'right', description: 'nums2 pointer' },
            { id: 'k', name: 'k', position: 5, color: '#f59e0b', type: 'target', description: 'merge position' }
          ],
          animations: [
            { type: 'highlight', targets: ['nums1-2', 'nums2-2', 'merge-5'], duration: 0.6 }
          ]
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Compare and Place',
          description: 'Compare nums1[2]=3 and nums2[2]=6. Since 6 > 3, place 6 at position k=5',
          data: { 
            nums1: [1, 2, 3, 0, 0, 6], 
            nums2: [2, 5, 6], 
            i: 2,
            j: 1,
            k: 4
          },
          pointers: [
            { id: 'i', name: 'i', position: 2, color: '#ef4444', type: 'left' },
            { id: 'j', name: 'j', position: 1, color: '#3b82f6', type: 'right' },
            { id: 'k', name: 'k', position: 4, color: '#f59e0b', type: 'target' }
          ],
          animations: [
            { type: 'move', targets: ['element-6'], duration: 0.8 },
            { type: 'move', targets: ['pointer-j', 'pointer-k'], duration: 0.6 }
          ]
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: 'Continue Merging',
          description: 'Compare nums1[2]=3 and nums2[1]=5. Since 5 > 3, place 5 at position k=4',
          data: { 
            nums1: [1, 2, 3, 0, 5, 6], 
            nums2: [2, 5, 6], 
            i: 2,
            j: 0,
            k: 3
          },
          pointers: [
            { id: 'i', name: 'i', position: 2, color: '#ef4444', type: 'left' },
            { id: 'j', name: 'j', position: 0, color: '#3b82f6', type: 'right' },
            { id: 'k', name: 'k', position: 3, color: '#f59e0b', type: 'target' }
          ],
          animations: [
            { type: 'move', targets: ['element-5'], duration: 0.8 }
          ]
        },
        {
          id: 'step-4',
          stepNumber: 4,
          title: 'Final Steps',
          description: 'Continue until all elements are merged: [1, 2, 2, 3, 5, 6]',
          data: { 
            nums1: [1, 2, 2, 3, 5, 6], 
            nums2: [2, 5, 6], 
            i: -1,
            j: -1,
            k: -1
          },
          pointers: [],
          animations: [
            { type: 'highlight', targets: ['final-array'], duration: 1.0, properties: { color: '#10b981' } }
          ]
        }
      ]
    },
    relatedPatterns: ['Two Pointers', 'Merge Sort'],
    tags: ['two-pointers', 'array', 'sorting', 'merge'],
    visualizationType: 'array'
  },

  {
    id: 'binary-tree-inorder',
    title: 'Binary Tree Inorder Traversal',
    category: 'Tree',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100]',
      '-100 ≤ Node.val ≤ 100'
    ],
    examples: [
      {
        id: 'example-1',
        input: { val: 1, right: { val: 2, left: { val: 3 } } },
        output: [1, 3, 2],
        explanation: 'Inorder traversal visits left subtree, root, then right subtree'
      }
    ],
    solution: {
      id: 'inorder-recursive',
      approach: 'Recursive DFS',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) where h is height of tree',
      code: `function inorderTraversal(root: TreeNode | null): number[] {
    const result: number[] = [];
    
    function inorder(node: TreeNode | null): void {
        if (node === null) return;
        
        inorder(node.left);   // Visit left subtree
        result.push(node.val); // Visit root
        inorder(node.right);  // Visit right subtree
    }
    
    inorder(root);
    return result;
}`,
      explanation: 'Recursively traverse the tree in Left-Root-Right order. For each node, we first visit all nodes in the left subtree, then process the current node, then visit all nodes in the right subtree.',
      keyInsights: [
        'Inorder traversal of BST gives sorted sequence',
        'Recursive approach is intuitive and clean',
        'Stack space is proportional to tree height'
      ],
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Start at Root',
          description: 'Begin inorder traversal at root node (1)',
          data: { 
            tree: { val: 1, right: { val: 2, left: { val: 3 } } },
            result: [],
            currentNode: 1,
            callStack: ['inorder(1)']
          },
          animations: [
            { type: 'highlight', targets: ['node-1'], duration: 0.6, properties: { color: '#3b82f6' } }
          ]
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Check Left Child',
          description: 'Node 1 has no left child, so we process the root',
          data: { 
            tree: { val: 1, right: { val: 2, left: { val: 3 } } },
            result: [1],
            currentNode: 1,
            callStack: ['inorder(1)']
          },
          animations: [
            { type: 'traverse', targets: ['node-1'], duration: 0.8 }
          ]
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: 'Visit Right Subtree',
          description: 'Move to right child (2) and repeat the process',
          data: { 
            tree: { val: 1, right: { val: 2, left: { val: 3 } } },
            result: [1],
            currentNode: 2,
            callStack: ['inorder(1)', 'inorder(2)']
          },
          animations: [
            { type: 'highlight', targets: ['node-2'], duration: 0.6, properties: { color: '#3b82f6' } }
          ]
        },
        {
          id: 'step-4',
          stepNumber: 4,
          title: 'Process Left Child of 2',
          description: 'Visit left child (3) first, then process node 2',
          data: { 
            tree: { val: 1, right: { val: 2, left: { val: 3 } } },
            result: [1, 3, 2],
            currentNode: null,
            callStack: []
          },
          animations: [
            { type: 'traverse', targets: ['node-3', 'node-2'], duration: 1.0 }
          ]
        }
      ]
    },
    relatedPatterns: ['Tree DFS', 'Recursion'],
    tags: ['tree', 'dfs', 'recursion', 'traversal'],
    visualizationType: 'tree'
  },

  {
    id: 'graph-bfs-shortest-path',
    title: 'Shortest Path in Unweighted Graph',
    category: 'Graph',
    difficulty: 'Medium',
    description: 'Find the shortest path between two nodes in an unweighted graph using BFS.',
    constraints: [
      '1 ≤ n ≤ 100 (number of nodes)',
      '0 ≤ edges ≤ n*(n-1)/2',
      'Graph is connected',
      'Nodes are labeled 0 to n-1'
    ],
    examples: [
      {
        id: 'example-1',
        input: { 
          n: 6, 
          edges: [[0,1], [0,2], [1,3], [2,4], [3,5], [4,5]], 
          start: 0, 
          end: 5 
        },
        output: 3,
        explanation: 'Shortest path: 0 → 1 → 3 → 5 (length 3)'
      }
    ],
    solution: {
      id: 'bfs-shortest-path',
      approach: 'Breadth-First Search',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      code: `function shortestPath(n: number, edges: number[][], start: number, end: number): number {
    // Build adjacency list
    const graph: number[][] = Array(n).fill(null).map(() => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const queue: number[] = [start];
    const visited: boolean[] = Array(n).fill(false);
    const distance: number[] = Array(n).fill(-1);
    
    visited[start] = true;
    distance[start] = 0;
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        
        if (node === end) {
            return distance[end];
        }
        
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                distance[neighbor] = distance[node] + 1;
                queue.push(neighbor);
            }
        }
    }
    
    return -1; // No path found
}`,
      explanation: 'BFS explores nodes level by level, guaranteeing that when we first reach the target node, we\'ve found the shortest path. We use a queue to process nodes in order and track distances.',
      keyInsights: [
        'BFS guarantees shortest path in unweighted graphs',
        'Process nodes level by level using a queue',
        'Track visited nodes to avoid cycles'
      ],
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Initialize BFS',
          description: 'Start BFS from node 0, add to queue and mark as visited',
          data: {
            graph: [[1,2], [0,3], [0,4], [1,5], [2,5], [3,4]],
            queue: [0],
            visited: [true, false, false, false, false, false],
            distance: [0, -1, -1, -1, -1, -1],
            current: 0
          },
          animations: [
            { type: 'highlight', targets: ['node-0'], duration: 0.6, properties: { color: '#3b82f6' } }
          ]
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Explore Neighbors',
          description: 'Process node 0: add unvisited neighbors 1 and 2 to queue',
          data: {
            graph: [[1,2], [0,3], [0,4], [1,5], [2,5], [3,4]],
            queue: [1, 2],
            visited: [true, true, true, false, false, false],
            distance: [0, 1, 1, -1, -1, -1],
            current: 0
          },
          animations: [
            { type: 'traverse', targets: ['edge-0-1', 'edge-0-2'], duration: 0.8 },
            { type: 'highlight', targets: ['node-1', 'node-2'], duration: 0.6 }
          ]
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: 'Continue BFS',
          description: 'Process nodes at distance 1, then distance 2, until we reach node 5',
          data: {
            graph: [[1,2], [0,3], [0,4], [1,5], [2,5], [3,4]],
            queue: [],
            visited: [true, true, true, true, true, true],
            distance: [0, 1, 1, 2, 2, 3],
            current: 5,
            pathFound: true
          },
          animations: [
            { type: 'highlight', targets: ['path-0-1-3-5'], duration: 1.2, properties: { color: '#10b981' } }
          ]
        }
      ]
    },
    relatedPatterns: ['Graph BFS', 'Shortest Path'],
    tags: ['graph', 'bfs', 'shortest-path', 'unweighted'],
    visualizationType: 'graph'
  }
]

export const getProblemsByCategory = (category: string) => {
  return algorithmProblems.filter(problem => problem.category === category)
}

export const getProblemById = (id: string) => {
  return algorithmProblems.find(problem => problem.id === id)
}

export const getAllCategories = () => {
  return [...new Set(algorithmProblems.map(problem => problem.category))]
}

export const getProblemsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  return algorithmProblems.filter(problem => problem.difficulty === difficulty)
}

export const searchProblems = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return algorithmProblems.filter(problem => 
    problem.title.toLowerCase().includes(lowercaseQuery) ||
    problem.description.toLowerCase().includes(lowercaseQuery) ||
    problem.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}