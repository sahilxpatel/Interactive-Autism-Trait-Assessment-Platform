import cv2
import sys
import time
import os
from typing import Tuple

def _force_utf8():
    if sys.platform.startswith("win"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

_force_utf8()

# --- Constants ---
WINDOW_NAME = "Emotion Detection Game"
FONT = cv2.FONT_HERSHEY_SIMPLEX
TEXT_COLOR: Tuple[int, int, int] = (255, 0, 0)  # Blue
QUIT_KEY = 'q'

class EmotionDetectorApp:
    """
    A webcam-based emotion detection application using OpenCV face detection
    and basic facial feature analysis for educational purposes.
    """

    def __init__(self, camera_index: int = 0):
        # Prefer DirectShow on Windows; fall back with warm-up attempts
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
        # Warm-up frames
        for _ in range(10):
            ok, _ = self.cap.read()
            if not ok:
                time.sleep(0.05)

        # Load face detector
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        self.smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
        
        self.detected_expressions = []
        self.last_detection_time = time.time()

    def detect_basic_emotion(self, face_roi):
        """
        Basic emotion detection based on facial features.
        This is a simplified approach for educational purposes.
        """
        gray_face = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY) if len(face_roi.shape) == 3 else face_roi
        
        # Detect eyes and smile
        eyes = self.eye_cascade.detectMultiScale(gray_face, 1.3, 5)
        smiles = self.smile_cascade.detectMultiScale(gray_face, 1.8, 20)
        
        # Simple heuristic-based emotion detection
        if len(smiles) > 0:
            return "Happy 😊"
        elif len(eyes) >= 2:
            # Calculate eye area ratio for basic emotion inference
            total_eye_area = sum([w * h for (x, y, w, h) in eyes])
            face_area = gray_face.shape[0] * gray_face.shape[1]
            eye_ratio = total_eye_area / face_area
            
            if eye_ratio > 0.02:
                return "Surprised 😮"
            elif eye_ratio < 0.01:
                return "Squinting 😑"
            else:
                return "Neutral 😐"
        elif len(eyes) == 1:
            return "Winking 😉"
        else:
            return "Eyes Closed 😴"

    def _process_frame(self, frame):
        """
        Detects faces and basic emotions in a frame and annotates the video stream.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        current_time = time.time()
        
        if len(faces) > 0:
            for (x, y, w, h) in faces:
                # Draw face rectangle
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                
                # Extract face region
                face_roi = frame[y:y+h, x:x+w]
                
                # Detect basic emotion
                emotion = self.detect_basic_emotion(face_roi)
                
                # Display emotion
                cv2.putText(
                    frame,
                    emotion,
                    (x, y - 10),
                    FONT,
                    0.9,
                    TEXT_COLOR,
                    2
                )
                
                # Log emotion detection
                if (current_time - self.last_detection_time > 2 and 
                    emotion not in self.detected_expressions[-3:]):  # Avoid duplicates
                    self.detected_expressions.append(emotion)
                    self.last_detection_time = current_time
                    print(f"Expression detected: {emotion}")
        else:
            cv2.putText(frame, "Show your face to the camera!", (50, 50), FONT, 0.8, (0, 0, 255), 2)

        # Add instructions and game info
        cv2.putText(frame, "Emotion Detection Game", (30, frame.shape[0] - 80), FONT, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, "Try different facial expressions!", (30, frame.shape[0] - 50), FONT, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, "Press 'q' to quit", (30, frame.shape[0] - 20), FONT, 0.5, (255, 255, 255), 1)
        
        # Show detected expressions count
        if self.detected_expressions:
            cv2.putText(frame, f"Expressions found: {len(self.detected_expressions)}", (30, 80), FONT, 0.6, (0, 255, 255), 2)

        return frame

    def run(self) -> None:
        """Main loop for capturing and displaying video."""
        try:
            print("😊 Emotion Detection Game Started!")
        except Exception:
            print("Emotion Detection Game Started!")
        print("Look at the camera and try different facial expressions")
        print("The system will detect basic emotions and expressions")
        print("Press 'q' to quit")
        
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    print("Error: Failed to capture frame. Exiting loop.")
                    break

                # Flip frame horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                processed_frame = self._process_frame(frame)
                cv2.imshow(WINDOW_NAME, processed_frame)

                if cv2.waitKey(1) & 0xFF == ord(QUIT_KEY):
                    break
        finally:
            self.cleanup()

    def cleanup(self) -> None:
        """Release camera and close all windows."""
        print("\n🎯 Game Summary:")
        if self.detected_expressions:
            unique_expressions = list(set(self.detected_expressions))
            print(f"You showed {len(unique_expressions)} different expressions:")
            for expr in unique_expressions:
                print(f"  • {expr}")
            print(f"Total expression changes: {len(self.detected_expressions)}")
        else:
            print("No expressions were clearly detected. Try again with better lighting!")
        
        print("Releasing resources and closing windows...")
        self.cap.release()
        cv2.destroyAllWindows()


def main():
    app = EmotionDetectorApp(camera_index=0)
    app.run()


if __name__ == '__main__':
    main()
