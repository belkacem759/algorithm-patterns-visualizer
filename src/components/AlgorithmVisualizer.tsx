import React from 'react'
import { PatternSelector } from './PatternSelector'
import { AlgorithmControls } from './controls/AlgorithmControls'
import { ArrayVisualization } from './visualization/ArrayVisualization'
import { useAlgorithmState } from '../hooks/useAlgorithmState'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import type { VisualizationType } from '../types/algorithm'

export function AlgorithmVisualizer() {
  const { state, actions } = useAlgorithmState()
  const {
    currentPattern,
    currentExample,
    currentStep,
    isPlaying,
    speed
  } = state
  const {
    setCurrentPattern,
    setCurrentExample,
    setSpeed,
    play,
    pause,
    stop,
    nextStep,
    previousStep
  } = actions

  const reset = () => {
    actions.goToStep(0)
  }

  const renderVisualization = () => {
    if (!currentPattern || !currentExample) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Select an algorithm pattern and example to begin visualization
        </div>
      )
    }

    const visualizationType: VisualizationType = currentPattern.visualizationType

    switch (visualizationType) {
      case 'array':
        return (
          <ArrayVisualization
            data={currentExample.input}
            pointers={state.pointers}
            highlights={currentExample.steps[currentStep]?.highlight || []}
          />
        )
      case 'tree':
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Tree visualization coming soon...
          </div>
        )
      case 'graph':
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Graph visualization coming soon...
          </div>
        )
      case 'linkedlist':
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Linked list visualization coming soon...
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Visualization type not supported yet
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Algorithm Patterns Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visualization of common algorithm patterns and techniques
          </p>
        </div>

        {/* Pattern Selector */}
        <PatternSelector
          selectedPattern={currentPattern}
          selectedExample={currentExample}
          onPatternChange={setCurrentPattern}
          onExampleChange={setCurrentExample}
        />

        {/* Main Visualization Area */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {currentPattern?.name || 'Select a Pattern'}
                {currentExample && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    - {currentExample.name}
                  </span>
                )}
              </span>
              {currentPattern && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Time: {currentPattern.timeComplexity}</span>
                  <span>•</span>
                  <span>Space: {currentPattern.spaceComplexity}</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Visualization */}
              <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
                {renderVisualization()}
              </div>

              {/* Controls */}
              <AlgorithmControls
                isPlaying={isPlaying}
                isPaused={!isPlaying && currentStep > 0}
                canGoNext={currentStep < (currentExample?.steps.length || 0) - 1}
                canGoPrevious={currentStep > 0}
                currentStep={currentStep}
                totalSteps={currentExample?.steps.length || 0}
                speed={speed}
                onPlay={play}
                onPause={pause}
                onStop={stop}
                onNext={nextStep}
                onPrevious={previousStep}
                onSpeedChange={setSpeed}
              />

              {/* Current Step Information */}
              {currentExample && currentStep < currentExample.steps.length && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900">
                        Step {currentStep + 1}: {currentExample.steps[currentStep].description}
                      </h4>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pattern Description */}
              {currentPattern && (
                <Card className="bg-gray-50">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">About This Pattern</h4>
                      <p className="text-gray-700">{currentPattern.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {currentPattern.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}