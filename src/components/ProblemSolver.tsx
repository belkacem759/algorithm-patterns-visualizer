import React, { useState, useCallback } from 'react'
import { useProblemState } from '../hooks/useProblemState'
import { algorithmProblems } from '../data/algorithmProblems'
import { demoProblems } from '../data/demoProblems'
import ArrayVisualization from './visualizations/ArrayVisualization'
import TreeVisualization from './visualizations/TreeVisualization'
import GraphVisualization from './visualizations/GraphVisualization'
import type { AlgorithmProblem, TreeNode, GraphNode, GraphEdge } from '../types/algorithm'

interface ProblemSelectorProps {
  selectedProblem: AlgorithmProblem | null
  onProblemChange: (problem: AlgorithmProblem) => void
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({ selectedProblem, onProblemChange }) => {
  const allProblems = [...algorithmProblems, ...demoProblems]
  const categories = Array.from(new Set(allProblems.map(p => p.category)))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Algorithm Problem</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              {category}
            </h3>
            <div className="space-y-1">
              {allProblems
                .filter(p => p.category === category)
                .map(problem => (
                  <button
                    key={problem.id}
                    onClick={() => onProblemChange(problem)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedProblem?.id === problem.id
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{problem.title}</div>
                    <div className={`text-xs ${
                      problem.difficulty === 'Easy' ? 'text-green-600' :
                      problem.difficulty === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {problem.difficulty}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ControlPanelProps {
  isPlaying: boolean
  isPaused: boolean
  currentStep: number
  totalSteps: number
  speed: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onNext: () => void
  onPrevious: () => void
  onSpeedChange: (speed: number) => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  isPaused,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
  onSpeedChange
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isPlaying
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={onStop}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium transition-colors"
          >
            Stop
          </button>
          
          <button
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded font-medium transition-colors"
          >
            ← Prev
          </button>
          
          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded font-medium transition-colors"
          >
            Next →
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Step {currentStep} / {totalSteps}
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Speed:</label>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProblemSolver: React.FC = () => {
  const { state, actions } = useProblemState()
  const [selectedProblem, setSelectedProblem] = useState<AlgorithmProblem | null>(null)

  const handleProblemChange = useCallback((problem: AlgorithmProblem) => {
    setSelectedProblem(problem)
    actions.setCurrentProblem(problem)
  }, [actions])

  const renderVisualization = useCallback(() => {
    const vizData = actions.getVisualizationData()
    if (!vizData || !selectedProblem) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          Select a problem to begin visualization
        </div>
      )
    }

    const { visualizationType, data, currentStep, pointers, isPlaying } = vizData

    switch (visualizationType) {
      case 'array':
        return (
          <ArrayVisualization
            data={Array.isArray(data) ? data : []}
            currentStep={currentStep || undefined}
            pointers={pointers}
            onStepComplete={actions.nextStep}
          />
        )
      
      case 'tree':
        return (
          <TreeVisualization
            tree={data as TreeNode}
            currentStep={currentStep || undefined}
            pointers={pointers}
            isPlaying={isPlaying}
            onAnimationComplete={actions.nextStep}
          />
        )
      
      case 'graph':
        const graphData = data as { nodes: GraphNode[]; edges: GraphEdge[] }
        return (
          <GraphVisualization
            nodes={graphData?.nodes || []}
            edges={graphData?.edges || []}
            currentStep={currentStep || undefined}
            pointers={pointers}
            isPlaying={isPlaying}
            onAnimationComplete={actions.nextStep}
          />
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-96 text-gray-500">
            Visualization type "{visualizationType}" not yet implemented
          </div>
        )
    }
  }, [actions, selectedProblem])

  const currentStepData = actions.getCurrentStep()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Algorithm Problem Solver
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visualization of algorithm solutions with step-by-step execution
          </p>
        </div>

        {/* Problem Selector */}
        <ProblemSelector
          selectedProblem={selectedProblem}
          onProblemChange={handleProblemChange}
        />

        {selectedProblem && (
          <>
            {/* Problem Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProblem.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      selectedProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      selectedProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">{selectedProblem.category}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>Time: {selectedProblem.solution.timeComplexity}</div>
                  <div>Space: {selectedProblem.solution.spaceComplexity}</div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedProblem.description}</p>
              
              {selectedProblem.examples.length > 0 && (
                <div className="bg-gray-50 rounded p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Example:</h3>
                  <div className="text-sm text-gray-700">
                    <div><strong>Input:</strong> {JSON.stringify(selectedProblem.examples[0].input)}</div>
                    <div><strong>Output:</strong> {JSON.stringify(selectedProblem.examples[0].output)}</div>
                    <div><strong>Explanation:</strong> {selectedProblem.examples[0].explanation}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <ControlPanel
              isPlaying={state.isPlaying}
              isPaused={state.isPaused}
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              speed={state.speed}
              onPlay={actions.play}
              onPause={actions.pause}
              onStop={actions.stop}
              onNext={actions.nextStep}
              onPrevious={actions.previousStep}
              onSpeedChange={actions.setSpeed}
            />

            {/* Visualization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualization</h3>
              {renderVisualization()}
            </div>

            {/* Current Step Info */}
            {currentStepData && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Step {currentStepData.stepNumber}: {currentStepData.title}
                </h3>
                <p className="text-gray-700 mb-4">{currentStepData.description}</p>
                
                {currentStepData.code && (
                  <div className="bg-gray-900 text-gray-100 rounded p-4 font-mono text-sm overflow-x-auto">
                    <pre>{currentStepData.code}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Solution Approach */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Solution Approach</h3>
              <p className="text-gray-700 mb-4">{selectedProblem.solution.explanation}</p>
              
              {selectedProblem.solution.keyInsights.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Insights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedProblem.solution.keyInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProblemSolver