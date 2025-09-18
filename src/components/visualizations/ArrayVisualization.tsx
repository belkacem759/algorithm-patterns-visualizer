import React, { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import type { SolutionStep, Pointer } from '../../types/algorithm'
import { algorithmAnimations } from '../../lib/gsap-animations'

interface ArrayVisualizationProps {
  data: number[]
  currentStep?: SolutionStep
  pointers?: Pointer[]
  onStepComplete?: () => void
  className?: string
  showIndices?: boolean
  highlightedElements?: number[]
  comparisonElements?: number[]
  swappingElements?: [number, number] | null
  hashMap?: Record<string, number>
  complement?: number
  target?: number
}

export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  data,
  currentStep,
  pointers = [],
  onStepComplete,
  className = '',
  showIndices = true,
  highlightedElements = [],
  comparisonElements = [],
  swappingElements = null,
  hashMap = {},
  complement,
  target
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<(HTMLDivElement | null)[]>([])
  const pointersRef = useRef<(HTMLDivElement | null)[]>([])
  const hashMapRef = useRef<HTMLDivElement>(null)
  const [animationTimeline, setAnimationTimeline] = useState<gsap.core.Timeline | null>(null)

  // Initialize GSAP context
  useGSAP(() => {
    if (!containerRef.current) return

    // Set initial states for elements
    gsap.set('.array-element', {
      scale: 1,
      backgroundColor: '#f3f4f6',
      color: '#374151',
      borderColor: '#d1d5db'
    })

    gsap.set('.array-pointer', {
      y: 0,
      opacity: 1
    })

    gsap.set('.hash-map-container', {
      opacity: 0,
      y: 20
    })

  }, { scope: containerRef })

  // Animate step changes
  useEffect(() => {
    if (!currentStep || !containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        onStepComplete?.()
      }
    })

    // Execute step animations
    currentStep.animations?.forEach((animation, index) => {
      switch (animation.type) {
        case 'highlight':
          animation.targets.forEach((target: string) => {
            if (target.startsWith('element-')) {
              const elementIndex = parseInt(target.split('-')[1])
              const element = elementsRef.current[elementIndex]
              if (element) {
                tl.to(element, {
                  backgroundColor: animation.properties?.color || '#3b82f6',
                  color: '#ffffff',
                  scale: 1.1,
                  duration: animation.duration || 0.6,
                  ease: 'power2.out'
                }, index * 0.1)
              }
            }
          })
          break

        case 'move':
          animation.targets.forEach((target: string) => {
            if (target.startsWith('pointer-')) {
              const pointerIndex = parseInt(target.split('-')[1])
              const pointer = pointersRef.current[pointerIndex]
              if (pointer) {
                const newPosition = pointers[pointerIndex]?.position || 0
                const elementWidth = 80 // Width of each array element
                const elementGap = 8 // Gap between elements
                const newX = newPosition * (elementWidth + elementGap)
                
                tl.to(pointer, {
                  x: newX,
                  duration: animation.duration || 0.6,
                  ease: 'power2.inOut'
                }, index * 0.1)
              }
            }
          })
          break

        case 'swap':
          if (swappingElements) {
            const [index1, index2] = swappingElements
            const element1 = elementsRef.current[index1]
            const element2 = elementsRef.current[index2]
            
            if (element1 && element2) {
              const elementWidth = 80
              const elementGap = 8
              const distance = (index2 - index1) * (elementWidth + elementGap)
              
              tl.to([element1, element2], {
                y: -20,
                duration: 0.3,
                ease: 'power2.out'
              }, index * 0.1)
              .to(element1, {
                x: distance,
                duration: 0.4,
                ease: 'power2.inOut'
              }, '-=0.1')
              .to(element2, {
                x: -distance,
                duration: 0.4,
                ease: 'power2.inOut'
              }, '-=0.4')
              .to([element1, element2], {
                y: 0,
                duration: 0.3,
                ease: 'power2.in'
              })
            }
          }
          break

        case 'insert':
          if (animation.targets.includes('map-entry') && hashMapRef.current) {
            tl.to(hashMapRef.current, {
              opacity: 1,
              y: 0,
              duration: animation.duration || 0.6,
              ease: 'back.out(1.7)'
            }, index * 0.1)
          }
          break

        case 'traverse':
          animation.targets.forEach((target: string) => {
            if (target.startsWith('node-')) {
              const elementIndex = parseInt(target.split('-')[1])
              const element = elementsRef.current[elementIndex]
              if (element) {
                tl.to(element, {
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  scale: 1.2,
                  duration: 0.3,
                  ease: 'power2.out'
                })
                .to(element, {
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.in'
                })
              }
            }
          })
          break
      }
    })

    setAnimationTimeline(tl)

    return () => {
      tl.kill()
    }
  }, [currentStep, pointers, swappingElements, onStepComplete])

  // Handle pointer updates
  useEffect(() => {
    pointers.forEach((pointer, index) => {
      const pointerElement = pointersRef.current[index]
      if (pointerElement) {
        const elementWidth = 80
        const elementGap = 8
        const newX = pointer.position * (elementWidth + elementGap)
        
        gsap.to(pointerElement, {
          x: newX,
          duration: 0.6,
          ease: 'power2.inOut'
        })
      }
    })
  }, [pointers])

  // Handle highlighting
  useEffect(() => {
    elementsRef.current.forEach((element, index) => {
      if (!element) return

      let backgroundColor = '#f3f4f6'
      let color = '#374151'
      let scale = 1

      if (highlightedElements.includes(index)) {
        backgroundColor = '#10b981'
        color = '#ffffff'
        scale = 1.1
      } else if (comparisonElements.includes(index)) {
        backgroundColor = '#f59e0b'
        color = '#ffffff'
        scale = 1.05
      }

      gsap.to(element, {
        backgroundColor,
        color,
        scale,
        duration: 0.4,
        ease: 'power2.out'
      })
    })
  }, [highlightedElements, comparisonElements])

  const playAnimation = useCallback(() => {
    if (animationTimeline) {
      animationTimeline.restart()
    }
  }, [animationTimeline])

  const pauseAnimation = useCallback(() => {
    if (animationTimeline) {
      animationTimeline.pause()
    }
  }, [animationTimeline])

  const resetAnimation = useCallback(() => {
    if (animationTimeline) {
      animationTimeline.progress(0).pause()
    }
  }, [animationTimeline])

  return (
    <div ref={containerRef} className={`array-visualization ${className}`}>
      {/* Array Elements */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            {showIndices && (
              <div className="text-xs text-gray-500 mb-1 font-mono">
                {index}
              </div>
            )}
            <div
              ref={el => { elementsRef.current[index] = el }}
              className="array-element w-20 h-20 flex items-center justify-center 
                         border-2 rounded-lg font-bold text-lg transition-all duration-300
                         bg-gray-100 border-gray-300 text-gray-700"
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Pointers */}
      {pointers.length > 0 && (
        <div className="relative h-16 mb-4">
          {pointers.map((pointer, index) => (
            <div
              key={pointer.id}
              ref={el => { pointersRef.current[index] = el }}
              className="array-pointer absolute flex flex-col items-center"
              style={{
                left: `${pointer.position * 88}px`, // 80px width + 8px gap
                top: '0px'
              }}
            >
              <div 
                className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent"
                style={{ borderBottomColor: pointer.color }}
              />
              <div 
                className="px-2 py-1 rounded text-xs font-semibold text-white"
                style={{ backgroundColor: pointer.color }}
              >
                {pointer.name}
              </div>
              {pointer.description && (
                <div className="text-xs text-gray-600 mt-1 text-center max-w-20">
                  {pointer.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hash Map Visualization */}
      {Object.keys(hashMap).length > 0 && (
        <div 
          ref={hashMapRef}
          className="hash-map-container mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Hash Map</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(hashMap).map(([key, value]) => (
              <div 
                key={key}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-sm"
              >
                <span className="font-mono text-blue-700">{key}</span>
                <span className="text-blue-500">→</span>
                <span className="font-mono text-blue-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complement Display */}
      {complement !== undefined && target !== undefined && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-sm text-yellow-800">
            <span className="font-semibold">Target:</span> {target} | 
            <span className="font-semibold ml-2">Complement:</span> {complement}
          </div>
        </div>
      )}

      {/* Animation Controls */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={playAnimation}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                     transition-colors duration-200 text-sm font-medium"
        >
          Play
        </button>
        <button
          onClick={pauseAnimation}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 
                     transition-colors duration-200 text-sm font-medium"
        >
          Pause
        </button>
        <button
          onClick={resetAnimation}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                     transition-colors duration-200 text-sm font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default ArrayVisualization