import React from 'react';
import { ExecutionResult } from '../types';

interface ConsoleProps {
  result: ExecutionResult | null;
  isLoading: boolean;
}

const Console: React.FC<ConsoleProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 animate-pulse p-4">
        <div className="flex flex-col items-center">
           <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
           <span className="text-sm">Running Code on Sandbox...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full p-6 flex flex-col items-center justify-center text-gray-500 text-sm font-mono text-center">
        <div className="mb-2 text-gray-600">
           <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
        </div>
        Ready to execute. 
        <br/>Press "Run" to submit your code to the secure sandbox.
      </div>
    );
  }

  const isError = result.verdict !== 'AC';
  const verdictColor = result.verdict === 'AC' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="h-full flex flex-col font-mono text-sm bg-[#0d1117] overflow-hidden">
      {/* Result Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/30 flex items-center justify-between shrink-0">
        <div>
          <div className={`font-bold text-lg flex items-center gap-2 ${verdictColor}`}>
            {result.verdict === 'AC' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
            {result.verdict === 'WA' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>}
            {result.verdict === 'RE' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
            
            {result.verdict === 'AC' ? 'Accepted' : 
             result.verdict === 'WA' ? 'Wrong Answer' : 
             result.verdict === 'TLE' ? 'Time Limit Exceeded' : 'Runtime Error'}
          </div>
          {(result.time || result.memory) && (
            <div className="text-gray-500 text-xs mt-1 flex gap-3">
              {result.time && <span>⏱ {result.time}</span>}
              {result.memory && <span>💾 {result.memory}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Runtime Error Message */}
        {result.error && (
          <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg">
            <h4 className="text-red-400 font-semibold mb-2 text-xs uppercase tracking-wider">Error Details</h4>
            <div className="text-red-200 whitespace-pre-wrap font-mono text-xs">{result.error}</div>
          </div>
        )}

        {/* Test Cases */}
        {result.testResults && result.testResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Test Cases</h4>
            {result.testResults.map((test, idx) => (
              <div key={idx} className={`border rounded-lg overflow-hidden ${test.passed ? 'border-gray-700 bg-gray-800/20' : 'border-red-900/50 bg-red-900/5'}`}>
                {/* Test Case Header */}
                <div className={`px-4 py-2 flex items-center justify-between border-b ${test.passed ? 'border-gray-700 bg-gray-800/40' : 'border-red-900/30 bg-red-900/20'}`}>
                  <span className="font-semibold text-gray-300">Case {idx + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${test.passed ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                    {test.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                
                {/* Test Case Body */}
                <div className="p-4 grid grid-cols-1 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block mb-1">Input</span>
                    <div className="bg-gray-900 p-2 rounded text-gray-300 font-mono break-all">{test.input}</div>
                  </div>
                  
                  {!test.passed ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-gray-500 block mb-1">Expected</span>
                          <div className="bg-gray-900 p-2 rounded text-gray-300 font-mono">{test.expected}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">Output</span>
                          <div className="bg-gray-900 p-2 rounded text-red-300 font-mono">{test.actual}</div>
                        </div>
                      </div>
                      {test.error && (
                        <div>
                           <span className="text-red-500 block mb-1">Error</span>
                           <div className="bg-red-900/10 p-2 rounded text-red-200 font-mono whitespace-pre-wrap">{test.error}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <span className="text-gray-500 block mb-1">Output</span>
                      <div className="bg-gray-900 p-2 rounded text-gray-400 font-mono">{test.actual}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Standard Output */}
        {result.output && (
          <div>
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Standard Output (Stdout)</div>
            <div className="bg-gray-800 p-3 rounded-lg text-gray-300 whitespace-pre-wrap border border-gray-700 text-xs">
              {result.output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;