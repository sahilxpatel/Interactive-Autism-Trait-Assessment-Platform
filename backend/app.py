from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import sys
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "🎯 Flask backend is running!"

# --- Color Game ---
@app.route('/start-color', methods=['POST'])
def start_color_game():
    return run_script("color_identifier.py")

@app.route('/stop/color', methods=['POST'])
def stop_color():
    return stop_script("color_identifier.py")

# --- Gesture Game ---
@app.route('/start-gesture', methods=['POST'])
def start_gesture_game():
    return run_script("gesture_recognition.py")

@app.route('/stop/gesture', methods=['POST'])
def stop_gesture():
    return stop_script("gesture_recognition.py")

# --- Shape Game ---
@app.route('/start-shape', methods=['POST'])
def start_shape_game():
    return run_script("shape.py")

@app.route('/stop/shape', methods=['POST'])
def stop_shape():
    return stop_script("shape.py")

# --- Emotion Game --- ✅ NEW
@app.route('/start-emotion', methods=['POST'])
def start_emotion_game():
    return run_script("emotion_game.py")

@app.route('/stop/emotion', methods=['POST'])
def stop_emotion():
    return stop_script("emotion_game.py")

def run_script(script_name):
    try:
        script_path = os.path.join("face", script_name)
        command = ["python", script_path] if sys.platform == "win32" else ["python3", script_path]
        subprocess.Popen(command)
        return jsonify({"message": f"{script_name} started!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def stop_script(script_name):
    try:
        if sys.platform == "win32":
            os.system("taskkill /f /im python.exe >nul 2>&1")
        else:
            os.system(f"pkill -f {script_name}")
        return jsonify({"message": f"{script_name} stopped."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True)
