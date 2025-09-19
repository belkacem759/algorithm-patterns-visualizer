export interface AlgorithmCodeData {
  code: string;
  stepToLines: Record<number, number[]>;
}

export const ALGORITHM_CODE: Record<string, AlgorithmCodeData> = {
  'two-sum': {
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
      0: [2, 3], // Initialize pointers
      1: [5], // Check condition
      2: [6], // Calculate sum
      3: [8, 9], // Found target
      4: [10, 11], // Sum too small, move left
      5: [12, 13], // Sum too large, move right
      6: [17], // Return empty if not found
    }
  },

  'palindrome': {
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
      0: [2, 3], // Initialize pointers
      1: [5], // Check condition
      2: [6, 7], // Compare elements
      3: [8, 9], // Move pointers inward
      4: [12], // Return true if palindrome
    }
  },

  'max-subarray': {
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
      0: [2, 3], // Initialize variables
      1: [6, 7], // Calculate first window
      2: [9], // Set initial max
      3: [12, 13], // Slide window
      4: [13, 14], // Update max sum
      5: [16], // Return result
    }
  },

  'longest-unique': {
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
      0: [2, 3, 4], // Initialize variables
      1: [6], // Expand window
      2: [7, 8, 9], // Remove duplicates
      3: [12], // Add current character
      4: [13], // Update max length
      5: [16], // Return result
    }
  }
};