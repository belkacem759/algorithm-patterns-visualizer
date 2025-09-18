import React, { useState, useEffect, useCallback } from 'react'
import type { AlgorithmProblem, SolutionStep, ProblemState } from '../types/algorithm'
import ArrayVisualization from './visualizations/ArrayVisualization'
import { algorithmProblems } from '../data/algorithmProblems'

interface ProblemVisualizationProps {
  problemId: string
  className?: string
}

export const ProblemVisualization: React.FC<ProblemVisualizationProps> = ({
  problemId,
  className = ''
}) => {
  const [problem, setProblem] = useState<AlgorithmProblem | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000) // milliseconds between steps
  const [selectedExample, setSelectedExample] = useState(0)

  // Load problem data
  useEffect(() => {
    const foundProblem = algorithmProblems.find(p => p.id === problemId)
    if (foundProblem) {
      setProblem(foundProblem)
      setCurrentStepIndex(0)
    }
  }, [problemId])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !problem) return

    const timer = setTimeout(() => {
      if (currentStepIndex < problem.solution.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [isPlaying, currentStepIndex, problem, speed])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }, [])

  const handleStepForward = useCallback(() => {
    if (problem && currentStepIndex < problem.solution.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [problem, currentStepIndex])

  const handleStepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [currentStepIndex])

  const handleStepComplete = useCallback(() => {
    // Called when step animation completes
    console.log(`Step ${currentStepIndex + 1} animation completed`)
  }, [currentStepIndex])

  if (!problem) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-gray-500">Problem not found</div>
      </div>
    )
  }

  const currentStep = problem.solution.steps[currentStepIndex]
  const currentExample = problem.examples[selectedExample]

  // Extract visualization data from current step
  const getVisualizationData = () => {
    if (!currentStep?.data) return []
    
    // Handle different data formats
    if (Array.isArray(currentStep.data.nums1)) {
      return currentStep.data.nums1
    }
    if (Array.isArray(currentStep.data.nums)) {
      return currentStep.data.nums
    }
    if (Array.isArray(currentStep.data)) {
      return currentStep.data
    }
    
    return []
  }

  const getHashMapData = () => {
    return currentStep?.data?.map || {}
  }

  const getComplement = () => {
    return currentStep?.data?.complement
  }

  const getTarget = () => {
    return currentStep?.data?.target
  }

  return (
    <div className={`problem-visualization ${className}`}>
      {/* Problem Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{problem.title}</h2>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
              {problem.category}
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{problem.description}</p>
        
        {/* Example Selection */}
        {problem.examples.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Example:
            </label>
            <select
              value={selectedExample}
              onChange={(e) => setSelectedExample(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {problem.examples.map((example, index) => (
                <option key={example.id} value={index}>
                  Example {index + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current Example */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Input:</span>
              <pre className="mt-1 text-xs bg-white p-2 rounded border">
                {JSON.stringify(currentExample.input, null, 2)}
              </pre>
            </div>
            <div>
              <span className="font-semibold">Output:</span>
              <pre className="mt-1 text-xs bg-white p-2 rounded border">
                {JSON.stringify(currentExample.output, null, 2)}
              </pre>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-semibold">Explanation:</span>
            <p className="text-sm text-gray-600 mt-1">{currentExample.explanation}</p>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mb-8">
        {problem.visualizationType === 'array' && (
          <ArrayVisualization
            data={getVisualizationData()}
            currentStep={currentStep}
            pointers={currentStep?.pointers || []}
            onStepComplete={handleStepComplete}
            hashMap={getHashMapData()}
            complement={getComplement()}
            target={getTarget()}
            className="bg-white p-6 rounded-lg border border-gray-200"
          />
        )}
      </div>

      {/* Step Information */}
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-900">
              Step {currentStepIndex + 1} of {problem.solution.steps.length}: {currentStep?.title}
            </h3>
            <div className="text-sm text-blue-700">
              {Math.round(((currentStepIndex + 1) / problem.solution.steps.length) * 100)}% Complete
            </div>
          </div>
          <p className="text-blue-800 text-sm">{currentStep?.description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                     transition-colors duration-200 text-sm font-medium"
        >
          Reset
        </button>
        
        <button
          onClick={handleStepBackward}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200 text-sm font-medium"
        >
          ← Step Back
        </button>

        {isPlaying ? (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 
                       transition-colors duration-200 text-sm font-medium"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                       transition-colors duration-200 text-sm font-medium"
          >
            Play
          </button>
        )}

        <button
          onClick={handleStepForward}
          disabled={currentStepIndex === problem.solution.steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200 text-sm font-medium"
        >
          Step Forward →
        </button>

        <div className="flex items-center gap-2 ml-4">
          <label className="text-sm font-medium text-gray-700">Speed:</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
          </select>
        </div>
      </div>

      {/* Solution Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Solution: {problem.solution.approach}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-medium text-gray-700">Time Complexity:</span>
            <span className="ml-2 font-mono text-sm bg-gray-200 px-2 py-1 rounded">
              {problem.solution.timeComplexity}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Space Complexity:</span>
            <span className="ml-2 font-mono text-sm bg-gray-200 px-2 py-1 rounded">
              {problem.solution.spaceComplexity}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <span className="font-medium text-gray-700">Explanation:</span>
          <p className="text-gray-600 text-sm mt-1">{problem.solution.explanation}</p>
        </div>

        <div className="mb-4">
          <span className="font-medium text-gray-700">Key Insights:</span>
          <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-1">
            {problem.solution.keyInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        <details className="mt-4">
          <summary className="font-medium text-gray-700 cursor-pointer hover:text-gray-900">
            View Code
          </summary>
          <pre className="mt-2 text-xs bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
            {problem.solution.code}
          </pre>
        </details>
      </div>
    </div>
  )
}

export default ProblemVisualization