import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import type { GraphNode, GraphEdge, SolutionStep, Pointer } from '../../types/algorithm'

interface GraphVisualizationProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  currentStep?: SolutionStep
  pointers?: Pointer[]
  isPlaying?: boolean
  onAnimationComplete?: () => void
}

interface GraphLayout {
  nodes: Map<string, { x: number; y: number }>
  edges: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; id: string }>
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  currentStep,
  pointers = [],
  isPlaying = false,
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<{ [key: string]: HTMLDivElement }>({})
  const edgesRef = useRef<{ [key: string]: SVGLineElement }>({})
  const labelsRef = useRef<{ [key: string]: HTMLDivElement }>({})
  const timelineRef = useRef<gsap.core.Timeline>()
  const frontierRef = useRef<HTMLDivElement>(null)

  // Calculate graph layout using force-directed algorithm
  const calculateLayout = useCallback((graphNodes: GraphNode[], graphEdges: GraphEdge[]): GraphLayout => {
    const layout: GraphLayout = {
      nodes: new Map(),
      edges: []
    }

    if (graphNodes.length === 0) return layout

    const width = 800
    const height = 600
    const centerX = width / 2
    const centerY = height / 2

    // Simple circular layout for better visualization
    if (graphNodes.length === 1) {
      layout.nodes.set(graphNodes[0].id, { x: centerX, y: centerY })
    } else {
      const radius = Math.min(width, height) * 0.3
      const angleStep = (2 * Math.PI) / graphNodes.length

      graphNodes.forEach((node, index) => {
        const angle = index * angleStep
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        layout.nodes.set(node.id, { x, y })
      })
    }

    // Calculate edge positions
    graphEdges.forEach(edge => {
      const fromPos = layout.nodes.get(edge.from)
      const toPos = layout.nodes.get(edge.to)
      if (fromPos && toPos) {
        layout.edges.push({
          from: fromPos,
          to: toPos,
          id: edge.id
        })
      }
    })

    return layout
  }, [])

  const layout = useMemo(() => {
    if (nodes.length === 0 || edges.length === 0) {
      return { nodes: new Map(), edges: [] }
    }
    return calculateLayout(nodes, edges)
  }, [nodes, edges, calculateLayout])

  // Render graph nodes
  const renderNodes = useCallback(() => {
    return nodes.map(node => {
      const pos = layout.nodes.get(node.id)
      if (!pos) return null

      return (
        <div key={`node-${node.id}`} className="absolute">
          {/* Node circle */}
          <div
            ref={el => { if (el) nodesRef.current[node.id] = el }}
            className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-blue-600 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              left: pos.x - 32,
              top: pos.y - 32,
              zIndex: 10
            }}
          >
            {node.value}
          </div>
          
          {/* Distance label */}
          {node.distance !== undefined && (
            <div
              ref={el => { if (el) labelsRef.current[`${node.id}-distance`] = el }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 rounded px-2 py-1 text-xs font-bold text-yellow-800"
              style={{
                left: pos.x - 16,
                top: pos.y - 50,
                zIndex: 15
              }}
            >
              d: {node.distance === Infinity ? '∞' : node.distance}
            </div>
          )}
        </div>
      )
    })
  }, [nodes, layout])

  // Render graph edges
  const renderEdges = useCallback(() => {
    return (
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {layout.edges.map(edge => {
          const graphEdge = edges.find(e => e.id === edge.id)
          if (!graphEdge) return null

          return (
            <g key={`edge-${edge.id}`}>
              <line
                ref={el => { if (el) edgesRef.current[edge.id] = el }}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="#64748b"
                strokeWidth="2"
                className="transition-all duration-300"
                markerEnd="url(#arrowhead)"
              />
              
              {/* Edge weight label */}
              {graphEdge.weight !== undefined && (
                <text
                  x={(edge.from.x + edge.to.x) / 2}
                  y={(edge.from.y + edge.to.y) / 2 - 5}
                  fill="#374151"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {graphEdge.weight}
                </text>
              )}
            </g>
          )
        })}
        
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#64748b"
            />
          </marker>
        </defs>
      </svg>
    )
  }, [edges, layout])

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
                scale: 1.3,
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
                duration: 0.4,
                ease: 'power2.out'
              }, index * 0.1)
              
              // Add pulse effect
              tl.to(element, {
                boxShadow: '0 0 0 20px rgba(34, 197, 94, 0)',
                duration: 0.8,
                ease: 'power2.out'
              }, '<')
            }
          })
          break

        case 'compare':
          // Highlight edges being compared
          animation.targets.forEach((target: string) => {
            const edge = edgesRef.current[target]
            if (edge) {
              tl.to(edge, {
                stroke: '#f59e0b',
                strokeWidth: 4,
                duration: 0.3,
                ease: 'power2.out'
              }, index * 0.1)
            }
          })
          break

        case 'move':
          // Animate shortest path
          animation.targets.forEach((target: string) => {
            const edge = edgesRef.current[target]
            if (edge) {
              tl.to(edge, {
                stroke: '#ef4444',
                strokeWidth: 5,
                duration: 0.4,
                ease: 'power2.out'
              }, index * 0.1)
            }
          })
          break

        default:
          break
      }
    })

    // Update distance labels if present in step data
    if (step.data && step.data.distances) {
      Object.entries(step.data.distances).forEach(([nodeId, distance]) => {
        const label = labelsRef.current[`${nodeId}-distance`]
        if (label) {
          tl.to(label, {
            scale: 1.2,
            duration: 0.2,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          }, '<')
        }
      })
    }

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

    // Reset all labels
    Object.values(labelsRef.current).forEach(element => {
      gsap.set(element, {
        scale: 1
      })
    })
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

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No graph data available
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex">
        {/* Graph visualization area */}
        <div className="flex-1 p-4">
          <div 
            ref={containerRef}
            className="relative bg-white rounded border"
            style={{ height: '600px', minWidth: '800px' }}
          >
            {/* Edges */}
            {renderEdges()}
            
            {/* Nodes */}
            {renderNodes()}
            
            {/* Pointers */}
            {pointers.map((pointer, index) => {
              const pos = layout.nodes.get(pointer.id)
              if (!pos) return null
              
              return (
                <div
                  key={`pointer-${index}`}
                  className={`absolute w-8 h-8 rounded-full border-2 ${pointer.color === 'red' ? 'bg-red-500 border-red-600' : 'bg-green-500 border-green-600'}`}
                  style={{
                    left: pos.x - 16,
                    top: pos.y - 60,
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
        
        {/* Algorithm info panel */}
        <div className="w-64 bg-gray-100 p-4 border-l border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Algorithm Info</h3>
          
          {/* Current frontier */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Current Frontier</h4>
            <div ref={frontierRef} className="space-y-1">
              {/* Frontier items will be dynamically added here */}
            </div>
          </div>
          
          {/* Graph statistics */}
          <div className="space-y-2 text-xs text-gray-600">
            <div>Nodes: {nodes.length}</div>
            <div>Edges: {edges.length}</div>
            <div>Current Step: {currentStep?.stepNumber || 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphVisualization