import { ExecutionResult, TestResult, Language } from "../types";

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

const JUDGE_DELIMITER = "---JUDGE_RESULT_JSON---";

// --- PYTHON DRIVER GENERATOR ---
const generatePythonDriver = (problemId: string, userCode: string) => {
  const HEADER = `
import sys
import json
import time
import resource

JUDGE_DELIMITER = "${JUDGE_DELIMITER}"

def run_tests():
    results = []
    
    try:
        if 'Solution' not in globals():
            print(f"{JUDGE_DELIMITER}")
            print(json.dumps({"verdict": "RE", "error": "Class 'Solution' not found."}))
            return

        sol = Solution()
`;

  const FOOTER = `
        # Analyze Verdict
        verdict = "AC"
        error_msg = ""
        total_time = 0
        
        test_results_payload = []

        for i, r in enumerate(results):
            if "time" in r:
                total_time += r["time"]
            
            is_pass = r["pass"]
            test_results_payload.append({
                "input": r.get("input", ""),
                "expected": r.get("expected", ""),
                "actual": r.get("got", ""),
                "passed": is_pass,
                "error": r.get("error", None)
            })

            if not is_pass:
                verdict = "WA"
                if "error" in r:
                    verdict = "RE"
                    if not error_msg: error_msg = f"Runtime Error on Test Case {i+1}: {r['error']}"
                else:
                    if not error_msg: error_msg = f"Wrong Answer on Test Case {i+1}"
        
        mem_kb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        mem_mb = mem_kb / 1024.0

        final_output = {
            "verdict": verdict,
            "error": error_msg,
            "time": f"{total_time:.2f}ms",
            "memory": f"{mem_mb:.2f}MB",
            "testResults": test_results_payload
        }
        
        print(f"\\n{JUDGE_DELIMITER}")
        print(json.dumps(final_output))

    except Exception as e:
        print(f"\\n{JUDGE_DELIMITER}")
        print(json.dumps({"verdict": "RE", "error": str(e)}))

if __name__ == "__main__":
    run_tests()
`;

  let TEST_CASES = "";
  if (problemId === "1") {
    TEST_CASES = `
        # --- Test Case 1 ---
        try:
            input_str = "nums=[2,7,11,15], target=9"
            expected_str = "[0, 1]"
            start_t = time.perf_counter()
            res1 = sol.twoSum([2,7,11,15], 9)
            end_t = time.perf_counter()
            pass1 = False
            if res1 and len(res1) == 2:
                n = [2,7,11,15]
                if n[res1[0]] + n[res1[1]] == 9 and res1[0] != res1[1]:
                    pass1 = True
            results.append({ "pass": pass1, "input": input_str, "expected": expected_str, "got": str(res1), "time": (end_t - start_t) * 1000 })
        except Exception as e:
            results.append({ "pass": False, "input": input_str, "expected": expected_str, "got": "Error", "error": str(e) })

        # --- Test Case 2 ---
        try:
            input_str = "nums=[3,2,4], target=6"
            expected_str = "[1, 2]"
            start_t = time.perf_counter()
            res2 = sol.twoSum([3,2,4], 6)
            end_t = time.perf_counter()
            pass2 = False
            if res2 and len(res2) == 2:
                n = [3,2,4]
                if n[res2[0]] + n[res2[1]] == 6 and res2[0] != res2[1]:
                    pass2 = True
            results.append({ "pass": pass2, "input": input_str, "expected": expected_str, "got": str(res2), "time": (end_t - start_t) * 1000 })
        except Exception as e:
            results.append({ "pass": False, "input": input_str, "expected": expected_str, "got": "Error", "error": str(e) })
    `;
  } else if (problemId === "2") {
    TEST_CASES = `
        try:
            input_str = 's = "()"'
            expected_str = "True"
            start_t = time.perf_counter()
            res1 = sol.isValid("()")
            end_t = time.perf_counter()
            results.append({ "pass": res1 is True, "input": input_str, "expected": expected_str, "got": str(res1), "time": (end_t - start_t) * 1000 })
        except Exception as e:
            results.append({ "pass": False, "input": input_str, "expected": expected_str, "got": "Error", "error": str(e) })

        try:
            input_str = 's = "()[]{}"'
            expected_str = "True"
            start_t = time.perf_counter()
            res2 = sol.isValid("()[]{}")
            end_t = time.perf_counter()
            results.append({ "pass": res2 is True, "input": input_str, "expected": expected_str, "got": str(res2), "time": (end_t - start_t) * 1000 })
        except Exception as e:
            results.append({ "pass": False, "input": input_str, "expected": expected_str, "got": "Error", "error": str(e) })
        
        try:
            input_str = 's = "(]"'
            expected_str = "False"
            start_t = time.perf_counter()
            res3 = sol.isValid("(]")
            end_t = time.perf_counter()
            results.append({ "pass": res3 is False, "input": input_str, "expected": expected_str, "got": str(res3), "time": (end_t - start_t) * 1000 })
        except Exception as e:
            results.append({ "pass": False, "input": input_str, "expected": expected_str, "got": "Error", "error": str(e) })
    `;
  } else if (problemId === "3") {
    TEST_CASES = `
        try:
            input_str = "prices = [7,1,5,3,6,4]"
            expected_str = "5"
            start_t = time.perf_counter()
            res1 = sol.maxProfit([7,1,5,3,6,4])
            end_t = time.perf_counter()
            results.append({ "pass": res1 == 5, "input": input_str, "expected": expected_str, "got": str(res1), "time": (end_t - start_t) * 1000 })
        except Exception as e:
            results.append({ "pass": False, "input": input_str, "expected": expected_str, "got": "Error", "error": str(e) })

        try:
            input_str = "prices = [7,6,4,3,1]"
            expected_str = "0"
            start_t = time.perf_counter()
            res2 = sol.maxProfit([7,6,4,3,1])
            end_t = time.perf_counter()
            results.append({ "pass": res2 == 0, "input": input_str, "expected": expected_str, "got": str(res2), "time": (end_t - start_t) * 1000 })
        except Exception as e:
            results.append({ "pass": False, "input": input_str, "expected": expected_str, "got": "Error", "error": str(e) })
    `;
  }
  return userCode + "\n\n" + HEADER + TEST_CASES + FOOTER;
};

// --- JAVA DRIVER GENERATOR ---
const generateJavaDriver = (problemId: string, userCode: string) => {
  const HEADER = `
import java.util.*;
import java.util.concurrent.TimeUnit;

public class Main {
    private static final String JUDGE_DELIMITER = "${JUDGE_DELIMITER}";
    
    static class TestResult {
        String input;
        String expected;
        String actual;
        boolean passed;
        String error;
        long time;
        
        public String toJson() {
            String errStr = error == null ? "null" : "\\"" + error.replace("\\"", "\\\\\\"") + "\\"";
            return String.format(
                "{\\"input\\": \\"%s\\", \\"expected\\": \\"%s\\", \\"actual\\": \\"%s\\", \\"passed\\": %b, \\"error\\": %s, \\"time\\": %d}",
                input.replace("\\"", "\\\\\\""), expected.replace("\\"", "\\\\\\""), actual.replace("\\"", "\\\\\\""), passed, errStr, time
            );
        }
    }

    public static void main(String[] args) {
        List<TestResult> results = new ArrayList<>();
        Solution sol = new Solution();
        long totalTime = 0;
        
`;

  let TEST_CASES = "";
  if (problemId === "1") {
      TEST_CASES = `
        try {
            int[] nums = {2,7,11,15};
            int target = 9;
            long start = System.nanoTime();
            int[] res = sol.twoSum(nums, target);
            long end = System.nanoTime();
            
            boolean passed = false;
            if (res != null && res.length == 2) {
                if (nums[res[0]] + nums[res[1]] == target && res[0] != res[1]) passed = true;
            }
            
            TestResult r = new TestResult();
            r.input = "nums=[2,7,11,15], target=9";
            r.expected = "[0, 1]";
            r.actual = Arrays.toString(res);
            r.passed = passed;
            r.time = (end - start) / 1000000; // ms
            totalTime += r.time;
            results.add(r);
        } catch (Exception e) {
            TestResult r = new TestResult();
            r.passed = false;
            r.error = e.toString();
            results.add(r);
        }
        
        try {
            int[] nums = {3,2,4};
            int target = 6;
            long start = System.nanoTime();
            int[] res = sol.twoSum(nums, target);
            long end = System.nanoTime();
            
            boolean passed = false;
            if (res != null && res.length == 2) {
                if (nums[res[0]] + nums[res[1]] == target && res[0] != res[1]) passed = true;
            }
            
            TestResult r = new TestResult();
            r.input = "nums=[3,2,4], target=6";
            r.expected = "[1, 2]";
            r.actual = Arrays.toString(res);
            r.passed = passed;
            r.time = (end - start) / 1000000;
            totalTime += r.time;
            results.add(r);
        } catch (Exception e) {
            TestResult r = new TestResult();
            r.passed = false;
            r.error = e.toString();
            results.add(r);
        }
      `;
  } else if (problemId === "2") {
      TEST_CASES = `
        String[] inputs = {"()", "()[]{}", "(]"};
        String[] expected = {"true", "true", "false"};
        boolean[] expBool = {true, true, false};
        
        for(int i=0; i<3; i++) {
             try {
                long start = System.nanoTime();
                boolean res = sol.isValid(inputs[i]);
                long end = System.nanoTime();
                
                TestResult r = new TestResult();
                r.input = "s=\\"" + inputs[i] + "\\"";
                r.expected = expected[i];
                r.actual = String.valueOf(res);
                r.passed = (res == expBool[i]);
                r.time = (end - start) / 1000000;
                totalTime += r.time;
                results.add(r);
             } catch(Exception e) {
                TestResult r = new TestResult();
                r.passed = false;
                r.error = e.toString();
                results.add(r);
             }
        }
      `;
  } else if (problemId === "3") {
      TEST_CASES = `
        int[][] pricesArr = {{7,1,5,3,6,4}, {7,6,4,3,1}};
        int[] expected = {5, 0};
        
        for(int i=0; i<2; i++) {
             try {
                long start = System.nanoTime();
                int res = sol.maxProfit(pricesArr[i]);
                long end = System.nanoTime();
                
                TestResult r = new TestResult();
                r.input = "prices=" + Arrays.toString(pricesArr[i]);
                r.expected = String.valueOf(expected[i]);
                r.actual = String.valueOf(res);
                r.passed = (res == expected[i]);
                r.time = (end - start) / 1000000;
                totalTime += r.time;
                results.add(r);
             } catch(Exception e) {
                TestResult r = new TestResult();
                r.passed = false;
                r.error = e.toString();
                results.add(r);
             }
        }
      `;
  }

  const FOOTER = `
        String verdict = "AC";
        String errorMsg = "";
        
        StringBuilder jsonResults = new StringBuilder("[");
        for(int i=0; i<results.size(); i++) {
            TestResult r = results.get(i);
            jsonResults.append(r.toJson());
            if(i < results.size()-1) jsonResults.append(",");
            
            if(!r.passed) {
                verdict = "WA";
                if(r.error != null) {
                    verdict = "RE";
                    if(errorMsg.isEmpty()) errorMsg = "Runtime Error: " + r.error;
                } else if(errorMsg.isEmpty()) {
                    errorMsg = "Wrong Answer";
                }
            }
        }
        jsonResults.append("]");
        
        System.out.println("\\n" + JUDGE_DELIMITER);
        System.out.printf("{\\"verdict\\": \\"%s\\", \\"error\\": \\"%s\\", \\"time\\": \\"%.2fms\\", \\"memory\\": \\"0MB\\", \\"testResults\\": %s}", 
            verdict, errorMsg, (double)totalTime, jsonResults.toString());
    }
}
`;
  // Inject user code at the end
  return HEADER + TEST_CASES + FOOTER + "\n\n" + userCode;
};

// --- C DRIVER GENERATOR ---
const generateCDriver = (problemId: string, userCode: string) => {
    const HEADER = `
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <time.h>

const char* JUDGE_DELIMITER = "${JUDGE_DELIMITER}";

// User Code Prototypes
#ifdef __cplusplus
extern "C" {
#endif

// We just append user code, so prototypes are handled there or implicitly.
// But we need to declare them to avoid warnings if user code is below main.
// Actually, standard C requires declaration before usage. 
// Strategy: Put User Code ABOVE main.

${userCode}

#ifdef __cplusplus
}
#endif

void print_json_result(const char* input, const char* expected, const char* actual, bool passed, const char* error, double time_ms, bool last) {
    printf("{\\"input\\": \\"%s\\", \\"expected\\": \\"%s\\", \\"actual\\": \\"%s\\", \\"passed\\": %s, \\"error\\": %s, \\"time\\": %.2f}%s",
           input, expected, actual, passed ? "true" : "false", error ? error : "null", time_ms, last ? "" : ",");
}

int main() {
    printf("\\n%s\\n", JUDGE_DELIMITER);
    printf("{\\"testResults\\": [");
    
    char* verdict = "AC";
    char* error_msg = "";
    double total_time = 0;
    bool all_passed = true;
`;

  let TEST_CASES = "";
  if (problemId === "1") { // Two Sum
    TEST_CASES = `
    // Case 1
    {
        int nums[] = {2,7,11,15};
        int target = 9;
        int returnSize;
        clock_t start = clock();
        int* res = twoSum(nums, 4, target, &returnSize);
        clock_t end = clock();
        double time_ms = ((double)(end - start)) * 1000.0 / CLOCKS_PER_SEC;
        total_time += time_ms;

        bool passed = false;
        char actual[100] = "null";
        if(res && returnSize == 2) {
            sprintf(actual, "[%d, %d]", res[0], res[1]);
            if(nums[res[0]] + nums[res[1]] == target && res[0] != res[1]) passed = true;
        }
        if(!passed) all_passed = false;
        
        print_json_result("nums=[2,7,11,15], target=9", "[0, 1]", actual, passed, "null", time_ms, false);
        if(res) free(res);
    }
    // Case 2
    {
        int nums[] = {3,2,4};
        int target = 6;
        int returnSize;
        clock_t start = clock();
        int* res = twoSum(nums, 3, target, &returnSize);
        clock_t end = clock();
        double time_ms = ((double)(end - start)) * 1000.0 / CLOCKS_PER_SEC;
        total_time += time_ms;

        bool passed = false;
        char actual[100] = "null";
        if(res && returnSize == 2) {
            sprintf(actual, "[%d, %d]", res[0], res[1]);
            if(nums[res[0]] + nums[res[1]] == target && res[0] != res[1]) passed = true;
        }
        if(!passed) all_passed = false;
        
        print_json_result("nums=[3,2,4], target=6", "[1, 2]", actual, passed, "null", time_ms, true);
        if(res) free(res);
    }
    `;
  } else if (problemId === "2") { // Valid Parentheses
    TEST_CASES = `
    char* inputs[] = {"()", "()[]{}", "(]"};
    char* expected[] = {"true", "true", "false"};
    bool expBool[] = {true, true, false};
    
    for(int i=0; i<3; i++) {
        clock_t start = clock();
        bool res = isValid(inputs[i]);
        clock_t end = clock();
        double time_ms = ((double)(end - start)) * 1000.0 / CLOCKS_PER_SEC;
        total_time += time_ms;
        
        bool passed = (res == expBool[i]);
        if(!passed) all_passed = false;
        
        char inputStr[50];
        sprintf(inputStr, "s=\\"%s\\"", inputs[i]);
        print_json_result(inputStr, expected[i], res ? "true" : "false", passed, "null", time_ms, i==2);
    }
    `;
  } else if (problemId === "3") { // Max Profit
    TEST_CASES = `
    int p1[] = {7,1,5,3,6,4};
    int p2[] = {7,6,4,3,1};
    int* inputs[] = {p1, p2};
    int sizes[] = {6, 5};
    int exp[] = {5, 0};
    
    for(int i=0; i<2; i++) {
        clock_t start = clock();
        int res = maxProfit(inputs[i], sizes[i]);
        clock_t end = clock();
        double time_ms = ((double)(end - start)) * 1000.0 / CLOCKS_PER_SEC;
        total_time += time_ms;
        
        bool passed = (res == exp[i]);
        if(!passed) all_passed = false;
        
        char actual[20];
        sprintf(actual, "%d", res);
        char expectedStr[20];
        sprintf(expectedStr, "%d", exp[i]);
        char inp[100] = "prices=[...]"; // simplifying C string manip
        
        print_json_result(inp, expectedStr, actual, passed, "null", time_ms, i==1);
    }
    `;
  }

  const FOOTER = `
    printf("], \\"verdict\\": \\"%s\\", \\"time\\": \\"%.2fms\\", \\"memory\\": \\"0MB\\"}", all_passed ? "AC" : "WA", total_time);
    return 0;
}
`;
    // For C, User Code goes BEFORE Main to act as prototypes/impl
    return HEADER + TEST_CASES + FOOTER;
};


export const runOrchestrator = async (userCode: string, problemId: string, language: Language = 'python'): Promise<ExecutionResult> => {
  let requestBody;
  
  if (language === 'python') {
      const fullSource = generatePythonDriver(problemId, userCode);
      requestBody = {
          language: "python",
          version: "3.10.0",
          files: [{ content: fullSource }]
      };
  } else if (language === 'java') {
      const fullSource = generateJavaDriver(problemId, userCode);
      requestBody = {
          language: "java",
          version: "15.0.2",
          files: [{ name: "Main.java", content: fullSource }]
      };
  } else if (language === 'c') {
      const fullSource = generateCDriver(problemId, userCode);
      requestBody = {
          language: "c",
          version: "10.2.0",
          files: [{ name: "main.c", content: fullSource }]
      };
  }

  try {
    const response = await fetch(PISTON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`Piston API Error: ${response.statusText}`);

    const data = await response.json();
    const run = data.run;

    if (run.code !== 0 && !run.stdout.includes(JUDGE_DELIMITER)) {
        return {
            verdict: "RE",
            output: run.stdout,
            error: run.stderr || "Compilation/Runtime Error",
        };
    }

    const outputLines = run.stdout.split(JUDGE_DELIMITER);
    const userStdout = outputLines[0] || "";
    const judgeResultRaw = outputLines[1];

    if (!judgeResultRaw) {
        return {
            verdict: "RE",
            output: userStdout,
            error: run.stderr || "Execution failed without verdict.",
        };
    }

    try {
        const judgeResult = JSON.parse(judgeResultRaw);
        return {
            verdict: judgeResult.verdict,
            output: userStdout,
            error: judgeResult.verdict === "RE" ? judgeResult.error : undefined,
            time: judgeResult.time,
            memory: judgeResult.memory,
            testResults: judgeResult.testResults,
        };
    } catch (e) {
        return {
            verdict: "RE",
            output: run.stdout,
            error: "Failed to parse judge output. " + (e as Error).message,
        };
    }

  } catch (error: any) {
    return {
      verdict: "RE",
      output: "",
      error: "System Error: " + error.message,
    };
  }
};
