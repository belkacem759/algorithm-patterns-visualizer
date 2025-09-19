import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import {
  longestUniqueSubarray,
  maxSubarraySum
} from '../algorithms/slidingWindow';
import {
  twoSumSorted,
  validPalindromeArray
} from '../algorithms/twoPointers';
import { ALGORITHM_CODE } from '../data/algorithmCode';
import { CodeDisplay } from './CodeDisplay';
import { Button } from './ui/Button';
import { Sidebar } from './ui/Sidebar';

type AlgorithmType = 'two-sum' | 'palindrome' | 'max-subarray' | 'longest-unique';

interface AlgorithmData {
  array: number[];
  target?: number;
  k?: number;
}

const SAMPLE_DATA: Record<AlgorithmType, AlgorithmData> = {
  'two-sum': {
    array: [2, 7, 11, 15, 18, 22, 25, 30],
    target: 9
  },
  'palindrome': {
    array: [1, 2, 3, 2, 1, 4, 5, 6, 7, 8, 9]
  },
  'max-subarray': {
    array: [2, 1, 5, 1, 3, 2, 7, 4, 6, 3, 8, 1, 2, 5],
    k: 4
  },
  'longest-unique': {
    array: [1, 2, 3, 1, 2, 4, 5, 6, 2, 7, 8, 9, 1, 3]
  }
};

// Algorithm categories for the sidebar
const ALGORITHM_CATEGORIES = [
  {
    name: 'Two Pointers',
    algorithms: [
      {
        id: 'two-sum',
        name: 'Two Sum',
        description: 'Find two numbers that add up to target'
      },
      {
        id: 'palindrome',
        name: 'Valid Palindrome',
        description: 'Check if array reads same forwards/backwards'
      }
    ]
  },
  {
    name: 'Sliding Window',
    algorithms: [
      {
        id: 'max-subarray',
        name: 'Maximum Subarray',
        description: 'Find maximum sum of fixed-size subarray'
      },
      {
        id: 'longest-unique',
        name: 'Longest Unique',
        description: 'Find longest substring with unique elements'
      }
    ]
  }
];

export const ArrayPatternVisualizer: React.FC = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>('two-sum');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayDelay, setAutoPlayDelay] = useState(1000); // Default 1 second delay

  const arrayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize algorithm and generate steps
  useEffect(() => {
    const data = SAMPLE_DATA[currentAlgorithm];
    let result: any;

    switch (currentAlgorithm) {
      case 'two-sum':
        result = twoSumSorted(data.array, data.target!);
        break;
      case 'palindrome':
        result = validPalindromeArray(data.array);
        break;
      case 'max-subarray':
        result = maxSubarraySum(data.array, data.k!);
        break;
      case 'longest-unique':
        result = longestUniqueSubarray(data.array);
        break;
    }

    setSteps(result.steps);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsAutoPlaying(false);

    // Clear any existing auto-play timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
  }, [currentAlgorithm]);

  // Animation functions
  const animateStep = (step: any) => {
    if (!arrayRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    // Animate pointers
    if (step.pointers) {
      step.pointers.forEach((pointer: any) => {
        const pointerEl = arrayRef.current?.querySelector(`[data-pointer="${pointer.id}"]`);
        if (pointerEl) {
          timeline.to(pointerEl, {
            x: pointer.position * 60,
            duration: 0.5,
            ease: "power2.out"
          }, 0);
        }
      });
    }

    // Animate sliding window
    if (step.window) {
      const windowEl = arrayRef.current?.querySelector('[data-window]');
      if (windowEl) {
        timeline.to(windowEl, {
          x: step.window.start * 60,
          width: (step.window.end - step.window.start + 1) * 60,
          duration: 0.5,
          ease: "power2.out"
        }, 0);
      }
    }

    // Animate comparisons
    if (step.comparisons) {
      step.comparisons.forEach((comparison: any, comparisonIndex: number) => {
        const color = getComparisonColor(comparison.result);

        // Handle both single index and indices array (for Two Sum)
        const indicesToAnimate = comparison.indices || [comparison.index];

        indicesToAnimate.forEach((elementIndex: number, i: number) => {
          const elementEl = arrayRef.current?.querySelector(`[data-index="${elementIndex}"]`);
          if (elementEl) {
            timeline.to(elementEl, {
              backgroundColor: color,
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out"
            }, comparisonIndex * 0.1 + i * 0.05);

            timeline.to(elementEl, {
              backgroundColor: '#f3f4f6',
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            }, comparisonIndex * 0.1 + i * 0.05 + 0.5);
          }
        });
      });
    }
  };

  const getComparisonColor = (result: string) => {
    switch (result) {
      case 'equal':
      case 'found':
        return '#10b981'; // green
      case 'less':
        return '#f59e0b'; // orange
      case 'greater':
        return '#ef4444'; // red
      default:
        return '#8b5cf6'; // purple
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlaying && currentStep < steps.length - 1) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        animateStep(steps[nextStep]);
      }, autoPlayDelay);
    } else if (isAutoPlaying && currentStep >= steps.length - 1) {
      // Auto-play reached the end, stop it
      setIsAutoPlaying(false);
    }

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }
    };
  }, [isAutoPlaying, currentStep, steps, autoPlayDelay]);

  const handleAutoPlay = () => {
    if (isAutoPlaying) {
      // Stop auto-play
      setIsAutoPlaying(false);
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }
    } else {
      // Start auto-play
      if (currentStep >= steps.length - 1) {
        // If at the end, reset to beginning
        setCurrentStep(0);
      }
      setIsAutoPlaying(true);
    }
  };

  const handlePlay = () => {
    if (currentStep < steps.length - 1) {
      setIsPlaying(true);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      animateStep(steps[nextStep]);

      setTimeout(() => {
        setIsPlaying(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsAutoPlaying(false);
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      animateStep(steps[prevStep]);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      animateStep(steps[nextStep]);
    }
  };

  const handleAlgorithmSelect = (algorithmId: string) => {
    setCurrentAlgorithm(algorithmId as AlgorithmType);
  };

  const currentData = SAMPLE_DATA[currentAlgorithm];
  const currentStepData = steps[currentStep];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        categories={ALGORITHM_CATEGORIES}
        selectedAlgorithm={currentAlgorithm}
        onAlgorithmSelect={handleAlgorithmSelect}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Algorithm Pattern Visualizer
          </h1>
          <p className="text-gray-600">
            Interactive visualizations of two pointers and sliding window patterns with smooth GSAP animations.
          </p>
        </div>

        {/* Main Content - Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Panel */}
          <div className="w-1/2 border-r border-gray-200">
            <CodeDisplay
              algorithm={currentAlgorithm}
              currentStep={currentStep}
              code={ALGORITHM_CODE[currentAlgorithm]?.code || ''}
              highlightedLines={ALGORITHM_CODE[currentAlgorithm]?.stepToLines[currentStep] || []}
            />
          </div>

          {/* Visualization Panel */}
          <div className="w-1/2 flex flex-col">
            {/* Problem Description */}
            {currentStepData && (
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {currentAlgorithm === 'two-sum' && 'Two Sum Problem'}
                  {currentAlgorithm === 'palindrome' && 'Valid Palindrome Problem'}
                  {currentAlgorithm === 'max-subarray' && 'Maximum Subarray Sum Problem'}
                  {currentAlgorithm === 'longest-unique' && 'Longest Unique Substring Problem'}
                </h3>
                <p className="text-blue-800 text-sm">
                  {currentAlgorithm === 'two-sum' &&
                    `Given a sorted array and a target sum (${currentData.target}), find two numbers that add up to the target. Use two pointers starting from both ends.`}
                  {currentAlgorithm === 'palindrome' &&
                    'Given an array of numbers, determine if it reads the same forwards and backwards using two pointers.'}
                  {currentAlgorithm === 'max-subarray' &&
                    `Find the maximum sum of any subarray of size ${currentData.k} using a sliding window approach.`}
                  {currentAlgorithm === 'longest-unique' &&
                    'Find the length of the longest substring with all unique elements using a sliding window.'}
                </p>
              </div>
            )}

            {/* Visualization Area */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="max-w-3xl mx-auto">
                {/* Array Visualization */}
                <div ref={arrayRef} className="relative mb-6">
                  {/* Array Elements */}
                  <div className="flex gap-2 mb-8">
                    {currentData.array.map((value: number, index: number) => (
                      <div
                        key={index}
                        data-index={index}
                        className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center font-semibold text-gray-700 relative"
                      >
                        {value}
                      </div>
                    ))}
                  </div>

                  {/* Pointers */}
                  {currentStepData?.pointers?.map((pointer: any) => (
                    <div
                      key={pointer.id}
                      data-pointer={pointer.id}
                      className="absolute -bottom-8 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        backgroundColor: pointer.color,
                        transform: `translateX(${pointer.position * 60 + 8}px)`
                      }}
                    >
                      {pointer.name.charAt(0).toUpperCase()}
                    </div>
                  ))}

                  {/* Sliding Window */}
                  {currentStepData?.window && (
                    <div
                      data-window
                      className="absolute -top-2 h-16 bg-purple-200 border-2 border-purple-400 rounded-lg opacity-50"
                      style={{
                        left: `${currentStepData.window.start * 60}px`,
                        width: `${(currentStepData.window.end - currentStepData.window.start + 1) * 60 - 8}px`
                      }}
                    />
                  )}
                </div>

                {/* Step Information */}
                {currentStepData && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Step {currentStepData.stepNumber}: {currentStepData.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {currentStepData.description}
                    </p>
                  </div>
                )}

                {/* Auto-Play Controls */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={handleAutoPlay}
                      className={`px-4 py-2 text-sm ${isAutoPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {isAutoPlaying ? 'Pause' : 'Auto-Play'}
                    </Button>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-700">
                        Speed:
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={autoPlayDelay}
                        onChange={(e) => setAutoPlayDelay(Number(e.target.value))}
                        className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={isAutoPlaying}
                      />
                      <span className="text-xs text-gray-600 min-w-[45px]">
                        {autoPlayDelay}ms
                      </span>
                    </div>
                  </div>
                </div>

                {/* Manual Controls */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={handlePlay}
                    disabled={isPlaying || currentStep >= steps.length - 1 || isAutoPlaying}
                    className="px-4 py-2 text-sm"
                  >
                    Play
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="px-4 py-2 text-sm"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    disabled={currentStep <= 0 || isAutoPlaying}
                    className="px-4 py-2 text-sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="outline"
                    disabled={currentStep >= steps.length - 1 || isAutoPlaying}
                    className="px-4 py-2 text-sm"
                  >
                    Next
                  </Button>
                  <span className="text-xs text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};