import subprocess
import sys
import os
import signal
import time

# Ensure minimal runtime dependencies are available so `python app.py` just works
def _ensure_min_deps():
    required = {
        "flask": "flask",
        "flask_cors": "flask-cors",
    }

    missing = []
    for module_name, pkg_name in required.items():
        try:
            __import__(module_name)
        except ImportError:
            missing.append(pkg_name)

    if not missing:
        return

    # Try to ensure pip exists, then install
    try:
        subprocess.run([sys.executable, "-m", "ensurepip", "--upgrade"], check=False)
    except Exception:
        pass  # Best effort

    try:
        print(f"Installing missing packages: {', '.join(missing)} ...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", *missing])
        print("Packages installed successfully.")
    except Exception as e:
        print("Failed to install required packages automatically. Please run:")
        print(f"    {sys.executable} -m pip install {' '.join(missing)}")
        raise


# Bootstrap deps before importing third-party modules
_ensure_min_deps()

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

ALLOWED_ORIGINS = {"http://localhost:5173", "http://127.0.0.1:5173"}

@app.after_request
def _add_cors_headers(resp):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        resp.headers['Access-Control-Allow-Origin'] = origin
    else:
        # fallback - pick one stable origin (helps with file:// or missing origin cases)
        resp.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5173'
    resp.headers['Vary'] = 'Origin'
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return resp

# Store running processes
running_processes = {}

# ---------------------- Helpers: per-game deps ----------------------

_PKG_MODULE_MAP = {
    "opencv-python": "cv2",
    "numpy": "numpy",
    "mediapipe": "mediapipe",
    "tensorflow": "tensorflow",
    "Pillow": "PIL",
    "fer": "fer",
}

_GAME_DEPS = {
    # Color & Shape rely on OpenCV + NumPy only
    "color": ["opencv-python", "numpy"],
    "shape": ["opencv-python", "numpy"],
    # Gesture requires MediaPipe in addition
    "gesture": ["opencv-python", "numpy", "mediapipe"],
    # Emotion game here uses only OpenCV Haar cascades
    "emotion": ["opencv-python"],
}

def _missing_modules(packages):
    missing = []
    for pkg in packages:
        mod = _PKG_MODULE_MAP.get(pkg, pkg)
        try:
            __import__(mod)
        except ImportError:
            missing.append(pkg)
    return missing

def _pip_install(packages):
    if not packages:
        return
    try:
        subprocess.run([sys.executable, "-m", "ensurepip", "--upgrade"], check=False)
    except Exception:
        pass
    print(f"Installing required packages for game: {', '.join(packages)} ...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", *packages])
    print("Package installation completed.")

def _ensure_game_deps(game_name: str):
    pkgs = _GAME_DEPS.get(game_name, [])
    if not pkgs:
        return
    missing = _missing_modules(pkgs)
    if not missing:
        return
    
    # For gesture game, if MediaPipe is missing, just warn but don't fail
    if game_name == "gesture" and "mediapipe" in missing:
        print(f"⚠️  Warning: MediaPipe not available for gesture recognition. Using fallback mode.")
        # Remove mediapipe from missing list so we don't try to install it
        missing = [pkg for pkg in missing if pkg != "mediapipe"]
        if not missing:
            return
    
    try:
        _pip_install(missing)
    except subprocess.CalledProcessError:
        # Provide a helpful error for heavy packages on newer Python versions
        raise RuntimeError(
            (
                f"Could not install required packages automatically: {', '.join(missing)}. "
                "If this is a vision or ML dependency (e.g., mediapipe/tensorflow), it may not have a wheel for your Python version. "
                "Try running this backend with Python 3.11 and then install requirements again."
            )
        )

@app.route('/')
def home():
    return jsonify({"message": "🎯 Flask backend is running!", "status": "online"})

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "running_processes": list(running_processes.keys())})

@app.route('/test-env')
def test_environment():
    try:
        import cv2
        opencv_version = cv2.__version__
    except ImportError:
        opencv_version = "Not installed"
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    face_dir = os.path.join(base_dir, "face")
    
    face_scripts = []
    try:
        if os.path.exists(face_dir):
            face_scripts = [f for f in os.listdir(face_dir) if f.endswith('.py')]
    except Exception as e:
        face_scripts = [f"Error listing: {e}"]
    
    return jsonify({
        "python_executable": sys.executable,
        "base_dir": base_dir,
        "face_dir": face_dir,
        "face_dir_exists": os.path.exists(face_dir),
        "opencv_version": opencv_version,
        "current_cwd": os.getcwd(),
        "face_scripts": face_scripts,
        "python_path": sys.path[:3],  # First 3 entries
        "platform": sys.platform,
        "running_processes": list(running_processes.keys())
    })

GAME_SCRIPTS = {
    "color": "color_identifier.py",
    "shape": "shape.py",
    "emotion": "emotion_game.py",
    # gesture handled dynamically below for mediapipe fallback
}

@app.route('/game/<game_name>/start', methods=['POST', 'OPTIONS'])
def unified_start(game_name):
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    if game_name == 'gesture':
        try:
            import mediapipe  # noqa: F401
            script = 'gesture_recognition.py'
        except ImportError:
            print("MediaPipe not available, using fallback gesture recognition")
            script = 'gesture_recognition_fallback.py'
        return start_game_process('gesture', script)
    script = GAME_SCRIPTS.get(game_name)
    if not script:
        return jsonify({"error": f"Unknown game '{game_name}'"}), 404
    return start_game_process(game_name, script)

@app.route('/game/<game_name>/stop', methods=['POST', 'OPTIONS'])
def unified_stop(game_name):
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    return stop_game_process(game_name)

def _cors_preflight_ok():
    resp = make_response('', 204)
    # after_request will append the rest; still ensure basic headers here
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        resp.headers['Access-Control-Allow-Origin'] = origin
    else:
        resp.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5173'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp


def start_game_process(game_name, script_name):
    try:
        # If already running, just report success
        if game_name in running_processes and running_processes[game_name].poll() is None:
            return jsonify({
                "message": f"{game_name.capitalize()} game already running",
                "process_id": running_processes[game_name].pid,
                "status": "running"
            })
        # Stop existing process if running
        if game_name in running_processes:
            stop_game_process(game_name)
            time.sleep(1)  # Give it a moment to stop

        # Resolve absolute path to the game script (stable regardless of CWD)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(base_dir, "face", script_name)
        
        # ADD DEBUG LOGGING
        print(f"🔍 Debug Info for {game_name}:")
        print(f"   Base dir: {base_dir}")
        print(f"   Script path: {script_path}")
        print(f"   Script exists: {os.path.exists(script_path)}")
        print(f"   Current working directory: {os.getcwd()}")

        if not os.path.exists(script_path):
            return jsonify({"error": f"Script {script_name} not found at {script_path}"}), 404

        # Ensure per-game dependencies are present before starting the process
        _ensure_game_deps(game_name)

        # Start the process
        env = os.environ.copy()
        # ADD THIS: Set the working directory to the face folder
        face_dir = os.path.join(base_dir, "face")
        
        # Prepare log files for debugging
        log_dir = os.path.join(base_dir, "logs")
        os.makedirs(log_dir, exist_ok=True)
        stdout_path = os.path.join(log_dir, f"{game_name}.out.log")
        stderr_path = os.path.join(log_dir, f"{game_name}.err.log")
        stdout_f = open(stdout_path, "ab")
        stderr_f = open(stderr_path, "ab")
        if sys.platform == "win32":
            env.setdefault("OPENCV_VIDEOIO_PRIORITY_MSMF", "0")
        # Force UTF-8 so emoji / unicode logs won't crash in child process redirected to file (Windows default cp1252)
        env.setdefault("PYTHONIOENCODING", "utf-8")
        env.setdefault("PYTHONUTF8", "1")

        if sys.platform == "win32":
            command = [sys.executable, script_path]
            creationflags = subprocess.CREATE_NEW_PROCESS_GROUP  # no extra console window
            process = subprocess.Popen(
                command,
                stdout=stdout_f,
                stderr=stderr_f,
                creationflags=creationflags,
                cwd=face_dir,
                env=env,
            )
        else:
            command = [sys.executable, script_path]
            process = subprocess.Popen(
                command,
                stdout=stdout_f,
                stderr=stderr_f,
                cwd=face_dir,
                env=env,
            )

        # Quick sanity check: if the process exits immediately, report an error
        time.sleep(2.0)  # INCREASED: Give more time for startup
        if process.poll() is not None:
            # Try to read the last few lines of stderr for diagnostics
            log_tail = []
            stdout_tail = []
            try:
                stderr_f.flush()
                stdout_f.flush()
                stderr_f.close()
                stdout_f.close()
                
                # Read stderr
                with open(stderr_path, "rb") as rf:
                    rf.seek(0, os.SEEK_END)
                    size = rf.tell()
                    if size > 0:
                        rf.seek(max(0, size - 2000))
                        data = rf.read().decode(errors="ignore")
                        log_tail = data.splitlines()[-20:] if data.strip() else []
                
                # Read stdout
                with open(stdout_path, "rb") as rf:
                    rf.seek(0, os.SEEK_END)
                    size = rf.tell()
                    if size > 0:
                        rf.seek(max(0, size - 2000))
                        data = rf.read().decode(errors="ignore")
                        stdout_tail = data.splitlines()[-20:] if data.strip() else []
                        
            except Exception as e:
                log_tail.append(f"Error reading logs: {e}")
                
            print(f"❌ Process {game_name} exited immediately with code {process.returncode}")
            print(f"Stderr: {log_tail}")
            print(f"Stdout: {stdout_tail}")
            
            return jsonify({
                "error": (
                    f"Failed to start {game_name} game (process exited immediately). "
                    "Ensure required dependencies are installed and your webcam is accessible. "
                    "Required: opencv-python, numpy (plus mediapipe for gestures)."
                ),
                "exit_code": process.returncode,
                "stderr_tail": log_tail,
                "stdout_tail": stdout_tail,
                "stderr_log": stderr_path,
                "stdout_log": stdout_path,
            }), 500

        running_processes[game_name] = process

        return jsonify({
            "message": f"{game_name.capitalize()} game started successfully!",
            "process_id": process.pid,
            "status": "running"
        })

    except Exception as e:
        return jsonify({"error": f"Failed to start {game_name} game: {str(e)}"}), 500


def stop_game_process(game_name):
    try:
        if game_name not in running_processes:
            return jsonify({"message": f"{game_name.capitalize()} game was not running"})

        process = running_processes[game_name]

        if sys.platform == "win32":
            # For Windows, send CTRL_BREAK_EVENT
            try:
                process.send_signal(signal.CTRL_BREAK_EVENT)
            except Exception:
                process.terminate()
        else:
            process.terminate()

        # Wait for process to finish
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()

        del running_processes[game_name]
        
        # ADD: Give camera time to be released
        time.sleep(2)

        return jsonify({
            "message": f"{game_name.capitalize()} game stopped successfully!",
            "status": "stopped"
        })

    except Exception as e:
        return jsonify({"error": f"Failed to stop {game_name} game: {str(e)}"}), 500


@app.route('/stop-all', methods=['POST'])
def stop_all_games():
    stopped_games = []
    for game_name in list(running_processes.keys()):
        stop_game_process(game_name)
        stopped_games.append(game_name)

    return jsonify({
        "message": "All games stopped",
        "stopped_games": stopped_games
    })


## ------------- Diagnostics: fetch log tails -------------
@app.route('/logs/<game_name>', methods=['GET'])
def get_game_logs(game_name):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    log_dir = os.path.join(base_dir, 'logs')
    stderr_path = os.path.join(log_dir, f"{game_name}.err.log")
    stdout_path = os.path.join(log_dir, f"{game_name}.out.log")
    def _tail(path):
        if not os.path.exists(path):
            return []
        try:
            with open(path, 'rb') as f:
                f.seek(0, os.SEEK_END)
                size = f.tell()
                f.seek(max(0, size - 4000))
                data = f.read().decode(errors='ignore')
                return data.splitlines()[-60:]
        except Exception as e:
            return [f"Error reading {path}: {e}"]
    return jsonify({
        "stderr": _tail(stderr_path),
        "stdout": _tail(stdout_path),
        "running": game_name in running_processes and running_processes[game_name].poll() is None
    })

# --- Backwards compatibility routes (old endpoint names) ---
@app.route('/start-color', methods=['POST','OPTIONS'])
def _old_start_color():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /start-color used')
    return unified_start('color')

@app.route('/stop-color', methods=['POST','OPTIONS'])
def _old_stop_color():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /stop-color used')
    return unified_stop('color')

@app.route('/start-shape', methods=['POST','OPTIONS'])
def _old_start_shape():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /start-shape used')
    return unified_start('shape')

@app.route('/stop-shape', methods=['POST','OPTIONS'])
def _old_stop_shape():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /stop-shape used')
    return unified_stop('shape')

@app.route('/start-emotion', methods=['POST','OPTIONS'])
def _old_start_emotion():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /start-emotion used')
    return unified_start('emotion')

@app.route('/stop-emotion', methods=['POST','OPTIONS'])
def _old_stop_emotion():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /stop-emotion used')
    return unified_stop('emotion')

@app.route('/start-gesture', methods=['POST','OPTIONS'])
def _old_start_gesture():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /start-gesture used')
    return unified_start('gesture')

@app.route('/stop-gesture', methods=['POST','OPTIONS'])
def _old_stop_gesture():
    if request.method == 'OPTIONS':
        return _cors_preflight_ok()
    print('[Compat] /stop-gesture used')
    return unified_stop('gesture')


if __name__ == '__main__':
    # Ensure all routes above are registered before starting server.
    FIXED_PORT = 5003
    print(f"[BOOT] Starting backend on http://127.0.0.1:{FIXED_PORT} (debug=False, no reloader)")
    print("[BOOT] Python:", sys.executable)
    print("[BOOT] Working dir:", os.getcwd())
    print("[BOOT] File location:", __file__)
    try:
        print("[BOOT] Entering Flask event loop...")
        app.run(host="127.0.0.1", port= FIXED_PORT, debug=False, use_reloader=False)
        print("[SHUTDOWN] app.run() returned (this should normally only happen on server stop).")
    except Exception as e:
        import traceback
        print("[FATAL] Exception during app.run:", e)
        traceback.print_exc()
    finally:
        print("[CLEANUP] Stopping any running game processes...")
        for game_name in list(running_processes.keys()):
            stop_game_process(game_name)
        print("[CLEANUP] Done.")
