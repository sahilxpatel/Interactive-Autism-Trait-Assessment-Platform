import cv2
import sys
from typing import Tuple

# --- Constants for easy configuration ---
WINDOW_NAME = "Emotion Detection"
FONT = cv2.FONT_HERSHEY_SIMPLEX
TEXT_COLOR: Tuple[int, int, int] = (255, 0, 0)  # Blue in BGR format
QUIT_KEY = 'q'

class EmotionDetectorApp:
    """
    A class to encapsulate webcam capture, frame processing, and display logic.
    """

    def __init__(self, camera_index: int = 0):
        """
        Initializes the video capture and checks if the camera is available.

        Args:
            camera_index (int): The index of the camera to use (e.g., 0 for the default webcam).
        """
        self.cap = cv2.VideoCapture(camera_index)
        if not self.cap.isOpened():
            print(f"Error: Could not open video stream from camera index {camera_index}.")
            sys.exit("Exiting application.") # Exit if camera fails to open

    def _process_frame(self, frame):
        """
        A placeholder method to apply emotion detection logic to a frame.

        Args:
            frame: The input frame from the webcam.

        Returns:
            The processed frame with annotations.
        """
        # --- Your emotion detection model/logic would be called here ---
        cv2.putText(frame, "Detecting Emotion...", (50, 50), FONT, 1, TEXT_COLOR, 2)
        return frame

    def run(self) -> None:
        """
        Starts the main application loop for capturing and displaying video.
        """
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    print("Error: Failed to capture frame. Exiting loop.")
                    break

                processed_frame = self._process_frame(frame)
                cv2.imshow(WINDOW_NAME, processed_frame)

                # Wait for 1ms and check if the 'q' key was pressed
                if cv2.waitKey(1) & 0xFF == ord(QUIT_KEY):
                    break
        finally:
            # Ensure resources are always released
            self.cleanup()

    def cleanup(self) -> None:
        """Releases the camera and destroys all OpenCV windows."""
        print("Releasing resources and closing windows...")
        self.cap.release()
        cv2.destroyAllWindows()

def main():
    """Main function to initialize and run the application."""
    app = EmotionDetectorApp(camera_index=0)
    app.run()

if __name__ == '__main__':
    main()