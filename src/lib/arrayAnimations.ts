import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export class ArrayAnimations {
  private timeline: gsap.core.Timeline;
  
  constructor() {
    this.timeline = gsap.timeline();
  }

  // Animate pointer movement between array positions
  animatePointerMove(
    pointerId: string, 
    fromIndex: number, 
    toIndex: number, 
    elementWidth: number = 60,
    duration: number = 0.8
  ): Promise<void> {
    return new Promise((resolve) => {
      const pointer = document.querySelector(`[data-pointer="${pointerId}"]`);
      if (!pointer) {
        resolve();
        return;
      }

      const distance = (toIndex - fromIndex) * elementWidth;
      
      gsap.to(pointer, {
        x: `+=${distance}`,
        duration,
        ease: "power2.out",
        force3D: true,
        onComplete: resolve
      });
    });
  }

  // Highlight array elements with color transitions
  highlightElements(
    indices: number[], 
    color: string = '#3b82f6', 
    duration: number = 0.5,
    stagger: number = 0.1
  ): Promise<void> {
    return new Promise((resolve) => {
      const elements = indices.map(i => 
        document.querySelector(`[data-array-index="${i}"]`)
      ).filter(Boolean);

      if (elements.length === 0) {
        resolve();
        return;
      }

      gsap.to(elements, {
        backgroundColor: color,
        borderColor: color,
        scale: 1.05,
        duration,
        stagger,
        ease: "power2.out",
        force3D: true,
        onComplete: resolve
      });
    });
  }

  // Remove highlights from elements
  removeHighlights(
    indices: number[], 
    duration: number = 0.3
  ): Promise<void> {
    return new Promise((resolve) => {
      const elements = indices.map(i => 
        document.querySelector(`[data-array-index="${i}"]`)
      ).filter(Boolean);

      if (elements.length === 0) {
        resolve();
        return;
      }

      gsap.to(elements, {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
        scale: 1,
        duration,
        ease: "power2.out",
        force3D: true,
        onComplete: resolve
      });
    });
  }

  // Animate sliding window expansion/contraction
  animateWindow(
    leftIndex: number, 
    rightIndex: number, 
    elementWidth: number = 60,
    duration: number = 0.6
  ): Promise<void> {
    return new Promise((resolve) => {
      const window = document.querySelector('[data-sliding-window]');
      if (!window) {
        resolve();
        return;
      }

      const width = (rightIndex - leftIndex + 1) * elementWidth;
      const x = leftIndex * elementWidth;

      gsap.to(window, {
        x,
        width,
        duration,
        ease: "power2.inOut",
        force3D: true,
        onComplete: resolve
      });
    });
  }

  // Comparison animation with color feedback
  animateComparison(
    index1: number, 
    index2: number, 
    result: 'equal' | 'less' | 'greater' | 'found' | 'not-found',
    duration: number = 0.8
  ): Promise<void> {
    return new Promise((resolve) => {
      const element1 = document.querySelector(`[data-array-index="${index1}"]`);
      const element2 = document.querySelector(`[data-array-index="${index2}"]`);
      
      if (!element1 || !element2) {
        resolve();
        return;
      }

      const colors = {
        equal: '#10b981',    // green
        less: '#f59e0b',     // amber
        greater: '#ef4444',  // red
        found: '#8b5cf6',    // purple
        'not-found': '#6b7280' // gray
      };

      const color = colors[result];
      
      // Pulse animation for comparison
      const tl = gsap.timeline();
      
      tl.to([element1, element2], {
        scale: 1.1,
        backgroundColor: color,
        borderColor: color,
        duration: duration * 0.3,
        ease: "power2.out"
      })
      .to([element1, element2], {
        scale: 1.05,
        duration: duration * 0.4,
        ease: "power2.inOut"
      })
      .to([element1, element2], {
        scale: 1,
        backgroundColor: result === 'found' ? color : '#f8fafc',
        borderColor: result === 'found' ? color : '#e2e8f0',
        duration: duration * 0.3,
        ease: "power2.in",
        onComplete: resolve
      });
    });
  }

  // Flip animation for state changes
  animateStateChange(selector: string): Promise<void> {
    return new Promise((resolve) => {
      const state = Flip.getState(selector);
      
      // Trigger the state change (this should be done by the caller)
      // Then animate to the new state
      
      Flip.from(state, {
        duration: 0.6,
        ease: "power2.inOut",
        force3D: true,
        onComplete: resolve
      });
    });
  }

  // Staggered entrance animation for array elements
  animateArrayEntrance(
    elementCount: number, 
    duration: number = 1.2,
    stagger: number = 0.1
  ): Promise<void> {
    return new Promise((resolve) => {
      const elements = Array.from({ length: elementCount }, (_, i) => 
        document.querySelector(`[data-array-index="${i}"]`)
      ).filter(Boolean);

      if (elements.length === 0) {
        resolve();
        return;
      }

      gsap.fromTo(elements, 
        {
          y: 50,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration,
          stagger,
          ease: "back.out(1.7)",
          force3D: true,
          onComplete: resolve
        }
      );
    });
  }

  // Pointer bounce animation for emphasis
  bouncePointer(pointerId: string, intensity: number = 1.2): Promise<void> {
    return new Promise((resolve) => {
      const pointer = document.querySelector(`[data-pointer="${pointerId}"]`);
      if (!pointer) {
        resolve();
        return;
      }

      gsap.to(pointer, {
        y: -10 * intensity,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        force3D: true,
        onComplete: resolve
      });
    });
  }

  // Clear all animations
  clear(): void {
    this.timeline.clear();
    gsap.killTweensOf("*");
  }

  // Get timeline for chaining animations
  getTimeline(): gsap.core.Timeline {
    return this.timeline;
  }
}

// Utility functions for common animation patterns
export const arrayAnimationUtils = {
  // Calculate element position based on index
  getElementPosition(index: number, elementWidth: number = 60, gap: number = 8): number {
    return index * (elementWidth + gap);
  },

  // Get color for different states
  getStateColor(state: 'default' | 'active' | 'compared' | 'found' | 'window'): string {
    const colors = {
      default: '#f8fafc',
      active: '#3b82f6',
      compared: '#f59e0b',
      found: '#10b981',
      window: '#8b5cf6'
    };
    return colors[state];
  },

  // Create pointer element
  createPointer(id: string, name: string, color: string): HTMLElement {
    const pointer = document.createElement('div');
    pointer.setAttribute('data-pointer', id);
    pointer.className = 'absolute flex flex-col items-center pointer-events-none';
    pointer.innerHTML = `
      <div class="text-xs font-medium mb-1" style="color: ${color}">${name}</div>
      <div class="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent" 
           style="border-top-color: ${color}"></div>
    `;
    return pointer;
  }
};