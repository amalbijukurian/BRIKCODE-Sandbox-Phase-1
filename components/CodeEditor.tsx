import React from 'react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  onInteractionViolation?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language, onInteractionViolation }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (onInteractionViolation) {
      onInteractionViolation();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
           <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Language:</span>
           <span className="text-sm text-blue-300 font-medium">{language}</span>
        </div>
        <div className="text-xs text-gray-500">vim mode: off</div>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={handleChange}
          onPaste={handlePaste}
          className="w-full h-full bg-[#0d1117] text-gray-200 font-mono p-4 resize-none focus:outline-none text-sm leading-6"
          spellCheck={false}
          placeholder="Write your solution here..."
        />
      </div>
    </div>
  );
};

export default CodeEditor;