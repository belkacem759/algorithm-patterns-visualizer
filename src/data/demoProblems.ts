import type { AlgorithmProblem } from '../types/algorithm'

export const demoProblems: AlgorithmProblem[] = [
  {
    id: 'demo-two-sum',
    title: 'Two Sum (Demo)',
    description: 'Find two numbers in an array that add up to a target sum',
    difficulty: 'Easy',
    category: 'Array',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    tags: ['array', 'hash-table'],
    visualizationType: 'array',
    relatedPatterns: ['hash-table-lookup'],
    examples: [
      {
        id: 'example-1',
        input: { array: [2, 7, 11, 15], target: 9 },
        output: [0, 1],
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
      },
      {
        id: 'example-2',
        input: { array: [3, 2, 4], target: 6 },
        output: [1, 2],
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
      }
    ],
    solution: {
      id: 'two-sum-solution',
      approach: 'Hash Table',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: 'function twoSum(nums, target) {\n  const map = new Map()\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i]\n    if (map.has(complement)) {\n      return [map.get(complement), i]\n    }\n    map.set(nums[i], i)\n  }\n}',
      explanation: 'Use a hash map to store numbers and their indices, then check for complements',
      keyInsights: ['Hash table provides O(1) lookup', 'Single pass through array'],
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Initialize',
          description: 'Initialize hash map to store numbers and their indices',
          code: 'const map = new Map()',
          animations: [
            {
              type: 'highlight',
              targets: [],
              duration: 1000,
              properties: { backgroundColor: '#e3f2fd' }
            }
          ],
          pointers: [],
          data: { array: [2, 7, 11, 15], target: 9, map: {} }
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Iterate',
          description: 'Iterate through array, check if complement exists',
          code: 'for (let i = 0; i < nums.length; i++) {\n  const complement = target - nums[i]\n  if (map.has(complement)) {\n    return [map.get(complement), i]\n  }\n  map.set(nums[i], i)\n}',
          animations: [
            {
              type: 'traverse',
              targets: ['0'],
              duration: 800,
              properties: { backgroundColor: '#fff3e0' }
            }
          ],
          pointers: [
            { id: 'current', name: 'i', position: 0, color: '#2196f3', type: 'current' }
          ],
          data: { array: [2, 7, 11, 15], target: 9, map: {}, complement: 7 }
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: 'Found',
          description: 'Found complement at index 1, return indices [0, 1]',
          code: 'return [0, 1]',
          animations: [
            {
              type: 'highlight',
              targets: ['0', '1'],
              duration: 1000,
              properties: { backgroundColor: '#c8e6c9' }
            }
          ],
          pointers: [
            { id: 'result1', name: 'first', position: 0, color: '#4caf50', type: 'target' },
            { id: 'result2', name: 'second', position: 1, color: '#4caf50', type: 'target' }
          ],
          data: { array: [2, 7, 11, 15], target: 9, map: { 2: 0 }, result: [0, 1] }
        }
      ]
    }
  }
]