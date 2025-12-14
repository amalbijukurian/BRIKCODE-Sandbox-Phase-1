export interface Message {
  role: 'user' | 'model';
  content: string;
}

export type Verdict = 'AC' | 'WA' | 'TLE' | 'RE' | 'PENDING' | null;

export type Language = 'python' | 'java' | 'c';

export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface ExecutionResult {
  verdict: Verdict;
  output: string;
  error?: string;
  time?: string;
  memory?: string;
  testResults?: TestResult[];
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<Language, string>;
  hints?: string[];
}

export enum TabView {
  PROBLEM = 'PROBLEM',
  ARCHITECTURE = 'ARCHITECTURE',
}