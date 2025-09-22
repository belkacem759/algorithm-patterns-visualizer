import type { ArrayPatternStep } from '../types/simple';

export interface TwoSumResult {
  indices: [number, number] | null;
  steps: ArrayPatternStep[];
}

export interface ValidPalindromeResult {
  isPalindrome: boolean;
  steps: ArrayPatternStep[];
}

// Two Sum - Sorted Array (Two Pointers approach)
export function twoSumSorted(nums: number[], target: number): TwoSumResult {
  const steps: ArrayPatternStep[] = [];
  let left = 0;
  let right = nums.length - 1;
  let stepNumber = 1;

  // Initial setup
  steps.push({
    stepNumber: stepNumber++,
    title: 'Initialize Pointers',
    description: 'Initialize two pointers: left at start, right at end',
    array: [...nums],
    pointers: [
      { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
      { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
    ],
    action: 'initialize'
  });

  while (left < right) {
    const sum = nums[left] + nums[right];
    
    steps.push({
      stepNumber: stepNumber++,
      title: 'Compare Sum',
      description: `Compare sum ${sum} with target ${target}`,
      array: [...nums],
      pointers: [
        { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
        { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
      ],
      comparisons: [{
        indices: [left, right],
        values: [nums[left], nums[right]],
        result: sum === target ? 'found' : sum < target ? 'less' : 'greater',
        operation: `${nums[left]} + ${nums[right]} = ${sum}`
      }],
      action: 'compare'
    });

    if (sum === target) {
      steps.push({
        stepNumber: stepNumber++,
        title: 'Solution Found',
        description: `Found target! Indices [${left}, ${right}]`,
        array: [...nums],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#10b981', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#10b981', type: 'right' }
        ],
        action: 'found-solution',
        result: [left, right]
      });
      return { indices: [left, right], steps };
    } else if (sum < target) {
      left++;
      steps.push({
        stepNumber: stepNumber++,
        title: 'Move Left Pointer',
        description: `Sum too small, move left pointer right to ${left}`,
        array: [...nums],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
        ],
        action: 'move-left'
      });
    } else {
      right--;
      steps.push({
        stepNumber: stepNumber++,
        title: 'Move Right Pointer',
        description: `Sum too large, move right pointer left to ${right}`,
        array: [...nums],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
        ],
        action: 'move-right'
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    title: 'No Solution',
    description: 'No solution found',
    array: [...nums],
    pointers: [],
    action: 'no-solution'
  });

  return { indices: null, steps };
}

// Valid Palindrome (Two Pointers approach) - Modified to work with numbers
export function validPalindromeArray(arr: number[]): ValidPalindromeResult {
  const steps: ArrayPatternStep[] = [];
  let left = 0;
  let right = arr.length - 1;
  let stepNumber = 1;

  // Initial setup
  steps.push({
    stepNumber: stepNumber++,
    title: 'Initialize Pointers',
    description: 'Initialize pointers at both ends of array',
    array: [...arr],
    pointers: [
      { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
      { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
    ],
    action: 'initialize'
  });

  while (left < right) {
    const leftVal = arr[left];
    const rightVal = arr[right];
    
    steps.push({
      stepNumber: stepNumber++,
      title: 'Compare Values',
      description: `Compare ${leftVal} with ${rightVal}`,
      array: [...arr],
      pointers: [
        { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
        { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
      ],
      comparisons: [{
        indices: [left, right],
        values: [leftVal, rightVal],
        result: leftVal === rightVal ? 'equal' : 'not-found',
        operation: `${leftVal} === ${rightVal}`
      }],
      action: 'compare'
    });

    if (leftVal !== rightVal) {
      steps.push({
        stepNumber: stepNumber++,
        title: 'Not Palindrome',
        description: 'Values don\'t match - not a palindrome',
        array: [...arr],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#ef4444', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
        ],
        action: 'no-solution',
        result: false
      });
      return { isPalindrome: false, steps };
    }

    left++;
    right--;
    
    if (left < right) {
      steps.push({
        stepNumber: stepNumber++,
        title: 'Move Pointers',
        description: 'Values match, move both pointers inward',
        array: [...arr],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
        ],
        action: 'move-both'
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    title: 'Is Palindrome',
    description: 'All values matched - it\'s a palindrome!',
    array: [...arr],
    pointers: [],
    action: 'found-solution',
    result: true
  });

  return { isPalindrome: true, steps };
}