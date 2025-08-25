import cv2
import sys
from typing import Tuple
from fer import FER

# --- Constants ---
WINDOW_NAME = "Emotion Detection"
FONT = cv2.FONT_HERSHEY_SIMPLEX
TEXT_COLOR: Tuple[int, int, int] = (255, 0, 0)  # Blue
QUIT_KEY = 'q'

class EmotionDetectorApp:
    """
    A webcam-based emotion detection application using a pre-trained FER model.
    """

    def __init__(self, camera_index: int = 0):
        self.cap = cv2.VideoCapture(camera_index)
        if not self.cap.isOpened():
            print(f"Error: Could not open video stream from camera index {camera_index}.")
            sys.exit("Exiting application.")

        # Initialize FER detector (with MTCNN face detection for accuracy)
        self.detector = FER(mtcnn=True)

    def _process_frame(self, frame):
        """
        Detects emotions in a frame and annotates the video stream.
        """
        # Run emotion detection
        results = self.detector.detect_emotions(frame)

        if results:
            for res in results:
                (x, y, w, h) = res["box"]
                emotions = res["emotions"]
                top_emotion = max(emotions, key=emotions.get)

                # Draw bounding box
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # Display detected emotion
                cv2.putText(
                    frame,
                    f"{top_emotion} ({emotions[top_emotion]:.2f})",
                    (x, y - 10),
                    FONT,
                    0.8,
                    TEXT_COLOR,
                    2
                )
        else:
            cv2.putText(frame, "No face detected", (50, 50), FONT, 0.8, (0, 0, 255), 2)

        return frame

    def run(self) -> None:
        """Main loop for capturing and displaying video."""
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    print("Error: Failed to capture frame. Exiting loop.")
                    break

                processed_frame = self._process_frame(frame)
                cv2.imshow(WINDOW_NAME, processed_frame)

                if cv2.waitKey(1) & 0xFF == ord(QUIT_KEY):
                    break
        finally:
            self.cleanup()

    def cleanup(self) -> None:
        """Release camera and close all windows."""
        print("Releasing resources and closing windows...")
        self.cap.release()
        cv2.destroyAllWindows()


def main():
    app = EmotionDetectorApp(camera_index=0)
    app.run()


if __name__ == '__main__':
    main()
