import cv2
import sys
import time
import os
from typing import Tuple

# Constants
WINDOW_NAME = "Gesture Recognition Game (Fallback Mode)"
FONT = cv2.FONT_HERSHEY_SIMPLEX
TEXT_COLOR = (0, 255, 0)
QUIT_KEY = 'q'

class GestureFallbackApp:
    """
    A simplified gesture recognition app that doesn't require MediaPipe.
    Uses basic computer vision techniques for demonstration purposes.
    """

    def __init__(self, camera_index: int = 0):
        # Prefer DirectShow on Windows; warm up frames
        backend = cv2.CAP_ANY
        if sys.platform == "win32":
            backend = cv2.CAP_DSHOW
            os.environ.setdefault("OPENCV_VIDEOIO_PRIORITY_MSMF", "0")
        self.cap = cv2.VideoCapture(camera_index, backend)
        start = time.time()
        while not self.cap.isOpened() and (time.time() - start) < 5.0:
            time.sleep(0.1)
            self.cap.open(camera_index, backend)
        if not self.cap.isOpened():
            print(f"Error: Could not open video stream from camera index {camera_index}.")
            sys.exit("Exiting application.")
        for _ in range(10):
            ok, _ = self.cap.read()
            if not ok:
                time.sleep(0.05)

        self.detected_gestures = []
        self.last_detection_time = time.time()
        self.frame_count = 0

    def detect_simple_gesture(self, frame):
        """
        Simple gesture detection without MediaPipe.
        Uses basic contour detection and shape analysis.
        """
        # Convert to HSV for better color detection
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Define skin color range (this is a simplified approach)
        lower_skin = (0, 20, 70)
        upper_skin = (20, 255, 255)
        
        # Create mask for skin color
        mask = cv2.inRange(hsv, lower_skin, upper_skin)
        
        # Apply morphological operations to clean up the mask
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return "No Hand Detected"
        
        # Find the largest contour (assume it's the hand)
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Basic gesture recognition based on contour properties
        area = cv2.contourArea(largest_contour)
        if area < 1000:
            return "No Hand Detected"
        
        # Calculate convex hull and convexity defects
        hull = cv2.convexHull(largest_contour, returnPoints=False)
        if len(hull) > 3:
            defects = cv2.convexityDefects(largest_contour, hull)
            if defects is not None:
                defect_count = len(defects)
                
                # Simple gesture classification based on defects
                if defect_count == 0:
                    return "Fist"
                elif defect_count == 1:
                    return "Pointing"
                elif defect_count == 2:
                    return "Peace Sign"
                elif defect_count >= 3:
                    return "Open Hand"
        
        return "Unknown Gesture"

    def run(self):
        """Main application loop."""
        print("🎮 Starting Gesture Recognition Game (Fallback Mode)")
        print("📋 Instructions:")
        print("  - Show your hand to the camera")
        print("  - Try different gestures: fist, pointing, peace sign, open hand")
        print("  - Press 'q' to quit")
        print("  - Press 'r' to reset detection")
        print()

        while True:
            ret, frame = self.cap.read()
            if not ret:
                print("Failed to grab frame from camera")
                break

            # Flip frame horizontally for mirror effect
            frame = cv2.flip(frame, 1)
            self.frame_count += 1

            # Detect gesture every few frames to improve performance
            if self.frame_count % 3 == 0:
                current_time = time.time()
                gesture = self.detect_simple_gesture(frame)
                
                # Store gesture detection with timestamp
                if gesture != "No Hand Detected" and gesture != "Unknown Gesture":
                    if current_time - self.last_detection_time > 1.0:  # Avoid rapid duplicates
                        self.detected_gestures.append({
                            'gesture': gesture,
                            'timestamp': current_time
                        })
                        self.last_detection_time = current_time
                        print(f"✅ Detected: {gesture}")

            # Draw UI elements
            self.draw_ui(frame)

            # Display the frame
            cv2.imshow(WINDOW_NAME, frame)

            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord(QUIT_KEY):
                break
            elif key == ord('r'):
                self.detected_gestures.clear()
                print("🔄 Detection history reset")

        self.cleanup()

    def draw_ui(self, frame):
        """Draw user interface elements on the frame."""
        h, w = frame.shape[:2]
        
        # Draw title
        cv2.putText(frame, "Gesture Recognition (Fallback)", (10, 30), 
                   FONT, 0.7, TEXT_COLOR, 2)
        
        # Draw instructions
        cv2.putText(frame, "Show gestures to camera", (10, 60), 
                   FONT, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, "Press 'q' to quit, 'r' to reset", (10, 80), 
                   FONT, 0.5, (255, 255, 255), 1)
        
        # Draw detection count
        detection_count = len(self.detected_gestures)
        cv2.putText(frame, f"Gestures detected: {detection_count}", (10, h - 40), 
                   FONT, 0.6, TEXT_COLOR, 2)
        
        # Draw recent gestures
        recent_gestures = self.detected_gestures[-5:] if self.detected_gestures else []
        for i, detection in enumerate(recent_gestures):
            y_pos = h - 120 + i * 20
            gesture_text = f"• {detection['gesture']}"
            cv2.putText(frame, gesture_text, (10, y_pos), 
                       FONT, 0.4, (0, 255, 255), 1)

    def cleanup(self):
        """Clean up resources."""
        print(f"\n🎯 Game Summary:")
        print(f"   Total gestures detected: {len(self.detected_gestures)}")
        if self.detected_gestures:
            print("   Detected gestures:")
            for detection in self.detected_gestures:
                print(f"     - {detection['gesture']}")
        
        if self.cap:
            self.cap.release()
        cv2.destroyAllWindows()
        print("👋 Thanks for playing!")

def main():
    try:
        app = GestureFallbackApp()
        app.run()
    except KeyboardInterrupt:
        print("\n🛑 Interrupted by user")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
