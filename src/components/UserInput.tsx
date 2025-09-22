import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

import type { UserInputData } from '../types/simple';

interface UserInputProps {
  algorithmType: string;
  onInputChange: (data: UserInputData) => void;
  initialData?: UserInputData;
}

export const UserInput: React.FC<UserInputProps> = ({
  algorithmType,
  onInputChange,
  initialData
}) => {
  const [arrayInput, setArrayInput] = useState(
    initialData?.array.join(', ') || getDefaultArray(algorithmType)
  );
  const [target, setTarget] = useState(initialData?.target?.toString() || getDefaultTarget(algorithmType));
  const [k, setK] = useState(initialData?.k?.toString() || getDefaultK(algorithmType));
  const [error, setError] = useState('');

  function getDefaultArray(type: string): string {
    switch (type) {
      case 'two-sum': return '2, 7, 11, 15, 18, 22, 25, 30';
      case 'palindrome': return '1, 2, 3, 2, 1, 4, 5, 6, 7, 8, 9';
      case 'max-subarray': return '2, 1, 5, 1, 3, 2, 7, 4, 6, 3, 8, 1, 2, 5';
      case 'longest-unique': return '1, 2, 3, 1, 2, 4, 5, 6, 2, 7, 8, 9, 1, 3';
      default: return '1, 2, 3, 4, 5';
    }
  }

  function getDefaultTarget(type: string): string {
    return type === 'two-sum' ? '9' : '';
  }

  function getDefaultK(type: string): string {
    return type === 'max-subarray' ? '4' : '';
  }

  const handleSubmit = () => {
    try {
      setError('');
      
      // Parse array
      const parsedArray = arrayInput
        .split(',')
        .map(item => {
          const num = parseInt(item.trim());
          if (isNaN(num)) throw new Error(`"${item.trim()}" is not a valid number`);
          return num;
        });

      if (parsedArray.length === 0) {
        throw new Error('Array cannot be empty');
      }

      // Validation based on algorithm type
      const data: UserInputData = { array: parsedArray };

      if (algorithmType === 'two-sum') {
        if (!target) throw new Error('Target value is required for Two Sum');
        data.target = parseInt(target);
        if (isNaN(data.target)) throw new Error('Target must be a valid number');
      }

      if (algorithmType === 'max-subarray') {
        if (!k) throw new Error('Window size (k) is required for Max Subarray');
        data.k = parseInt(k);
        if (isNaN(data.k) || data.k <= 0) throw new Error('Window size must be a positive number');
        if (data.k > parsedArray.length) throw new Error('Window size cannot be larger than array length');
      }

      onInputChange(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithmType) {
      case 'two-sum':
        return 'Enter numbers separated by commas and a target sum to find two numbers that add up to the target.';
      case 'palindrome':
        return 'Enter numbers separated by commas to check if the array reads the same forwards and backwards.';
      case 'max-subarray':
        return 'Enter numbers separated by commas and window size (k) to find the maximum sum of any subarray of size k.';
      case 'longest-unique':
        return 'Enter numbers separated by commas to find the longest substring with all unique elements.';
      default:
        return '';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Input Your Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{getAlgorithmDescription()}</p>
        
        {/* Array Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Array (comma-separated numbers)
          </label>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 1, 2, 3, 4, 5"
          />
        </div>

        {/* Target Input for Two Sum */}
        {algorithmType === 'two-sum' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Sum
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 9"
            />
          </div>
        )}

        {/* K Input for Max Subarray */}
        {algorithmType === 'max-subarray' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Window Size (k)
            </label>
            <input
              type="number"
              value={k}
              onChange={(e) => setK(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 3"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          className="w-full"
        >
          Apply Changes
        </Button>
      </CardContent>
    </Card>
  );
};
