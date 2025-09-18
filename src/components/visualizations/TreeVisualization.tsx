import React, { useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import type { TreeNode, SolutionStep, Pointer } from '../../types/algorithm'

interface TreeVisualizationProps {
  tree: TreeNode | null
  currentStep?: SolutionStep
  pointers?: Pointer[]
  isPlaying?: boolean
  onAnimationComplete?: () => void
}

interface TreePosition {
  x: number
  y: number
  level: number
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  tree,
  currentStep,
  pointers = [],
  isPlaying = false,
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<{ [key: string]: HTMLDivElement }>({})
  const edgesRef = useRef<{ [key: string]: SVGLineElement }>({})
  const timelineRef = useRef<gsap.core.Timeline>()
  const callStackRef = useRef<HTMLDivElement>(null)

  const getMaxLevel = useCallback((node: TreeNode | null): number => {
    if (!node) return 0
    return 1 + Math.max(
      getMaxLevel(node.left || null), 
      getMaxLevel(node.right || null)
    )
  }, [])

  // Calculate tree positions using level-order traversal
  const calculatePositions = useCallback((root: TreeNode | null): Map<string, TreePosition> => {
    const positions = new Map<string, TreePosition>()
    if (!root) return positions

    const queue: Array<{ node: TreeNode; x: number; y: number; level: number }> = []
    const levelWidth = 120
    const levelHeight = 80
    
    const maxLevel = getMaxLevel(root)
    const totalWidth = Math.pow(2, maxLevel - 1) * levelWidth

    queue.push({ node: root, x: totalWidth / 2, y: 50, level: 0 })

    while (queue.length > 0) {
      const { node, x, y, level } = queue.shift()!
      positions.set(node.id, { x, y, level })

      const childOffset = totalWidth / Math.pow(2, level + 2)
      
      if (node.left) {
        queue.push({ 
          node: node.left, 
          x: x - childOffset, 
          y: y + levelHeight, 
          level: level + 1 
        })
      }
      
      if (node.right) {
        queue.push({ 
          node: node.right, 
          x: x + childOffset, 
          y: y + levelHeight, 
          level: level + 1 
        })
      }
    }

    return positions
  }, [getMaxLevel])

  // Render tree nodes and edges
  const renderTree = useCallback((root: TreeNode | null, positions: Map<string, TreePosition>) => {
    if (!root || !containerRef.current) return { nodes: [], edges: [] }

    const nodes: React.ReactElement[] = []
    const edges: React.ReactElement[] = []
    const queue: TreeNode[] = [root]

    while (queue.length > 0) {
      const node = queue.shift()!
      const pos = positions.get(node.id)
      if (!pos) continue

      // Create node element
      nodes.push(
        <div
          key={`node-${node.id}`}
          ref={el => { if (el) nodesRef.current[node.id] = el }}
          className="absolute w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-blue-600 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            left: pos.x - 24,
            top: pos.y - 24,
            zIndex: 10
          }}
        >
          {node.value}
        </div>
      )

      // Create edges to children
      if (node.left) {
        const childPos = positions.get(node.left.id)
        if (childPos) {
          edges.push(
            <line
              key={`edge-${node.id}-${node.left.id}`}
              ref={el => { if (el) edgesRef.current[`${node.id}-${node.left.id}`] = el }}
              x1={pos.x}
              y1={pos.y}
              x2={childPos.x}
              y2={childPos.y}
              stroke="#64748b"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          )
        }
        queue.push(node.left)
      }

      if (node.right) {
        const childPos = positions.get(node.right.id)
        if (childPos) {
          edges.push(
            <line
              key={`edge-${node.id}-${node.right.id}`}
              ref={el => { if (el) edgesRef.current[`${node.id}-${node.right.id}`] = el }}
              x1={pos.x}
              y1={pos.y}
              x2={childPos.x}
              y2={childPos.y}
              stroke="#64748b"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          )
        }
        queue.push(node.right)
      }
    }

    return { nodes, edges }
  }, [])

  // Execute step animation
  const executeStepAnimation = useCallback((step: SolutionStep) => {
    if (!step.animations || !containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        onAnimationComplete?.()
      }
    })

    step.animations.forEach((animation, index) => {
      switch (animation.type) {
        case 'highlight':
          animation.targets.forEach((target: string) => {
            const element = nodesRef.current[target]
            if (element) {
              tl.to(element, {
                backgroundColor: '#ef4444',
                borderColor: '#dc2626',
                scale: 1.2,
                duration: 0.5,
                ease: 'power2.out'
              }, index * 0.1)
            }
          })
          break

        case 'traverse':
          animation.targets.forEach((target: string) => {
            const element = nodesRef.current[target]
            if (element) {
              tl.to(element, {
                backgroundColor: '#22c55e',
                borderColor: '#16a34a',
                duration: 0.3,
                ease: 'power2.out'
              }, index * 0.1)
              
              // Add ripple effect
              tl.to(element, {
                boxShadow: '0 0 0 20px rgba(34, 197, 94, 0)',
                duration: 0.6,
                ease: 'power2.out'
              }, '<')
            }
          })
          break

        default:
          // Handle other animation types
          break
      }
    })

    timelineRef.current = tl
    return tl
  }, [onAnimationComplete])

  // Reset animations
  const resetAnimations = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Reset all nodes
    Object.values(nodesRef.current).forEach(element => {
      gsap.set(element, {
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        scale: 1,
        boxShadow: 'none'
      })
    })

    // Reset all edges
    Object.values(edgesRef.current).forEach(element => {
      gsap.set(element, {
        stroke: '#64748b',
        strokeWidth: 2
      })
    })

    // Clear call stack
    if (callStackRef.current) {
      callStackRef.current.innerHTML = ''
    }
  }, [])

  // Execute animation when step changes
  useEffect(() => {
    if (currentStep && isPlaying) {
      executeStepAnimation(currentStep)
    }
  }, [currentStep, isPlaying, executeStepAnimation])

  // Reset when not playing
  useEffect(() => {
    if (!isPlaying) {
      resetAnimations()
    }
  }, [isPlaying, resetAnimations])

  if (!tree) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No tree data available
      </div>
    )
  }

  const positions = calculatePositions(tree)
  const { nodes, edges } = renderTree(tree, positions)
  const maxLevel = getMaxLevel(tree)
  const containerHeight = Math.max(300, (maxLevel + 1) * 80 + 100)

  return (
    <div className="w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex">
        {/* Tree visualization area */}
        <div className="flex-1 p-4">
          <div 
            ref={containerRef}
            className="relative bg-white rounded border"
            style={{ height: containerHeight, minWidth: '600px' }}
          >
            {/* SVG for edges */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {edges}
            </svg>
            
            {/* Nodes */}
            {nodes}
            
            {/* Pointers */}
            {pointers.map((pointer, index) => {
              const pos = positions.get(pointer.id)
              if (!pos) return null
              
              return (
                <div
                  key={`pointer-${index}`}
                  className={`absolute w-6 h-6 rounded-full border-2 ${pointer.color === 'red' ? 'bg-red-500 border-red-600' : 'bg-green-500 border-green-600'}`}
                  style={{
                    left: pos.x - 12,
                    top: pos.y - 40,
                    zIndex: 20
                  }}
                >
                  <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold ${pointer.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>
                    {pointer.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Call stack visualization */}
        <div className="w-64 bg-gray-100 p-4 border-l border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Call Stack</h3>
          <div ref={callStackRef} className="space-y-2">
            {/* Call stack items will be dynamically added here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreeVisualization