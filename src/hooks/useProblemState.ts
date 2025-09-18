import { useState, useCallback, useRef, useEffect } from 'react'
import type { AlgorithmProblem, ProblemExample, ProblemState, SolutionStep } from '../types/algorithm'

export const useProblemState = () => {
  const [state, setState] = useState<ProblemState>({
    currentProblem: null,
    currentExample: null,
    currentStep: 0,
    totalSteps: 0,
    isPlaying: false,
    isPaused: false,
    speed: 1,
    data: null,
    pointers: [],
    history: [],
    executionMode: 'step-by-step'
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const setCurrentProblem = useCallback((problem: AlgorithmProblem | null) => {
    setState(prev => ({
      ...prev,
      currentProblem: problem,
      currentExample: problem?.examples[0] || null,
      currentStep: 0,
      totalSteps: problem?.solution.steps.length || 0,
      isPlaying: false,
      isPaused: false,
      data: problem?.examples[0]?.input || null,
      pointers: [],
      history: [],
      executionMode: 'step-by-step'
    }))
  }, [])

  const setCurrentExample = useCallback((example: ProblemExample | null) => {
    setState(prev => ({
      ...prev,
      currentExample: example,
      currentStep: 0,
      isPlaying: false,
      isPaused: false,
      data: example?.input || null,
      pointers: [],
      history: []
    }))
  }, [])

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }))
  }, [])

  const setExecutionMode = useCallback((mode: 'step-by-step' | 'continuous' | 'interactive') => {
    setState(prev => ({ ...prev, executionMode: mode }))
  }, [])

  const play = useCallback(() => {
    if (!state.currentProblem) return

    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
    
    const stepDuration = 2000 / state.speed // Base duration of 2 seconds, adjusted by speed
    
    const executeStep = () => {
      setState(prev => {
        if (!prev.currentProblem || prev.currentStep >= prev.currentProblem.solution.steps.length) {
          return { ...prev, isPlaying: false }
        }

        const currentStepData = prev.currentProblem.solution.steps[prev.currentStep]
        const newHistory = [...prev.history, currentStepData]

        return {
          ...prev,
          currentStep: prev.currentStep + 1,
          data: currentStepData.data,
          pointers: currentStepData.pointers || [],
          history: newHistory
        }
      })
    }

    intervalRef.current = setInterval(executeStep, stepDuration)
  }, [state.currentProblem, state.speed])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }))
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState(prev => ({
      ...prev,
      currentStep: 0,
      isPlaying: false,
      isPaused: false,
      data: prev.currentExample?.input || null,
      pointers: [],
      history: []
    }))
  }, [])

  const nextStep = useCallback(() => {
    setState(prev => {
      if (!prev.currentProblem || prev.currentStep >= prev.currentProblem.solution.steps.length) {
        return prev
      }

      const currentStepData = prev.currentProblem.solution.steps[prev.currentStep]
      const newHistory = [...prev.history, currentStepData]

      return {
        ...prev,
        currentStep: prev.currentStep + 1,
        data: currentStepData.data,
        pointers: currentStepData.pointers || [],
        history: newHistory
      }
    })
  }, [])

  const previousStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep <= 0) return prev

      const newStep = prev.currentStep - 1
      const newHistory = prev.history.slice(0, newStep)
      
      if (newStep === 0) {
        return {
          ...prev,
          currentStep: 0,
          data: prev.currentExample?.input || null,
          pointers: [],
          history: []
        }
      }

      const previousStepData = prev.history[newStep - 1]
      
      return {
        ...prev,
        currentStep: newStep,
        data: previousStepData.data,
        pointers: previousStepData.pointers || [],
        history: newHistory
      }
    })
  }, [])

  const goToStep = useCallback((stepIndex: number) => {
    if (!state.currentProblem) return

    const clampedIndex = Math.max(0, Math.min(stepIndex, state.currentProblem.solution.steps.length))
    
    setState(prev => {
      if (clampedIndex === 0) {
        return {
          ...prev,
          currentStep: 0,
          data: prev.currentExample?.input || null,
          pointers: [],
          history: []
        }
      }

      const targetStepData = prev.currentProblem!.solution.steps[clampedIndex - 1]
      const newHistory = prev.currentProblem!.solution.steps.slice(0, clampedIndex)

      return {
        ...prev,
        currentStep: clampedIndex,
        data: targetStepData.data,
        pointers: targetStepData.pointers || [],
        history: newHistory
      }
    })
  }, [state.currentProblem])

  const getCurrentStep = useCallback((): SolutionStep | null => {
    if (!state.currentProblem || state.currentStep === 0) return null
    return state.currentProblem.solution.steps[state.currentStep - 1] || null
  }, [state.currentProblem, state.currentStep])

  const getVisualizationData = useCallback(() => {
    if (!state.currentProblem || !state.currentExample) return null

    const currentStepData = getCurrentStep()
    
    return {
      visualizationType: state.currentProblem.visualizationType,
      data: state.data || state.currentExample.input,
      currentStep: currentStepData,
      pointers: state.pointers,
      isPlaying: state.isPlaying
    }
  }, [state, getCurrentStep])

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Auto-stop when reaching the end
  useEffect(() => {
    if (state.currentProblem && state.currentStep >= state.currentProblem.solution.steps.length && state.isPlaying) {
      pause()
    }
  }, [state.currentStep, state.currentProblem, state.isPlaying, pause])

  // Update total steps when problem changes
  useEffect(() => {
    if (state.currentProblem) {
      setState(prev => ({
        ...prev,
        totalSteps: prev.currentProblem?.solution.steps.length || 0
      }))
    }
  }, [state.currentProblem])

  return {
    state,
    actions: {
      setCurrentProblem,
      setCurrentExample,
      setSpeed,
      setExecutionMode,
      play,
      pause,
      stop,
      nextStep,
      previousStep,
      goToStep,
      getCurrentStep,
      getVisualizationData
    }
  }
}