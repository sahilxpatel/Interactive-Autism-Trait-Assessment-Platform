import cv2
import numpy as np
import sys
import time
import os
from datetime import datetime

def _force_utf8():
    if sys.platform.startswith("win"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

_force_utf8()

color_ranges = {
    "Red": [(0, 120, 70), (10, 255, 255)],
    "Red2": [(170, 120, 70), (180, 255, 255)],  # red wraps around HSV
    "Green": [(36, 50, 70), (89, 255, 255)],
    "Light Green": [(50, 50, 70), (70, 255, 255)],
    "Blue": [(90, 50, 70), (128, 255, 255)],
    "Dark Blue": [(100, 150, 0), (140, 255, 255)],
    "Sky Blue": [(90, 100, 100), (100, 255, 255)],
    "Yellow": [(20, 100, 100), (40, 255, 255)],
    "Orange": [(10, 100, 20), (25, 255, 255)],
    "Purple": [(129, 50, 70), (158, 255, 255)],
    "Pink": [(160, 100, 100), (169, 255, 255)],
    "Magenta": [(140, 100, 100), (170, 255, 255)],
    "Brown": [(10, 100, 20), (20, 200, 150)],
    "White": [(0, 0, 200), (180, 30, 255)],
    "Grey": [(0, 0, 80), (180, 30, 200)],
    "Black": [(0, 0, 0), (180, 255, 50)],
    "Cyan": [(85, 50, 50), (95, 255, 255)],
}

def detect_color(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    detected_colors = []
    
    for color_name, (lower, upper) in color_ranges.items():
        mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
        if cv2.countNonZero(mask) > 5000:  # Minimum pixel threshold
            detected_colors.append(color_name.replace("2", ""))  # Merge Red + Red2
    
    # Return the most dominant color or the first detected
    if detected_colors:
        return detected_colors[0]
    return "Unknown"

def open_camera(index: int = 0, warmup_frames: int = 10, timeout_sec: float = 5.0):
    """Try multiple camera indices with warm-up; return first working capture or None."""
    candidate_indices = [index, 1, 2]
    seen = set()
    for idx in candidate_indices:
        if idx in seen:
            continue
        seen.add(idx)
        backend = cv2.CAP_ANY
        if sys.platform == "win32":
            backend = cv2.CAP_DSHOW
            os.environ.setdefault("OPENCV_VIDEOIO_PRIORITY_MSMF", "0")
        cap = cv2.VideoCapture(idx, backend)
        start = time.time()
        while not cap.isOpened() and (time.time() - start) < timeout_sec:
            time.sleep(0.1)
            cap.open(idx, backend)
        if not cap.isOpened():
            continue
        # Warm up frames
        for _ in range(warmup_frames):
            ok, _ = cap.read()
            if not ok:
                time.sleep(0.05)
        print(f"[ColorGame] Using camera index {idx}")
        return cap
    return None


def main():
    cap = open_camera(0)
    if cap is None:
        print("❌ Webcam not accessible on indices (0,1,2). Exiting.")
        time.sleep(2)
        sys.exit(2)

    font = cv2.FONT_HERSHEY_SIMPLEX
    detected_colors_history = []
    last_detection_time = time.time()
    current_color = "Unknown"
    color_confidence = 0
    
    try:
        print("🎨 Color Detection Game Started!")
    except Exception:
        print("Color Detection Game Started!")
    print("Show different colored objects to the camera")
    print("Press 'q' to quit")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Flip frame horizontally for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Detect color
        detected_color = detect_color(frame)
        current_time = time.time()
        
        # Update color tracking
        if detected_color != "Unknown":
            if detected_color == current_color:
                color_confidence += 1
            else:
                current_color = detected_color
                color_confidence = 1
            
            # Log new color detection
            if (current_time - last_detection_time > 2 and 
                color_confidence > 5 and 
                detected_color not in detected_colors_history[-3:]):  # Avoid rapid duplicates
                
                detected_colors_history.append(detected_color)
                last_detection_time = current_time
                try:
                    print(f"✅ New color detected: {detected_color}")
                except Exception:
                    print(f"New color detected: {detected_color}")
        
        # Create display info
        display_text = f"Current: {current_color}" if current_color != "Unknown" else "Show a colored object!"
        
        # Draw main color detection
        cv2.putText(frame, display_text, (30, 40), font, 1, (0, 255, 0), 2)
        
        # Draw instructions
        cv2.putText(frame, "Color Detection Game", (30, frame.shape[0] - 80), font, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, "Show colored objects to camera", (30, frame.shape[0] - 50), font, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, "Press 'q' to quit", (30, frame.shape[0] - 20), font, 0.5, (255, 255, 255), 1)
        
        # Draw detected colors history
        if detected_colors_history:
            y_offset = 80
            cv2.putText(frame, f"Colors Found: {len(detected_colors_history)}", (30, y_offset), font, 0.6, (0, 255, 255), 2)
            for i, color in enumerate(detected_colors_history[-5:]):  # Show last 5 colors
                y_pos = y_offset + 30 + (i * 25)
                cv2.putText(frame, f"• {color}", (50, y_pos), font, 0.5, (0, 255, 255), 1)

        # Add visual feedback
        if current_color != "Unknown":
            # Draw a colored rectangle as feedback
            color_map = {
                "Red": (0, 0, 255), "Blue": (255, 0, 0), "Green": (0, 255, 0),
                "Yellow": (0, 255, 255), "Orange": (0, 165, 255), "Purple": (128, 0, 128),
                "Pink": (203, 192, 255), "White": (255, 255, 255), "Black": (0, 0, 0),
                "Grey": (128, 128, 128), "Cyan": (255, 255, 0), "Brown": (42, 42, 165)
            }
            
            if current_color in color_map:
                color_bgr = color_map[current_color]
                cv2.rectangle(frame, (frame.shape[1] - 150, 30), (frame.shape[1] - 30, 100), color_bgr, -1)
                cv2.rectangle(frame, (frame.shape[1] - 150, 30), (frame.shape[1] - 30, 100), (0, 0, 0), 2)

        cv2.imshow("🎨 Color Detection Game", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    # Game summary
    try:
        print("\n🎯 Game Summary:")
    except Exception:
        print("\nGame Summary:")
    print(f"Total colors detected: {len(detected_colors_history)}")
    if detected_colors_history:
        print(f"Colors found: {', '.join(detected_colors_history)}")
    else:
        print("No colors were detected. Try showing more colorful objects!")
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
