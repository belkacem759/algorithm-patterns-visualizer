import type { ArrayPatternStep } from '../types/simple';

export interface MaxSubarrayResult {
  maxSum: number;
  indices: [number, number] | null;
  steps: ArrayPatternStep[];
}

export interface LongestSubstringResult {
  maxLength: number;
  substring: number[];
  steps: ArrayPatternStep[];
}

// Maximum Sum Subarray of Size K (Fixed Size Sliding Window)
export function maxSubarraySum(nums: number[], k: number): MaxSubarrayResult {
  const steps: ArrayPatternStep[] = [];
  let stepNumber = 1;
  
  if (nums.length < k) {
    steps.push({
      stepNumber: stepNumber++,
      title: 'Invalid Input',
      description: `Array length ${nums.length} is less than window size ${k}`,
      array: [...nums],
      pointers: [],
      action: 'no-solution'
    });
    return { maxSum: 0, indices: null, steps };
  }

  let windowSum = 0;
  let maxSum = -Infinity;
  let maxStart = 0;
  let maxEnd = k - 1;

  // Calculate initial window sum
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }

  steps.push({
    stepNumber: stepNumber++,
    title: 'Initialize Window',
    description: `Create initial window of size ${k}, sum = ${windowSum}`,
    array: [...nums],
    pointers: [],
    window: {
      left: 0,
      right: k - 1,
      highlight: true,
      color: '#3b82f6',
      sum: windowSum,
      size: k
    },
    action: 'initialize'
  });

  maxSum = windowSum;

  // Slide the window
  for (let i = k; i < nums.length; i++) {
    const oldLeft = i - k;
    const newRight = i;
    
    // Remove leftmost element and add rightmost element
    windowSum = windowSum - nums[oldLeft] + nums[newRight];
    
    steps.push({
      stepNumber: stepNumber++,
      title: 'Slide Window',
      description: `Remove ${nums[oldLeft]}, add ${nums[newRight]}, new sum = ${windowSum}`,
      array: [...nums],
      pointers: [],
      window: {
        left: oldLeft + 1,
        right: newRight,
        highlight: true,
        color: '#3b82f6',
        sum: windowSum,
        size: k
      },
      action: 'slide-window'
    });

    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxStart = oldLeft + 1;
      maxEnd = newRight;
      
      steps.push({
        stepNumber: stepNumber++,
        title: 'New Maximum',
        description: `Found new maximum sum: ${maxSum}`,
        array: [...nums],
        pointers: [],
        window: {
          left: maxStart,
          right: maxEnd,
          highlight: true,
          color: '#10b981',
          sum: maxSum,
          size: k
        },
        action: 'found-solution'
      });
    }
  }

  steps.push({
    stepNumber: stepNumber++,
    title: 'Final Result',
    description: `Maximum sum subarray: ${maxSum} at indices [${maxStart}, ${maxEnd}]`,
    array: [...nums],
    pointers: [],
    window: {
      left: maxStart,
      right: maxEnd,
      highlight: true,
      color: '#10b981',
      sum: maxSum,
      size: k
    },
    action: 'found-solution',
    result: { maxSum, indices: [maxStart, maxEnd] }
  });

  return { maxSum, indices: [maxStart, maxEnd], steps };
}

// Longest Subarray with Unique Elements (Variable Size Sliding Window)
export function longestUniqueSubarray(nums: number[]): LongestSubstringResult {
  const steps: ArrayPatternStep[] = [];
  let stepNumber = 1;
  
  if (nums.length === 0) {
    steps.push({
      stepNumber: stepNumber++,
      title: 'Empty Array',
      description: 'Array is empty',
      array: [],
      pointers: [],
      action: 'no-solution'
    });
    return { maxLength: 0, substring: [], steps };
  }

  let left = 0;
  let right = 0;
  let maxLength = 0;
  let maxStart = 0;
  let maxEnd = 0;
  const seen = new Set<number>();

  steps.push({
    stepNumber: stepNumber++,
    title: 'Initialize Window',
    description: 'Start with empty window at beginning',
    array: [...nums],
    pointers: [
      { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
      { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
    ],
    window: {
      left: left,
      right: right,
      highlight: true,
      color: '#f59e0b',
      size: 1
    },
    action: 'initialize'
  });

  while (right < nums.length) {
    const currentNum = nums[right];
    
    if (!seen.has(currentNum)) {
      // Expand window
      seen.add(currentNum);
      const currentLength = right - left + 1;
      
      steps.push({
        stepNumber: stepNumber++,
        title: 'Expand Window',
        description: `Add ${currentNum} to window, length = ${currentLength}`,
        array: [...nums],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
        ],
        window: {
          left: left,
          right: right,
          highlight: true,
          color: '#10b981',
          size: currentLength
        },
        action: 'expand-window'
      });

      if (currentLength > maxLength) {
        maxLength = currentLength;
        maxStart = left;
        maxEnd = right;
        
        steps.push({
          stepNumber: stepNumber++,
          title: 'New Maximum',
          description: `New longest unique subarray: length ${maxLength}`,
          array: [...nums],
          pointers: [
            { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
            { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
          ],
          window: {
            left: left,
            right: right,
            highlight: true,
            color: '#8b5cf6',
            size: maxLength
          },
          action: 'found-solution'
        });
      }
      
      right++;
    } else {
      // Contract window from left until duplicate is removed
      steps.push({
        stepNumber: stepNumber++,
        title: 'Duplicate Found',
        description: `${currentNum} already in window, need to contract`,
        array: [...nums],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
        ],
        window: {
          left: left,
          right: right - 1,
          highlight: true,
          color: '#ef4444',
          size: right - left
        },
        action: 'contract-window'
      });
      
      while (nums[left] !== currentNum) {
        seen.delete(nums[left]);
        left++;
      }
      seen.delete(nums[left]);
      left++;
      
      steps.push({
        stepNumber: stepNumber++,
        title: 'Contract Window',
        description: `Moved left pointer to ${left}, removed duplicate`,
        array: [...nums],
        pointers: [
          { id: 'left', name: 'left', position: left, color: '#3b82f6', type: 'left' },
          { id: 'right', name: 'right', position: right, color: '#ef4444', type: 'right' }
        ],
        window: {
          left: left,
          right: right - 1,
          highlight: true,
          color: '#f59e0b',
          size: right - left
        },
        action: 'contract-window'
      });
    }
  }

  const resultSubstring = nums.slice(maxStart, maxEnd + 1);
  
  steps.push({
    stepNumber: stepNumber++,
    title: 'Final Result',
    description: `Longest unique subarray: length ${maxLength}`,
    array: [...nums],
    pointers: [],
    window: {
      left: maxStart,
      right: maxEnd,
      highlight: true,
      color: '#10b981',
      size: maxLength
    },
    action: 'found-solution',
    result: { maxLength, substring: resultSubstring }
  });

  return { maxLength, substring: resultSubstring, steps };
}