import React, { useState, useEffect } from 'react';
import ProblemView from './components/ProblemView';
import ArchitectureView from './components/ArchitectureView';
import CodeEditor from './components/CodeEditor';
import Console from './components/Console';
import { runOrchestrator } from './services/orchestrator';
import { Problem, ExecutionResult, TabView, Language } from './types';

const PROBLEMS: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    hints: [
      "Try checking every possible pair of numbers first to see if they add up to the target.",
      "To make it faster, can you remember which numbers you have already looked at?",
      "As you walk through the list, check if the number needed to reach the target is already in your memory."
    ],
    starterCode: {
      python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}",
      c: "/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 2;\n    return 0;\n}"
    }
  },
  {
    id: "2",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    hints: [
      "Think about how you match nested items, like layers of an onion. The last one opened must be the first one closed.",
      "Use a list or stack to keep track of opening brackets: '(', '{', '['.",
      "When you see a closing bracket, check if it matches the most recent opening bracket you saved."
    ],
    starterCode: {
      python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        pass",
      java: "class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}",
      c: "#include <stdbool.h>\n\nbool isValid(char * s) {\n    // Write your code here\n    return false;\n}"
    }
  },
  {
    id: "3",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "In this case, no transactions are done and the max profit = 0." }
    ],
    hints: [
      "You can only sell a stock after you buy it. Look for the lowest price to buy.",
      "Go through the prices day by day and always remember the lowest price you have seen so far.",
      "On every day, calculate how much money you would make if you sold today (Today's Price - Lowest Price So Far)."
    ],
    starterCode: {
      python: "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        # Write your code here\n        pass",
      java: "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}",
      c: "int maxProfit(int* prices, int pricesSize) {\n    // Write your code here\n    return 0;\n}"
    }
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.PROBLEM);
  const [currentProblemId, setCurrentProblemId] = useState<string>(PROBLEMS[0].id);
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(PROBLEMS[0].starterCode.python);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [streak, setStreak] = useState(0);
  
  // Focus Tracker State
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationCount(prev => prev + 1);
      }
    };

    const handleBlur = () => {
      setViolationCount(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const currentProblem = PROBLEMS.find(p => p.id === currentProblemId) || PROBLEMS[0];

  const handleProblemChange = (problemId: string) => {
    const problem = PROBLEMS.find(p => p.id === problemId);
    if (problem) {
      setCurrentProblemId(problemId);
      setCode(problem.starterCode[language]);
      setExecutionResult(null);
      setViolationCount(0); // Reset violations when switching problems
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    const problem = PROBLEMS.find(p => p.id === currentProblemId);
    if (problem) {
      setCode(problem.starterCode[newLang]);
      setExecutionResult(null);
    }
  };

  const handleViolation = () => {
    setViolationCount(prev => prev + 1);
  };

  const executeCode = async (isSubmission: boolean) => {
    setIsExecuting(true);
    setExecutionResult(null);
    try {
      const result = await runOrchestrator(code, currentProblemId, language);
      setExecutionResult(result);
      
      // Update Streak Logic ONLY on Submission
      if (isSubmission) {
        if (result.verdict === 'AC') {
          setStreak(prev => prev + 1);
        } else {
          setStreak(0);
        }
      }

    } catch (e) {
      setExecutionResult({
        verdict: 'RE',
        output: '',
        error: 'Orchestrator Error'
      });
      if (isSubmission) {
        setStreak(0);
      }
    }
    setIsExecuting(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-white">
      {/* Header */}
      <header className="h-14 bg-[#161b22] border-b border-gray-700 flex items-center justify-between px-3 md:px-6 shrink-0 z-10">
        <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2 shrink-0">
            <span className="text-blue-500 text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </span>
            <span className="hidden sm:inline">BRIKCODE</span>
          </div>
          
          <div className="w-px h-6 bg-gray-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
             <select 
               value={currentProblemId}
               onChange={(e) => handleProblemChange(e.target.value)}
               className="bg-gray-800 border border-gray-600 text-white text-xs md:text-sm rounded px-2 py-1 focus:outline-none focus:border-blue-500 max-w-[120px] md:max-w-[200px] truncate"
             >
               {PROBLEMS.map(p => (
                 <option key={p.id} value={p.id}>{p.id}. {p.title}</option>
               ))}
             </select>

             <select 
               value={language}
               onChange={(e) => handleLanguageChange(e.target.value as Language)}
               className="bg-gray-800 border border-gray-600 text-white text-xs md:text-sm rounded px-2 py-1 focus:outline-none focus:border-blue-500 hidden sm:block"
             >
               <option value="python">Python 3</option>
               <option value="java">Java 15</option>
               <option value="c">C (GCC)</option>
             </select>
          </div>

          <nav className="flex bg-gray-800 rounded p-0.5 shrink-0">
            <button 
              onClick={() => setActiveTab(TabView.PROBLEM)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === TabView.PROBLEM ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Problem
            </button>
            <button 
              onClick={() => setActiveTab(TabView.ARCHITECTURE)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === TabView.ARCHITECTURE ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Arch
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0 pl-2">
          {/* Streak Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-2 py-1 bg-gray-900 rounded border border-gray-800">
             <div className={`text-sm transition-all transform ${streak > 0 ? 'scale-110 grayscale-0' : 'scale-100 grayscale opacity-50'}`}>🔥</div>
             <div className="flex flex-col leading-none">
               <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Streak</span>
               <span className={`text-xs font-mono font-medium ${streak > 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                 {streak}
               </span>
            </div>
          </div>

          {/* Focus Tracker Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-2 py-1 bg-gray-900 rounded border border-gray-800">
            <div className={`w-2 h-2 rounded-full shadow-lg ${violationCount === 0 ? 'bg-green-500 animate-pulse shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
            <div className="flex flex-col leading-none">
               <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Proctoring</span>
               <span className={`text-xs font-mono font-medium ${violationCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                 {violationCount === 0 ? 'Focused' : `${violationCount} Violations`}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => executeCode(false)}
              disabled={isExecuting}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-200 text-xs md:text-sm font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              {isExecuting ? (
                <svg className="animate-spin h-3 w-3 md:h-4 md:w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
              )}
              Run Code
            </button>

            <button 
              onClick={() => executeCode(true)}
              disabled={isExecuting}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              {isExecuting ? (
                <svg className="animate-spin h-3 w-3 md:h-4 md:w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              )}
              Submit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem or Architecture */}
        <div className="w-1/2 flex flex-col border-r border-gray-700 bg-[#0d1117] min-w-[300px]">
          {activeTab === TabView.PROBLEM ? (
             <ProblemView problem={currentProblem} onInteractionViolation={handleViolation} />
          ) : (
             <ArchitectureView />
          )}
        </div>

        {/* Right Panel: Editor & Console */}
        <div className="w-1/2 flex flex-col min-w-0">
          <div className="flex-1 border-b border-gray-700 min-h-0 relative">
            <CodeEditor code={code} setCode={setCode} language={language} onInteractionViolation={handleViolation} />
          </div>
          <div className="h-1/3 min-h-[150px] max-h-[50%] bg-[#0d1117] flex flex-col">
            <div className="px-3 py-1.5 bg-[#161b22] border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">
              Console
            </div>
            <div className="flex-1 overflow-hidden">
               <Console result={executionResult} isLoading={isExecuting} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;