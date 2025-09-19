import React, { useState } from 'react';
import { Button } from './Button';

interface AlgorithmCategory {
  name: string;
  algorithms: {
    id: string;
    name: string;
    description: string;
  }[];
}

interface SidebarProps {
  categories: AlgorithmCategory[];
  selectedAlgorithm: string;
  onAlgorithmSelect: (algorithmId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedAlgorithm,
  onAlgorithmSelect,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(cat => cat.name))
  );

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'
      }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Algorithms</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>

      {/* Categories */}
      {!isCollapsed && (
        <div className="p-2">
          {categories.map((category) => (
            <div key={category.name} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="font-medium text-gray-700">{category.name}</span>
                {expandedCategories.has(category.name) ? (
                  <span className="text-gray-500">▼</span>
                ) : (
                  <span className="text-gray-500">▶</span>
                )}
              </button>

              {/* Algorithms List */}
              {expandedCategories.has(category.name) && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.algorithms.map((algorithm) => (
                    <button
                      key={algorithm.id}
                      onClick={() => onAlgorithmSelect(algorithm.id)}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors ${selectedAlgorithm === algorithm.id
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                      <div className="font-medium">{algorithm.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {algorithm.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};