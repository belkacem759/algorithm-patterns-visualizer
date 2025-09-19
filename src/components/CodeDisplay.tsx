import React from 'react';

interface CodeDisplayProps {
  algorithm: string;
  currentStep: number;
  code: string;
  highlightedLines?: number[];
}

const renderCodeLine = (code: string) =>
  <span className="text-gray-100">{code}</span>;


export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  algorithm,
  currentStep,
  code,
  highlightedLines = []
}) => {
  // Force refresh to show algorithm code
  const lines = code.split('\n');

  const getAlgorithmTitle = (alg: string) => {
    switch (alg) {
      case 'two-sum': return 'Two Sum';
      case 'palindrome': return 'Valid Palindrome';
      case 'max-subarray': return 'Maximum Subarray';
      case 'longest-unique': return 'Longest Unique Substring';
      default: return alg;
    }
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400 mb-1">
          {getAlgorithmTitle(algorithm)}
        </h3>
        <div className="text-sm text-gray-400">
          Step {currentStep + 1} - Code Execution
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="font-mono text-sm leading-relaxed">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightedLines.includes(lineNumber);

            return (
              <div
                key={index}
                className={`flex py-1 ${isHighlighted
                  ? 'bg-yellow-500/20 border-l-4 border-yellow-500 pl-2'
                  : 'hover:bg-gray-800/30 pl-6'
                  } transition-all duration-300`}
              >
                <span className="text-gray-500 select-none w-8 text-right mr-4 flex-shrink-0">
                  {lineNumber}
                </span>
                <span
                  className={`flex-1 ${isHighlighted ? 'text-yellow-200 font-medium' : ''}`}
                >
                  {line ? renderCodeLine(line) : '\u00A0'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};