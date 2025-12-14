import React, { useState, useEffect } from 'react';
import { Problem } from '../types';

interface ProblemViewProps {
  problem: Problem;
  onInteractionViolation?: () => void;
}

const ProblemView: React.FC<ProblemViewProps> = ({ problem, onInteractionViolation }) => {
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // Reset revealed hints when the problem changes
  useEffect(() => {
    setRevealedHints(0);
  }, [problem.id]);

  const handleCopy = () => {
    if (onInteractionViolation) {
      onInteractionViolation();
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6" onCopy={handleCopy}>
      <h1 className="text-2xl font-bold text-white mb-2">
        {problem.id}. {problem.title}
      </h1>
      <div className="flex gap-2 mb-6">
        <span className={`px-2 py-0.5 rounded text-xs font-medium 
          ${problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : 
            problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 
            'bg-red-900 text-red-300'}`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-4">{problem.description}</p>

        <h3 className="text-white font-semibold mt-6 mb-3">Examples</h3>
        <div className="space-y-4">
          {problem.examples.map((ex, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="mb-2">
                <span className="text-gray-400 text-sm font-medium">Input:</span>
                <code className="ml-2 text-gray-200 font-mono bg-gray-900 px-1 py-0.5 rounded">{ex.input}</code>
              </div>
              <div className="mb-2">
                <span className="text-gray-400 text-sm font-medium">Output:</span>
                <code className="ml-2 text-gray-200 font-mono bg-gray-900 px-1 py-0.5 rounded">{ex.output}</code>
              </div>
              {ex.explanation && (
                <div>
                  <span className="text-gray-400 text-sm font-medium">Explanation:</span>
                  <span className="ml-2 text-gray-400 text-sm">{ex.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hints Section */}
        {problem.hints && problem.hints.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Hints
                </h3>
                {revealedHints < problem.hints.length && (
                    <button
                        onClick={() => setRevealedHints(prev => prev + 1)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-blue-400 border border-gray-600 px-3 py-1.5 rounded transition-colors"
                    >
                        Show Hint ({revealedHints + 1}/{problem.hints.length})
                    </button>
                )}
            </div>
            
            <div className="space-y-3">
                {problem.hints.slice(0, revealedHints).map((hint, idx) => (
                    <div key={idx} className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg text-sm text-blue-200 animate-fadeIn">
                        <span className="font-bold text-blue-400 mr-2">Hint {idx + 1}:</span>
                        {hint}
                    </div>
                ))}
                {revealedHints === 0 && (
                    <div className="text-gray-500 text-sm italic">
                        Stuck? Reveal a hint to get a nudge in the right direction.
                    </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemView;