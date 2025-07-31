import cv2
import numpy as np
import sys
import time
from datetime import datetime

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
    for color_name, (lower, upper) in color_ranges.items():
        mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
        if cv2.countNonZero(mask) > 5000:
            return color_name.replace("2", "")  # Merge Red + Red2
    return "Unknown"

def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Webcam not accessible.")
        input("Press Enter to close...")
        sys.exit(1)

    font = cv2.FONT_HERSHEY_SIMPLEX

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        color = detect_color(frame)
        print(f"Detected: {color}")
        cv2.putText(frame, f"Color: {color}", (30, 40), font, 1, (0, 255, 0), 2)

        cv2.imshow("Color Identifier", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
