import cv2
import mediapipe as mp
import numpy as np
import sys
import time
import os

def _force_utf8():
    if sys.platform.startswith("win"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

_force_utf8()

# Constants
WINDOW_NAME = "Gesture Recognition Game"
FONT = cv2.FONT_HERSHEY_SIMPLEX
TEXT_COLOR = (0, 255, 0)
QUIT_KEY = 'q'

class GestureRecognitionApp:
    """
    A webcam-based hand gesture recognition application using MediaPipe.
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

        # Initialize MediaPipe hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils

        self.detected_gestures = []
        self.last_detection_time = time.time()

    def detect_gesture(self, landmarks):
        """
        Detect gesture based on hand landmarks.
        Returns the name of the detected gesture.
        """
        # Get landmark coordinates
        thumb_tip = landmarks[4]
        thumb_ip = landmarks[3]
        index_tip = landmarks[8]
        index_pip = landmarks[6]
        middle_tip = landmarks[12]
        middle_pip = landmarks[10]
        ring_tip = landmarks[16]
        ring_pip = landmarks[14]
        pinky_tip = landmarks[20]
        pinky_pip = landmarks[18]

        # Count extended fingers
        fingers_up = []

        # Thumb
        if thumb_tip.x > thumb_ip.x:  # Right hand
            fingers_up.append(thumb_tip.x > thumb_ip.x)
        else:  # Left hand
            fingers_up.append(thumb_tip.x < thumb_ip.x)

        # Other fingers
        fingers_up.append(index_tip.y < index_pip.y)
        fingers_up.append(middle_tip.y < middle_pip.y)
        fingers_up.append(ring_tip.y < ring_pip.y)
        fingers_up.append(pinky_tip.y < pinky_pip.y)

        total_fingers = fingers_up.count(True)

        # Gesture recognition logic
        if total_fingers == 0:
            return "Fist"
        elif total_fingers == 1:
            if fingers_up[1]:  # Only index finger
                return "Pointing"
            elif fingers_up[0]:  # Only thumb
                return "Thumbs Up"
            else:
                return "One Finger"
        elif total_fingers == 2:
            if fingers_up[1] and fingers_up[2]:  # Index and middle
                return "Peace Sign"
            elif fingers_up[0] and fingers_up[1]:  # Thumb and index
                return "Gun"
            else:
                return "Two Fingers"
        elif total_fingers == 3:
            if fingers_up[0] and fingers_up[1] and fingers_up[2]:
                return "Three Fingers"
            else:
                return "Three Fingers"
        elif total_fingers == 4:
            return "Four Fingers"
        elif total_fingers == 5:
            return "Open Hand"
        else:
            return "Unknown"

    def _process_frame(self, frame):
        """
        Process each frame for gesture recognition and display results.
        """
        # Convert BGR to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)

        # Draw hand landmarks and detect gestures
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw landmarks
                self.mp_drawing.draw_landmarks(
                    frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS
                )

                # Detect gesture
                gesture = self.detect_gesture(hand_landmarks.landmark)
                
                # Get hand center for text placement
                landmark_list = []
                for landmark in hand_landmarks.landmark:
                    height, width, _ = frame.shape
                    x, y = int(landmark.x * width), int(landmark.y * height)
                    landmark_list.append([x, y])

                if landmark_list:
                    # Calculate center point
                    center_x = sum([point[0] for point in landmark_list]) // len(landmark_list)
                    center_y = sum([point[1] for point in landmark_list]) // len(landmark_list)

                    # Display gesture name
                    cv2.putText(frame, gesture, (center_x - 50, center_y - 50), 
                               FONT, 1, TEXT_COLOR, 2)

                    # Log gesture
                    current_time = time.time()
                    if current_time - self.last_detection_time > 1:
                        self.detected_gestures.append(gesture)
                        self.last_detection_time = current_time
                        print(f"Detected gesture: {gesture}")

        # Display instructions
        cv2.putText(frame, "Show hand gestures to the camera!", (10, 30), 
                   FONT, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, "Try: Fist, Peace, Thumbs Up, Open Hand", (10, 60), 
                   FONT, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, "Press 'q' to quit", (10, 90), FONT, 0.5, (255, 255, 255), 1)

        return frame

    def run(self) -> None:
        """Main loop for capturing and displaying video."""
        try:
            print("👋 Gesture Recognition Game Started!")
        except Exception:
            print("Gesture Recognition Game Started!")
        print("Show different hand gestures to the camera")
        print("Try gestures like: Fist, Peace Sign, Thumbs Up, Open Hand, Pointing")
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
        print("🎯 Game Summary:")
        if self.detected_gestures:
            unique_gestures = set(self.detected_gestures)
            print(f"You performed {len(unique_gestures)} different gestures: {', '.join(unique_gestures)}")
            print(f"Total gestures detected: {len(self.detected_gestures)}")
        else:
            print("No gestures were detected. Try again!")
        
        print("Releasing resources and closing windows...")
        self.cap.release()
        cv2.destroyAllWindows()


def main():
    app = GestureRecognitionApp(camera_index=0)
    app.run()


if __name__ == '__main__':
    main()
