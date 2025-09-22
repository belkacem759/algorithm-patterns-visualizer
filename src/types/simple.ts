// Simplified types for the algorithm visualizer
export interface UserInputData {
  array: number[]
  target?: number
  k?: number
}

export interface ArrayPatternStep {
  stepNumber: number
  title: string
  description: string
  array: number[]
  pointers?: Pointer[]
  window?: SlidingWindow
  comparisons?: Comparison[]
  action: 'initialize' | 'slide-window' | 'expand-window' | 'contract-window' | 'found-solution' | 'no-solution' | 'compare' | 'move-left' | 'move-right' | 'move-both'
  result?: any
}

export interface Comparison {
  indices: number[]
  values: any[]
  result: 'equal' | 'less' | 'greater' | 'found' | 'not-found'
  operation?: string
  description?: string
}

export interface Pointer {
  id: string
  name: string
  position: number
  color: string
  type: 'left' | 'right' | 'current' | 'slow' | 'fast'
}

export interface SlidingWindow {
  left: number
  right: number
  highlight: boolean
  color: string
  sum?: number
  size: number
}

export interface AlgorithmResult {
  steps: ArrayPatternStep[]
}
