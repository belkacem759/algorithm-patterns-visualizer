import { gsap } from 'gsap'

// Color palette for algorithm visualizations
export const COLORS = {
  default: '#e2e8f0',
  active: '#3b82f6',
  comparing: '#f59e0b',
  sorted: '#10b981',
  error: '#ef4444',
  visited: '#8b5cf6',
  current: '#06b6d4',
  pointer: {
    left: '#ec4899',
    right: '#14b8a6',
    slow: '#f97316',
    fast: '#84cc16',
    target: '#6366f1'
  },
  background: {
    light: '#f8fafc',
    dark: '#1e293b'
  }
}

// Animation configuration interface
export interface AnimationConfig {
  duration?: number
  ease?: string
  delay?: number
  scale?: number
  color?: string
  stagger?: number
}

// Animation presets
export const ANIMATION_PRESETS = {
  fast: { duration: 0.3, ease: 'power2.out' },
  normal: { duration: 0.6, ease: 'power2.inOut' },
  slow: { duration: 1.0, ease: 'power2.inOut' },
  bounce: { duration: 0.8, ease: 'back.out(1.7)' },
  elastic: { duration: 1.2, ease: 'elastic.out(1, 0.3)' }
}

// Main animation class for algorithm visualizations
export class AlgorithmAnimations {
  private timeline: gsap.core.Timeline

  constructor() {
    this.timeline = gsap.timeline()
  }

  // Timeline control methods
  play(): void {
    this.timeline.play()
  }

  pause(): void {
    this.timeline.pause()
  }

  restart(): void {
    this.timeline.restart()
  }

  clear(): void {
    this.timeline.clear()
  }

  seek(time: number): void {
    this.timeline.seek(time)
  }

  // Array visualization animations
  animateArrayElement(element: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline.to(element, {
      scale: config.scale || 1.1,
      backgroundColor: config.color || COLORS.active,
      duration: config.duration,
      ease: config.ease,
      force3D: true,
    }, '>')
  }

  swapArrayElements(element1: string | Element, element2: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline
      .to([element1, element2], {
        y: -20,
        duration: config.duration! / 3,
        ease: 'power2.out',
        force3D: true,
      }, '>')
      .to([element1, element2], {
        x: (index: number, target: Element) => {
          const rect1 = (element1 as Element).getBoundingClientRect()
          const rect2 = (element2 as Element).getBoundingClientRect()
          return target === element1 ? rect2.left - rect1.left : rect1.left - rect2.left
        },
        duration: config.duration! / 3,
        ease: 'power2.inOut',
        force3D: true,
      })
      .to([element1, element2], {
        y: 0,
        x: 0,
        duration: config.duration! / 3,
        ease: 'power2.in',
        force3D: true,
      })
  }

  highlightArrayRange(elements: (string | Element)[], config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline.to(elements, {
      backgroundColor: config.color || COLORS.comparing,
      scale: config.scale || 1.05,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger || 0.1,
      force3D: true,
    }, '>')
  }

  // Tree visualization animations
  highlightTreeNode(node: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline.to(node, {
      scale: 1.2,
      backgroundColor: config.color || COLORS.active,
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
      duration: config.duration,
      ease: config.ease,
      force3D: true,
    }, '>')
  }

  animateTreeTraversal(path: (string | Element)[], config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    path.forEach((node, index) => {
      this.timeline.to(node, {
        backgroundColor: COLORS.visited,
        scale: 1.1,
        duration: config.duration! / 2,
        ease: config.ease,
        force3D: true,
      }, `+=${index * 0.2}`)
    })
  }

  rotateTree(container: string | Element, direction: 'left' | 'right', config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    const rotation = direction === 'left' ? -15 : 15
    
    this.timeline
      .to(container, {
        rotation: rotation,
        duration: config.duration! / 2,
        ease: 'power2.out',
        force3D: true,
      }, '>')
      .to(container, {
        rotation: 0,
        duration: config.duration! / 2,
        ease: 'power2.in',
        force3D: true,
      })
  }

  // Graph visualization animations
  highlightGraphNode(node: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline.to(node, {
      scale: 1.3,
      backgroundColor: config.color || COLORS.current,
      boxShadow: '0 0 25px rgba(6, 182, 212, 0.6)',
      duration: config.duration,
      ease: config.ease,
      force3D: true,
    }, '>')
  }

  animateGraphEdge(edge: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline
      .fromTo(edge, 
        { strokeDasharray: '5,5', strokeDashoffset: 10 },
        {
          strokeDashoffset: 0,
          stroke: config.color || COLORS.active,
          strokeWidth: 3,
          duration: config.duration,
          ease: config.ease,
        }, '>')
  }

  animateGraphPath(nodes: (string | Element)[], edges: (string | Element)[], config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    nodes.forEach((node, index) => {
      this.timeline.to(node, {
        backgroundColor: COLORS.visited,
        scale: 1.2,
        duration: config.duration! / 2,
        ease: config.ease,
        force3D: true,
      }, `+=${index * 0.3}`)
    })

    edges.forEach((edge, index) => {
      this.timeline.to(edge, {
        stroke: COLORS.active,
        strokeWidth: 4,
        duration: config.duration! / 2,
        ease: config.ease,
      }, `+=${index * 0.3 + 0.1}`)
    })
  }

  // Utility animations
  fadeIn(element: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline.fromTo(element, 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: config.duration,
        ease: config.ease,
        force3D: true,
      }, '>')
  }

  fadeOut(element: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline.to(element, {
      opacity: 0,
      y: -20,
      duration: config.duration,
      ease: config.ease,
      force3D: true,
    }, '>')
  }

  slideIn(element: string | Element, direction: 'left' | 'right' | 'up' | 'down', config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    const fromProps: any = { opacity: 0 }
    const toProps: any = { opacity: 1 }

    switch (direction) {
      case 'left':
        fromProps.x = -100
        toProps.x = 0
        break
      case 'right':
        fromProps.x = 100
        toProps.x = 0
        break
      case 'up':
        fromProps.y = -100
        toProps.y = 0
        break
      case 'down':
        fromProps.y = 100
        toProps.y = 0
        break
    }

    this.timeline.fromTo(element, fromProps, {
      ...toProps,
      duration: config.duration,
      ease: config.ease,
      force3D: true,
    }, '>')
  }

  pulse(element: string | Element, config: AnimationConfig = ANIMATION_PRESETS.normal): void {
    this.timeline
      .to(element, {
        scale: 1.1,
        duration: config.duration! / 2,
        ease: 'power2.out',
        force3D: true,
      }, '>')
      .to(element, {
        scale: 1,
        duration: config.duration! / 2,
        ease: 'power2.in',
        force3D: true,
      })
  }

  shake(element: string | Element, config: AnimationConfig = ANIMATION_PRESETS.fast): void {
    this.timeline.to(element, {
      x: '+=10',
      yoyo: true,
      repeat: 5,
      duration: config.duration! / 6,
      ease: 'power2.inOut',
      force3D: true,
    }, '>')
  }

  // Reset animations
  resetElement(element: string | Element): void {
    gsap.set(element, {
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
      opacity: 1,
      backgroundColor: COLORS.default,
      boxShadow: 'none',
      force3D: true,
    })
  }

  resetAll(elements: (string | Element)[]): void {
    elements.forEach(element => this.resetElement(element))
  }
}

// Create singleton instance
export const algorithmAnimations = new AlgorithmAnimations()

// Utility functions
export const createTimeline = (): gsap.core.Timeline => gsap.timeline()

export const animateStagger = (
  elements: (string | Element)[],
  props: gsap.TweenVars,
  stagger: number = 0.1
): gsap.core.Timeline => {
  return gsap.timeline().to(elements, {
    ...props,
    stagger,
    force3D: true,
  })
}

export const animateSequence = (
  animations: Array<{ target: string | Element; props: gsap.TweenVars; delay?: number }>
): gsap.core.Timeline => {
  const tl = gsap.timeline()
  
  animations.forEach(({ target, props, delay = 0 }) => {
    tl.to(target, {
      ...props,
      force3D: true,
    }, `+=${delay}`)
  })
  
  return tl
}