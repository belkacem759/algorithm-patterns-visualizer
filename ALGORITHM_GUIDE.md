# Algorithm Guide

## How to Add New Algorithms

The codebase is now clean and extensible. Here's how to add new algorithms:

### 1. Implement the Algorithm Logic

Create your algorithm function in the appropriate file:

- **Two Pointers**: Add to `src/algorithms/twoPointers.ts`
- **Sliding Window**: Add to `src/algorithms/slidingWindow.ts` 
- **New Category**: Create a new file like `src/algorithms/binarySearch.ts`

```typescript
export function binarySearch(arr: number[], target: number): AlgorithmResult {
  const steps: ArrayPatternStep[] = [];
  // ... your algorithm implementation
  return { steps };
}
```

### 2. Register in the Algorithm Index

Add your algorithm to `src/algorithms/index.ts`:

```typescript
'binary-search': {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Binary Search',
  description: 'Find target element in sorted array using binary search',
  requiredParams: ['target'],
  defaultExample: { array: [1, 3, 5, 7, 9, 11, 13], target: 7 },
  execute: (data) => binarySearch(data.array, data.target!),
  code: `// Your algorithm code here`,
  stepToLines: { 0: [1, 2], 1: [5, 6] } // Map steps to code lines
}
```

### 3. Add Category (if new)

If you're adding a new category, update the `ALGORITHM_CATEGORIES` array:

```typescript
{
  name: 'Binary Search',
  algorithms: Object.values(ALGORITHMS).filter(algo => algo.category === 'Binary Search')
}
```

### 4. Update Types (if needed)

If your algorithm needs new parameters, add them to `UserInputData` in `src/types/simple.ts`:

```typescript
export interface UserInputData {
  array: number[]
  target?: number    // For search algorithms
  k?: number        // For window-based algorithms
  start?: number    // New parameter example
  end?: number      // New parameter example
}
```

### 5. Update UserInput Component (if needed)

If you added new parameters, add input fields in `src/components/UserInput.tsx`:

```typescript
{algorithmType === 'binary-search' && (
  <div>
    <label>Target Value</label>
    <input type="number" ... />
  </div>
)}
```

## Current Structure

- **Clean**: Removed 800+ lines of boilerplate code
- **Dynamic**: Users can input their own arrays and parameters  
- **Extensible**: Easy to add new algorithms with the registry pattern
- **Type-Safe**: Simplified from 229-line type file to 26 lines
- **Consolidated**: Single source of truth for each algorithm

## Algorithm Categories

1. **Two Pointers**: two-sum, palindrome
2. **Sliding Window**: max-subarray, longest-unique

Ready for expansion with binary search, dynamic programming, graph algorithms, etc.
