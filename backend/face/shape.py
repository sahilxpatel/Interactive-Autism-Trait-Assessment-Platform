# backend/face/shape.py
import cv2
import sys
from typing import Tuple

# --- Constants for easy configuration and readability ---
WINDOW_NAME = "Face Shape Recognition"
FONT = cv2.FONT_HERSHEY_SIMPLEX
TEXT_COLOR_BGR: Tuple[int, int, int] = (0, 255, 255)  # Yellow in BGR format
QUIT_KEY = 'q'


class FaceShapeApp:
    """
    A class to encapsulate the application's logic for detecting face shapes
    from a webcam feed.
    """

    def __init__(self, camera_index: int = 0):
        """
        Initializes the video capture object.

        Args:
            camera_index (int): The index of the camera to use.
        """
        self.cap = cv2.VideoCapture(camera_index)
        if not self.cap.isOpened():
            print(f"Error: Webcam at index {camera_index} is not available or could not be opened.")
            sys.exit("Application exiting due to camera failure.")

    def _process_frame(self, frame):
        """
        Applies face shape recognition logic to a single video frame.
        (This is currently a placeholder).

        Args:
            frame: The input video frame from the webcam.

        Returns:
            The processed frame with annotations.
        """
        # --- TODO: Add your actual face shape recognition model here ---
        # For example, you might detect facial landmarks and then classify the shape.
        cv2.putText(
            img=frame,
            text="Detecting Shape...",
            org=(50, 50),
            fontFace=FONT,
            fontScale=1,
            color=TEXT_COLOR_BGR,
            thickness=2
        )
        return frame

    def run(self) -> None:
        """
        Starts the main application loop for video capture, processing, and display.
        """
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    print("Error: Failed to capture frame from webcam. Exiting.")
                    break

                processed_frame = self._process_frame(frame)
                cv2.imshow(WINDOW_NAME, processed_frame)

                # Wait for key press and check if it's the quit key
                if cv2.waitKey(1) & 0xFF == ord(QUIT_KEY):
                    print("'q' pressed, shutting down.")
                    break
        finally:
            # This block ensures resources are always released, even if an error occurs.
            self.cleanup()

    def cleanup(self) -> None:
        """Releases the camera and destroys all OpenCV windows."""
        print("Releasing resources...")
        self.cap.release()
        cv2.destroyAllWindows()


def main():
    """Main function to create and run the FaceShapeApp."""
    app = FaceShapeApp(camera_index=0)
    app.run()


if __name__ == '__main__':
    main()