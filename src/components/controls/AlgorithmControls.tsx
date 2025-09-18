import React from 'react'
import { Play, Pause, Square, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Slider } from '../ui/Slider'
import { cn } from '../../lib/utils'

interface AlgorithmControlsProps {
  isPlaying: boolean
  isPaused: boolean
  canGoNext: boolean
  canGoPrevious: boolean
  speed: number
  currentStep: number
  totalSteps: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onNext: () => void
  onPrevious: () => void
  onSpeedChange: (speed: number) => void
  className?: string
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  isPlaying,
  isPaused,
  canGoNext,
  canGoPrevious,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
  onSpeedChange,
  className
}) => {
  const handleSpeedChange = (value: number[]) => {
    onSpeedChange(value[0])
  }

  const getSpeedLabel = (speed: number) => {
    if (speed <= 0.5) return 'Slow'
    if (speed <= 1) return 'Normal'
    if (speed <= 2) return 'Fast'
    return 'Very Fast'
  }

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-white rounded-lg border shadow-sm", className)}>
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="h-10 w-10 p-0"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!canGoNext && !isPlaying}
          className="h-10 w-10 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onStop}
          className="h-10 w-10 p-0"
        >
          <Square className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
          className="h-10 w-10 p-0"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onStop}
          className="h-10 w-10 p-0 ml-2"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600 min-w-fit">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="flex-1 bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : '0%'
            }}
          />
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600 min-w-fit">
          Speed:
        </span>
        <div className="flex-1">
          <Slider
            value={[speed]}
            onValueChange={handleSpeedChange}
            min={0.25}
            max={3}
            step={0.25}
            className="w-full"
          />
        </div>
        <span className="text-sm text-slate-500 min-w-fit">
          {getSpeedLabel(speed)}
        </span>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            isPlaying ? "bg-green-500" : isPaused ? "bg-yellow-500" : "bg-slate-400"
          )}
        />
        <span className="text-xs text-slate-600">
          {isPlaying ? "Playing" : isPaused ? "Paused" : "Stopped"}
        </span>
      </div>
    </div>
  )
}

export default AlgorithmControls