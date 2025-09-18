import React, { useEffect, useRef } from 'react'
import { gsapAnimations, COLORS } from '../../lib/gsap-animations'
import { cn } from '../../lib/utils'
import type { VisualizationElement, Pointer } from '../../types/algorithm'

interface ArrayVisualizationProps {
  data: number[]
  pointers?: Pointer[]
  comparisons?: number[]
  highlights?: number[]
  className?: string
  maxHeight?: number
}

export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  data,
  pointers = [],
  comparisons = [],
  highlights = [],
  className,
  maxHeight = 200
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<(HTMLDivElement | null)[]>([])

  // Calculate bar heights based on data values
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * maxHeight
  }

  const getBarColor = (index: number) => {
    if (highlights.includes(index)) return COLORS.highlight
    if (comparisons.includes(index)) return COLORS.comparing
    
    const pointer = pointers.find(p => p.position === index)
    if (pointer) {
      const pointerColors = {
        left: '#ef4444',
        right: '#3b82f6', 
        current: '#f59e0b',
        target: '#10b981',
        slow: '#8b5cf6',
        fast: '#ec4899'
      }
      return pointerColors[pointer.type] || COLORS.pointer
    }
    
    return COLORS.default
  }

  // Animate elements when data changes
  useEffect(() => {
    if (!containerRef.current) return

    elementsRef.current.forEach((element, index) => {
      if (!element) return

      const height = getBarHeight(data[index])
      const color = getBarColor(index)

      gsapAnimations.animateArrayElement(element, {
        duration: 0.3,
        ease: "power2.out"
      })

      // Update height and color
      element.style.height = `${height}px`
      element.style.backgroundColor = color
    })
  }, [data, pointers, comparisons, highlights])

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex items-end justify-center gap-1 p-4 bg-slate-50 rounded-lg border",
        className
      )}
      style={{ height: maxHeight + 80 }}
    >
      {data.map((value, index) => (
        <div key={`${index}-${value}`} className="flex flex-col items-center gap-2">
          {/* Pointer labels */}
          <div className="h-6 flex flex-col items-center justify-end">
            {pointers
              .filter(p => p.position === index)
              .map(pointer => (
                <div
                  key={pointer.id}
                  className="text-xs font-semibold px-1 py-0.5 rounded text-white"
                  style={{ backgroundColor: pointer.color }}
                >
                  {pointer.name}
                </div>
              ))
            }
          </div>

          {/* Array bar */}
          <div
            ref={el => { elementsRef.current[index] = el }}
            className="w-8 min-h-[20px] rounded-t border-2 border-slate-300 flex items-end justify-center transition-all duration-300"
            style={{
              height: `${getBarHeight(value)}px`,
              backgroundColor: getBarColor(index)
            }}
          >
            {/* Value label */}
            <span className="text-xs font-semibold text-white mb-1">
              {value}
            </span>
          </div>

          {/* Index label */}
          <div className="text-xs text-slate-600 font-medium">
            {index}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArrayVisualization