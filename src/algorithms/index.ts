// Clean registry for all algorithms - easy to extend
import { twoSumSorted, validPalindromeArray } from './twoPointers';
import { maxSubarraySum, longestUniqueSubarray } from './slidingWindow';
import type { UserInputData, AlgorithmResult } from '../types/simple';

export interface AlgorithmDefinition {
  id: string;
  name: string;
  category: 'Two Pointers' | 'Sliding Window' | 'Binary Search' | 'Dynamic Programming';
  description: string;
  requiredParams: ('target' | 'k')[];
  defaultExample: UserInputData;
  execute: (data: UserInputData) => AlgorithmResult;
  code: string;
  stepToLines: Record<number, number[]>;
}

export const ALGORITHMS: Record<string, AlgorithmDefinition> = {
  'two-sum': {
    id: 'two-sum',
    name: 'Two Sum',
    category: 'Two Pointers',
    description: 'Find two numbers that add up to a target sum using two pointers.',
    requiredParams: ['target'],
    defaultExample: { array: [2, 7, 11, 15, 18, 22, 25, 30], target: 9 },
    execute: (data) => twoSumSorted(data.array, data.target!),
    code: `var twoSum = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];
};`,
    stepToLines: {
      0: [2, 3], 1: [5], 2: [6], 3: [8, 9], 4: [10, 11], 5: [12, 13], 6: [17]
    }
  },

  'palindrome': {
    id: 'palindrome',
    name: 'Valid Palindrome',
    category: 'Two Pointers',
    description: 'Check if array reads the same forwards and backwards using two pointers.',
    requiredParams: [],
    defaultExample: { array: [1, 2, 3, 2, 1, 4, 5, 6, 7, 8, 9] },
    execute: (data) => validPalindromeArray(data.array),
    code: `var isPalindrome = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        if (nums[left] !== nums[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
};`,
    stepToLines: {
      0: [2, 3], 1: [5], 2: [6, 7], 3: [8, 9], 4: [12]
    }
  },

  'max-subarray': {
    id: 'max-subarray',
    name: 'Maximum Subarray Sum',
    category: 'Sliding Window',
    description: 'Find maximum sum of any contiguous subarray of size k.',
    requiredParams: ['k'],
    defaultExample: { array: [2, 1, 5, 1, 3, 2, 7, 4, 6, 3, 8, 1, 2, 5], k: 4 },
    execute: (data) => maxSubarraySum(data.array, data.k!),
    code: `var maxSubarraySum = function(nums, k) {
    let maxSum = 0;
    let windowSum = 0;
    
    // Calculate sum of first window
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    maxSum = windowSum;
    
    // Slide the window
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
};`,
    stepToLines: {
      0: [2, 3], 1: [6, 7], 2: [9], 3: [12, 13], 4: [13, 14], 5: [16]
    }
  },

  'longest-unique': {
    id: 'longest-unique',
    name: 'Longest Unique Substring',
    category: 'Sliding Window',
    description: 'Find longest substring with all unique elements using sliding window.',
    requiredParams: [],
    defaultExample: { array: [1, 2, 3, 1, 2, 4, 5, 6, 2, 7, 8, 9, 1, 3] },
    execute: (data) => longestUniqueSubarray(data.array),
    code: `var lengthOfLongestSubstring = function(s) {
    let left = 0;
    let maxLength = 0;
    const seen = new Set();
    
    for (let right = 0; right < s.length; right++) {
        while (seen.has(s[right])) {
            seen.delete(s[left]);
            left++;
        }
        
        seen.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
};`,
    stepToLines: {
      0: [2, 3, 4], 1: [6], 2: [7, 8, 9], 3: [12], 4: [13], 5: [16]
    }
  }
};

export const ALGORITHM_CATEGORIES = [
  {
    name: 'Two Pointers',
    algorithms: Object.values(ALGORITHMS).filter(algo => algo.category === 'Two Pointers')
  },
  {
    name: 'Sliding Window', 
    algorithms: Object.values(ALGORITHMS).filter(algo => algo.category === 'Sliding Window')
  }
];
