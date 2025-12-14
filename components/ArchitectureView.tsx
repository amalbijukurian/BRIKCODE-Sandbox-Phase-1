import React from 'react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-8 text-gray-300 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">System Architecture: Piston Execution Engine</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-blue-400 mb-3">1. High-Level Architecture</h2>
          <p className="mb-4 leading-relaxed">
            The system utilizes a <strong>Serverless / Remote Execution</strong> pattern. The frontend acts as the orchestrator, 
            bundling the user's code with a hidden Python test driver. This bundle is sent to the <strong>Piston API</strong>, 
            a high-performance code execution engine.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 font-mono text-sm mb-4">
            User Interface (React) <br/>
            &nbsp;&nbsp;⬇ (Inject Test Driver)<br/>
            Orchestrator Service (Client-Side)<br/>
            &nbsp;&nbsp;⬇ (HTTP POST /execute)<br/>
            Piston API (emkc.org)<br/>
            &nbsp;&nbsp;⬇ (Isolated Sandbox)<br/>
            Docker Container (Alpine/Python 3.10)
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-400 mb-3">2. Execution Flow</h2>
          <ol className="list-decimal pl-5 space-y-3 text-gray-400">
            <li>
              <strong>Code Injection:</strong> The user's Python code is wrapped with a custom <code>PYTHON_DRIVER</code> script. 
              This driver contains the test cases, timing logic, and verdict generation.
            </li>
            <li>
              <strong>API Request:</strong> The bundled code is sent to Piston via REST API.
              <code className="block bg-gray-900 p-2 mt-1 rounded text-xs text-green-400">POST https://emkc.org/api/v2/piston/execute</code>
            </li>
            <li>
              <strong>Sandboxed Run:</strong> Piston spins up an ephemeral Docker container, executes the Python script, capturing <code>stdout</code> and <code>stderr</code>.
            </li>
            <li>
              <strong>Verdict Parsing:</strong> The frontend receives the raw output. It parses a specific JSON block emitted by the test driver to determine 
              <span className="text-green-500 font-mono mx-1">AC</span>, 
              <span className="text-red-500 font-mono mx-1">WA</span>, or 
              <span className="text-orange-500 font-mono mx-1">RE</span>.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-400 mb-3">3. Implementation Details</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-white mb-2">Payload Construction</h3>
            <pre className="bg-gray-900 p-4 rounded-lg text-xs md:text-sm overflow-x-auto border-l-2 border-yellow-500">
{`// Frontend Orchestrator
const fullSource = \`\${userCode}

# --- INJECTED DRIVER ---
def run_tests():
    # ... Run TwoSum(case1) ...
    # ... Print JSON Result ...
\`;

const response = await fetch(PISTON_API, {
    method: "POST",
    body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [{ content: fullSource }]
    })
});`}
            </pre>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-white mb-2">Verdict Parsing Logic</h3>
            <pre className="bg-gray-900 p-4 rounded-lg text-xs md:text-sm overflow-x-auto border-l-2 border-cyan-500">
{`// Output Handling
const outputLines = run.stdout.split("---JUDGE_RESULT_JSON---");
const userLogs = outputLines[0];
const judgeResult = JSON.parse(outputLines[1]);

if (judgeResult.verdict === 'WA') {
    // Handle Wrong Answer
} else if (run.code !== 0) {
    // Handle Runtime Error (stderr)
}`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-400 mb-3">4. Security & Sandbox</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li><strong>Off-Device Execution:</strong> Arbitrary code is never executed on the user's browser (unlike Pyodide).</li>
            <li><strong>Piston Isolation:</strong> Piston uses Docker containers with:
               <ul className="list-circle pl-5 mt-1 text-sm text-gray-500">
                 <li>Process limit (max processes)</li>
                 <li>Memory limit (prevent OOM attacks)</li>
                 <li>Network disabled (prevent data exfiltration)</li>
                 <li><code>run_user</code> (non-root execution)</li>
               </ul>
            </li>
            <li><strong>Ephemeral:</strong> Containers are destroyed immediately after the process exits.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ArchitectureView;
