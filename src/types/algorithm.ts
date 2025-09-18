// Enhanced types for problem-solving focused algorithm visualization

export interface AlgorithmProblem {
  id: string
  title: string
  category: AlgorithmCategory
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  constraints: string[]
  examples: ProblemExample[]
  solution: AlgorithmSolution
  relatedPatterns: string[]
  tags: string[]
  visualizationType: VisualizationType
}

export interface ProblemExample {
  id: string
  input: any
  output: any
  explanation: string
}

export interface AlgorithmSolution {
  id: string
  approach: string
  timeComplexity: string
  spaceComplexity: string
  code: string
  explanation: string
  steps: SolutionStep[]
  keyInsights: string[]
}

export interface SolutionStep {
  id: string
  stepNumber: number
  title: string
  description: string
  code?: string
  highlight?: number[]
  data: any
  pointers?: Pointer[]
  comparisons?: Comparison[]
  swaps?: Swap[]
  animations?: StepAnimation[]
  metadata?: Record<string, any>
}

export interface StepAnimation {
  type: 'highlight' | 'move' | 'swap' | 'compare' | 'insert' | 'delete' | 'traverse'
  targets: string[]
  duration: number
  delay?: number
  properties?: Record<string, any>
}

export interface Pointer {
  id: string
  name: string
  position: number
  color: string
  type: 'left' | 'right' | 'current' | 'target' | 'slow' | 'fast' | 'start' | 'end'
  description?: string
}

export interface Comparison {
  indices: number[]
  values: any[]
  result: 'equal' | 'less' | 'greater'
  timestamp: number
  description?: string
}

export interface Swap {
  indices: [number, number]
  values: [any, any]
  timestamp: number
  description?: string
}

export type AlgorithmCategory = 
  | 'Array'
  | 'String'
  | 'Tree'
  | 'Graph'
  | 'Stack'
  | 'Queue'
  | 'Heap'
  | 'Sorting'
  | 'Searching'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Backtracking'
  | 'Divide and Conquer'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Binary Search'

export type VisualizationType = 
  | 'array'
  | 'tree'
  | 'graph'
  | 'stack'
  | 'queue'
  | 'linkedlist'
  | 'heap'
  | 'matrix'
  | 'string'

export interface ProblemState {
  currentProblem: AlgorithmProblem | null
  currentExample: ProblemExample | null
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  isPaused: boolean
  speed: number
  data: any
  pointers: Pointer[]
  history: SolutionStep[]
  executionMode: 'step-by-step' | 'continuous' | 'interactive'
}

export interface AnimationConfig {
  duration: number
  ease: string
  stagger?: number
  delay?: number
  scale?: number
  color?: string
}

export interface VisualizationElement {
  id: string
  value: any
  position: { x: number; y: number }
  size: { width: number; height: number }
  color: string
  isHighlighted: boolean
  isActive: boolean
  isComparing: boolean
  isSorted?: boolean
  isVisited?: boolean
  metadata?: Record<string, any>
}

// Tree-specific types
export interface TreeNode {
  id: string
  value: any
  left?: TreeNode
  right?: TreeNode
  parent?: TreeNode
  level?: number
  position?: { x: number; y: number }
  isHighlighted?: boolean
  isVisited?: boolean
  color?: string
}

// Graph-specific types
export interface GraphNode {
  id: string
  value: any
  position: { x: number; y: number }
  neighbors: string[]
  isHighlighted?: boolean
  isVisited?: boolean
  distance?: number
  color?: string
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  weight?: number
  isHighlighted?: boolean
  isTraversed?: boolean
  color?: string
}

// Legacy support for existing patterns (to be migrated)
export interface AlgorithmPattern {
  id: string
  name: string
  category: AlgorithmCategory
  description: string
  timeComplexity: string
  spaceComplexity: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  examples: AlgorithmExample[]
  visualizationType: VisualizationType
}

export interface AlgorithmExample {
  id: string
  name: string
  description: string
  input: any
  expectedOutput: any
  steps: AlgorithmStep[]
}

export interface AlgorithmStep {
  id: string
  description: string
  code?: string
  highlight?: number[]
  data: any
  pointers?: Pointer[]
  comparisons?: Comparison[]
  swaps?: Swap[]
  metadata?: Record<string, any>
}

export interface AlgorithmState {
  currentPattern: AlgorithmPattern | null
  currentExample: AlgorithmExample | null
  currentStep: number
  isPlaying: boolean
  isPaused: boolean
  speed: number
  data: any
  pointers: Pointer[]
  history: AlgorithmStep[]
}