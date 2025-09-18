import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { algorithmPatterns, getAllCategories } from '../data/algorithmPatterns'
import type { AlgorithmPattern, AlgorithmExample } from '../types/algorithm'

interface PatternSelectorProps {
  selectedPattern: AlgorithmPattern | null
  selectedExample: AlgorithmExample | null
  onPatternChange: (pattern: AlgorithmPattern) => void
  onExampleChange: (example: AlgorithmExample) => void
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  selectedPattern,
  selectedExample,
  onPatternChange,
  onExampleChange
}) => {
  const categories = getAllCategories()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Pattern Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Algorithm Pattern</CardTitle>
          <CardDescription>
            Choose from 24 common algorithm patterns used in coding interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedPattern?.id}
            onValueChange={(patternId) => {
              const pattern = algorithmPatterns.find(p => p.id === patternId)
              if (pattern) {
                onPatternChange(pattern)
                if (pattern.examples.length > 0) {
                  onExampleChange(pattern.examples[0])
                }
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an algorithm pattern..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-slate-600 bg-slate-50">
                    {category}
                  </div>
                  {algorithmPatterns
                    .filter(pattern => pattern.category === category)
                    .map(pattern => (
                      <SelectItem key={pattern.id} value={pattern.id}>
                        <div className="flex items-center gap-2">
                          <span>{pattern.name}</span>
                          <Badge className={getDifficultyColor(pattern.difficulty)}>
                            {pattern.difficulty}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  }
                </div>
              ))}
            </SelectContent>
          </Select>

          {/* Pattern Details */}
          {selectedPattern && (
            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{selectedPattern.name}</h3>
                <Badge className={getDifficultyColor(selectedPattern.difficulty)}>
                  {selectedPattern.difficulty}
                </Badge>
              </div>
              
              <p className="text-slate-700">{selectedPattern.description}</p>
              
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-medium">Time:</span> {selectedPattern.timeComplexity}
                </div>
                <div>
                  <span className="font-medium">Space:</span> {selectedPattern.spaceComplexity}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {selectedPattern.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example Selection */}
      {selectedPattern && selectedPattern.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Example</CardTitle>
            <CardDescription>
              Choose a specific example to visualize this pattern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedExample?.id}
              onValueChange={(exampleId) => {
                const example = selectedPattern.examples.find(e => e.id === exampleId)
                if (example) {
                  onExampleChange(example)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an example..." />
              </SelectTrigger>
              <SelectContent>
                {selectedPattern.examples.map(example => (
                  <SelectItem key={example.id} value={example.id}>
                    {example.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Example Details */}
            {selectedExample && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-2">
                <h4 className="font-semibold">{selectedExample.name}</h4>
                <p className="text-slate-700 text-sm">{selectedExample.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Input:</span>
                    <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                      {JSON.stringify(selectedExample.input, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="font-medium">Expected Output:</span>
                    <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                      {JSON.stringify(selectedExample.expectedOutput, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PatternSelector