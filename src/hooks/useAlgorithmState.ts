import { useState, useCallback, useRef, useEffect } from 'react'
import type { AlgorithmPattern, AlgorithmExample, AlgorithmState, AlgorithmStep } from '../types/algorithm'

export const useAlgorithmState = () => {
  const [state, setState] = useState<AlgorithmState>({
    currentPattern: null,
    currentExample: null,
    currentStep: 0,
    isPlaying: false,
    isPaused: false,
    speed: 1,
    data: null,
    pointers: [],
    history: []
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const setCurrentPattern = useCallback((pattern: AlgorithmPattern | null) => {
    setState(prev => ({
      ...prev,
      currentPattern: pattern,
      currentExample: pattern?.examples[0] || null,
      currentStep: 0,
      isPlaying: false,
      isPaused: false,
      data: pattern?.examples[0]?.input || null,
      pointers: [],
      history: []
    }))
  }, [])

  const setCurrentExample = useCallback((example: AlgorithmExample | null) => {
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

  const play = useCallback(() => {
    if (!state.currentExample) return

    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
    
    const stepDuration = 2000 / state.speed // Base duration of 2 seconds, adjusted by speed
    
    const executeStep = () => {
      setState(prev => {
        if (!prev.currentExample || prev.currentStep >= prev.currentExample.steps.length) {
          return { ...prev, isPlaying: false }
        }

        const currentStepData = prev.currentExample.steps[prev.currentStep]
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
  }, [state.currentExample, state.speed])

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
      if (!prev.currentExample || prev.currentStep >= prev.currentExample.steps.length) {
        return prev
      }

      const currentStepData = prev.currentExample.steps[prev.currentStep]
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
    if (!state.currentExample) return

    const clampedIndex = Math.max(0, Math.min(stepIndex, state.currentExample.steps.length))
    
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

      const targetStepData = prev.currentExample!.steps[clampedIndex - 1]
      const newHistory = prev.currentExample!.steps.slice(0, clampedIndex)

      return {
        ...prev,
        currentStep: clampedIndex,
        data: targetStepData.data,
        pointers: targetStepData.pointers || [],
        history: newHistory
      }
    })
  }, [state.currentExample])

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
    if (state.currentExample && state.currentStep >= state.currentExample.steps.length && state.isPlaying) {
      pause()
    }
  }, [state.currentStep, state.currentExample, state.isPlaying, pause])

  return {
    state,
    actions: {
      setCurrentPattern,
      setCurrentExample,
      setSpeed,
      play,
      pause,
      stop,
      nextStep,
      previousStep,
      goToStep
    }
  }
}