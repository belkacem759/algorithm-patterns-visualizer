import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useEffect, useRef, useState } from 'react';
import { longestUniqueSubarray, maxSubarraySum } from '../algorithms/slidingWindow';
import { twoSumSorted, validPalindromeArray } from '../algorithms/twoPointers';
import type { ArrayPatternStep, Pointer } from '../types/arrayPatterns';
import { Button } from './ui/Button';

gsap.registerPlugin(Flip);

interface ArrayPatternVisualizerProps {
  className?: string;
}

type AlgorithmType = 'two-sum' | 'palindrome' | 'max-subarray' | 'longest-unique';

const SAMPLE_DATA = {
  'two-sum': { array: [1, 2, 3, 4, 6, 8, 9, 11, 13, 15, 17, 19], target: 17 },
  'palindrome': { array: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1] },
  'max-subarray': { array: [2, 1, 5, 1, 3, 2, 4, 7, 1, 6, 3, 8, 2], k: 4 },
  'longest-unique': { array: [1, 2, 3, 2, 1, 4, 5, 6, 7, 3, 8, 9, 4, 2] }
};

export function ArrayPatternVisualizer({ className = '' }: ArrayPatternVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrayRef = useRef<HTMLDivElement>(null);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>('two-sum');
  const [steps, setSteps] = useState<ArrayPatternStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [array, setArray] = useState<number[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize algorithm and generate steps
  useEffect(() => {
    const data = SAMPLE_DATA[currentAlgorithm];
    setArray(data.array);

    let result;
    switch (currentAlgorithm) {
      case 'two-sum':
        result = twoSumSorted(data.array, (data as any).target);
        setSteps(result.steps);
        break;
      case 'palindrome':
        result = validPalindromeArray(data.array);
        setSteps(result.steps);
        break;
      case 'max-subarray':
        result = maxSubarraySum(data.array, (data as any).k);
        setSteps(result.steps);
        break;
      case 'longest-unique':
        result = longestUniqueSubarray(data.array);
        setSteps(result.steps);
        break;
    }

    setCurrentStep(0);
    setIsPlaying(false);
  }, [currentAlgorithm]);

  // Animate to current step
  useEffect(() => {
    if (steps.length === 0 || !arrayRef.current) return;

    const step = steps[currentStep];
    if (!step) return;

    // Kill any existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const tl = gsap.timeline();
    animationRef.current = tl;

    // Animate array elements
    const elements = arrayRef.current.querySelectorAll('.array-element');

    // Reset all elements
    tl.set(elements, {
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db',
      scale: 1,
      zIndex: 1
    });

    // Animate pointers
    if (step.pointers && step.pointers.length > 0) {
      step.pointers.forEach((pointer: Pointer) => {
        const pointerEl = arrayRef.current?.querySelector(`[data-pointer="${pointer.id}"]`);
        if (pointerEl) {
          tl.to(pointerEl, {
            x: pointer.position * 80, // 80px per element
            backgroundColor: pointer.color,
            duration: 0.6,
            ease: "power2.out"
          }, 0);
        }
      });

      // Highlight pointer positions
      step.pointers.forEach((pointer: Pointer) => {
        const element = elements[pointer.position];
        if (element) {
          tl.to(element, {
            backgroundColor: pointer.color + '20',
            borderColor: pointer.color,
            scale: 1.1,
            zIndex: 10,
            duration: 0.4,
            ease: "back.out(1.7)"
          }, 0.2);
        }
      });
    }

    // Animate sliding window
    if (step.window) {
      const windowEl = arrayRef.current.querySelector('.sliding-window');
      if (windowEl) {
        const windowWidth = (step.window.right - step.window.left + 1) * 80;
        const windowX = step.window.left * 80;

        tl.to(windowEl, {
          x: windowX,
          width: windowWidth,
          backgroundColor: (step.window.color || '#3b82f6') + '30',
          borderColor: step.window.color || '#3b82f6',
          duration: 0.8,
          ease: "power2.out"
        }, 0);

        // Highlight window elements
        for (let i = step.window.left; i <= step.window.right; i++) {
          const element = elements[i];
          if (element) {
            tl.to(element, {
              backgroundColor: (step.window.color || '#3b82f6') + '20',
              borderColor: step.window.color || '#3b82f6',
              scale: 1.05,
              duration: 0.4,
              ease: "back.out(1.7)"
            }, 0.3);
          }
        }
      }
    }

    // Animate comparisons
    if (step.comparisons && step.comparisons.length > 0) {
      step.comparisons.forEach((comparison) => {
        comparison.indices.forEach((index) => {
          const element = elements[index];
          if (element) {
            const color = comparison.result === 'equal' ? '#10b981' :
              comparison.result === 'found' ? '#8b5cf6' : '#ef4444';

            tl.to(element, {
              backgroundColor: color + '30',
              borderColor: color,
              scale: 1.15,
              duration: 0.3,
              ease: "back.out(1.7)"
            }, 0.5)
              .to(element, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
              }, 0.8);
          }
        });
      });
    }

  }, [currentStep, steps]);

  const playAnimation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`} ref={containerRef}>
      {/* Algorithm Selector */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Array Pattern Visualizer</h2>
        <div className="flex gap-2 mb-4">
          {Object.keys(SAMPLE_DATA).map((algo) => (
            <Button
              key={algo}
              variant={currentAlgorithm === algo ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentAlgorithm(algo as AlgorithmType)}
            >
              {algo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>

      {/* Array Visualization */}
      <div className="mb-6" ref={arrayRef}>
        <div className="relative">
          {/* Array Elements */}
          <div className="flex gap-2 mb-8">
            {array.map((value, index) => (
              <div
                key={index}
                className="array-element w-16 h-16 flex items-center justify-center border-2 rounded-lg font-bold text-lg transition-all duration-300"
                style={{
                  backgroundColor: '#f3f4f6',
                  borderColor: '#d1d5db'
                }}
              >
                {value}
              </div>
            ))}
          </div>

          {/* Sliding Window Overlay */}
          <div
            className="sliding-window absolute top-0 h-16 border-2 rounded-lg pointer-events-none opacity-60"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              width: '64px'
            }}
          />

          {/* Pointers */}
          <div className="relative h-12">
            {currentStepData?.pointers?.map((pointer: Pointer) => (
              <div
                key={pointer.id}
                data-pointer={pointer.id}
                className="absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transform -translate-x-1/2"
                style={{
                  backgroundColor: pointer.color,
                  top: '8px',
                  left: '32px' // Center of first element
                }}
              >
                {pointer.name[0].toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Information */}
      {currentStepData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">
            Step {currentStep + 1}: {currentStepData.title}
          </h3>
          <p className="text-gray-700 mb-2">{currentStepData.description}</p>

          {currentStepData.window && (
            <div className="text-sm text-blue-600">
              Window: [{currentStepData.window.left}, {currentStepData.window.right}]
              {currentStepData.window.sum !== undefined && ` | Sum: ${currentStepData.window.sum}`}
              {currentStepData.window.size !== undefined && ` | Size: ${currentStepData.window.size}`}
            </div>
          )}

          {currentStepData.comparisons && currentStepData.comparisons.length > 0 && (
            <div className="text-sm text-purple-600">
              {currentStepData.comparisons[0].operation}
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <Button onClick={playAnimation}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="outline" onClick={resetAnimation}>
          Reset
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep >= steps.length - 1}
        >
          Next
        </Button>
        <span className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
}