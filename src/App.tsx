import React from 'react';
import { ArrayPatternVisualizer } from './components/ArrayPatternVisualizer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Algorithm Pattern Visualizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive visualizations of two pointers and sliding window patterns
            with smooth GSAP animations.
          </p>
        </header>

        <div className="flex justify-center">
          <ArrayPatternVisualizer className="max-w-4xl w-full" />
        </div>
      </div>
    </div>
  );
}

export default App;
