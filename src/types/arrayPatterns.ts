export interface ArrayPatternStep {
  stepNumber: number;
  title: string;
  description: string;
  array: number[];
  pointers: Pointer[];
  window?: Window;
  comparisons?: Comparison[];
  action: PatternAction;
  result?: any;
}

export interface Pointer {
  id: string;
  name: string;
  position: number;
  color: string;
  type: 'left' | 'right' | 'slow' | 'fast' | 'current';
}

export interface Window {
  left: number;
  right: number;
  highlight: boolean;
  color?: string;
  sum?: number;
  size?: number;
}

export interface Comparison {
  indices: number[];
  values: number[];
  result: 'equal' | 'less' | 'greater' | 'found' | 'not-found';
  operation: string;
}

export type PatternAction = 
  | 'initialize'
  | 'move-left'
  | 'move-right' 
  | 'move-both'
  | 'expand-window'
  | 'contract-window'
  | 'slide-window'
  | 'compare'
  | 'found-solution'
  | 'no-solution';

export interface ArrayPattern {
  id: string;
  title: string;
  description: string;
  type: 'two-pointers' | 'sliding-window';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  approach: string;
  keyInsights: string[];
  steps: ArrayPatternStep[];
}

export interface ArrayPatternVisualizerProps {
  pattern: ArrayPattern;
  isPlaying: boolean;
  currentStep: number;
  onStepChange: (step: number) => void;
  onPlayPause: () => void;
  speed: number;
}