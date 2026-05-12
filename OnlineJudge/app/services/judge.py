import subprocess
import os
import time
import tempfile
import sys
from typing import Tuple

def execute_python(code: str, input_data: str, time_limit: float) -> Tuple[str, float, str]:
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode='w', encoding='utf-8') as f:
        f.write(code)
        temp_file = f.name

    start_time = time.time()
    try:
        process = subprocess.Popen(
            [sys.executable, temp_file],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8'
        )
        
        try:
            stdout, stderr = process.communicate(input=input_data, timeout=time_limit)
            exec_time = time.time() - start_time
            if process.returncode != 0:
                return (stderr or "Runtime Error").strip(), exec_time, "Runtime Error"
            return stdout.strip(), exec_time, "Success"
        except subprocess.TimeoutExpired:
            process.kill()
            return "Time Limit Exceeded", time_limit, "Time Limit Exceeded"
    except Exception as e:
        return str(e), 0, "Judge Error"
    finally:
        if os.path.exists(temp_file): os.remove(temp_file)

def execute_cpp(code: str, input_data: str, time_limit: float) -> Tuple[str, float, str]:
    with tempfile.TemporaryDirectory() as tmpdir:
        cpp_file = os.path.join(tmpdir, "solution.cpp")
        exe_file = os.path.join(tmpdir, "solution.exe") if sys.platform == "win32" else os.path.join(tmpdir, "solution")
        
        with open(cpp_file, "w", encoding='utf-8') as f:
            f.write(code)
        
        # Compile
        compile_proc = subprocess.run(
            ["g++", "-O3", cpp_file, "-o", exe_file],
            capture_output=True,
            text=True
        )
        
        if compile_proc.returncode != 0:
            return compile_proc.stderr.strip(), 0, "Compilation Error"
        
        # Run
        start_time = time.time()
        try:
            process = subprocess.Popen(
                [exe_file],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding='utf-8'
            )
            
            try:
                stdout, stderr = process.communicate(input=input_data, timeout=time_limit)
                exec_time = time.time() - start_time
                if process.returncode != 0:
                    return (stderr or "Runtime Error").strip(), exec_time, "Runtime Error"
                return stdout.strip(), exec_time, "Success"
            except subprocess.TimeoutExpired:
                process.kill()
                return "Time Limit Exceeded", time_limit, "Time Limit Exceeded"
        except Exception as e:
            return str(e), 0, "Judge Error"

def judge_submission(code: str, language: str, test_cases: list, time_limit: float) -> Tuple[str, float]:
    max_time = 0.0
    if not test_cases:
        return "No Test Cases", 0.0

    for tc in test_cases:
        if language.lower() == "python":
            output, exec_time, status = execute_python(code, tc.input_data, time_limit)
        elif language.lower() == "cpp":
            output, exec_time, status = execute_cpp(code, tc.input_data, time_limit)
        else:
            return "Language Not Supported", 0.0
            
        max_time = max(max_time, exec_time)
        if status != "Success":
            return status, max_time
            
        # Token-based comparison (ignores whitespace differences)
        user_tokens = output.split()
        expected_tokens = tc.expected_output.split()
        
        if user_tokens != expected_tokens:
            return "Wrong Answer", max_time
            
    return "Accepted", max_time
