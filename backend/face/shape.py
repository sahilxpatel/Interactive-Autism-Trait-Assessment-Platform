import cv2
import numpy as np
import sys
import time

def _force_utf8():
    if sys.platform.startswith("win"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

_force_utf8()

# Constants
WINDOW_NAME = "Shape Detection Game"
FONT = cv2.FONT_HERSHEY_SIMPLEX
TEXT_COLOR = (0, 255, 0)
QUIT_KEY = 'q'

class ShapeDetectorApp:
    """
    A webcam-based shape detection application using OpenCV contour detection.
    """

    def __init__(self, camera_index: int = 0):
        self.cap = cv2.VideoCapture(camera_index)
        if not self.cap.isOpened():
            print(f"Error: Could not open video stream from camera index {camera_index}.")
            sys.exit("Exiting application.")

        self.detected_shapes = []
        self.last_detection_time = time.time()

    def detect_shapes(self, frame):
        """
        Detect geometric shapes in the frame using contour detection.
        """
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply edge detection
        edges = cv2.Canny(blurred, 50, 150)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        shapes_found = []
        
        for contour in contours:
            # Filter out small contours
            area = cv2.contourArea(contour)
            if area < 500:
                continue
            
            # Approximate the contour
            epsilon = 0.02 * cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, epsilon, True)
            
            # Determine shape based on number of vertices
            vertices = len(approx)
            shape_name = "Unknown"
            
            if vertices == 3:
                shape_name = "Triangle"
            elif vertices == 4:
                # Check if it's a square or rectangle
                x, y, w, h = cv2.boundingRect(approx)
                aspect_ratio = float(w) / h
                if 0.95 <= aspect_ratio <= 1.05:
                    shape_name = "Square"
                else:
                    shape_name = "Rectangle"
            elif vertices == 5:
                shape_name = "Pentagon"
            elif vertices == 6:
                shape_name = "Hexagon"
            elif vertices > 6:
                # Check if it's a circle
                area = cv2.contourArea(contour)
                perimeter = cv2.arcLength(contour, True)
                if perimeter > 0:
                    circularity = 4 * np.pi * area / (perimeter * perimeter)
                    if circularity > 0.7:
                        shape_name = "Circle"
                    else:
                        shape_name = "Polygon"
            
            # Draw the contour and label
            cv2.drawContours(frame, [contour], -1, (0, 255, 0), 2)
            
            # Get center point for text
            M = cv2.moments(contour)
            if M["m00"] != 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])
                
                # Draw shape name
                cv2.putText(frame, shape_name, (cx - 50, cy), FONT, 0.7, TEXT_COLOR, 2)
                
                shapes_found.append(shape_name)
        
        return frame, shapes_found

    def _process_frame(self, frame):
        """
        Process each frame for shape detection and display results.
        """
        processed_frame, shapes = self.detect_shapes(frame)
        
        # Display instructions
        cv2.putText(processed_frame, "Show shapes to the camera!", (10, 30), FONT, 0.7, (255, 255, 255), 2)
        cv2.putText(processed_frame, "Press 'q' to quit", (10, 60), FONT, 0.5, (255, 255, 255), 1)
        
        # Display detected shapes count
        if shapes:
            shapes_text = f"Found: {', '.join(set(shapes))}"
            cv2.putText(processed_frame, shapes_text, (10, processed_frame.shape[0] - 20), 
                       FONT, 0.6, (0, 255, 255), 2)
            
            # Update detected shapes list
            current_time = time.time()
            if current_time - self.last_detection_time > 1:  # Update every second
                self.detected_shapes.extend(shapes)
                self.last_detection_time = current_time
                print(f"Detected shapes: {', '.join(set(shapes))}")
        
        return processed_frame

    def run(self) -> None:
        """Main loop for capturing and displaying video."""
        try:
            print("🔷 Shape Detection Game Started!")
        except Exception:
            print("Shape Detection Game Started!")
        print("Show different shapes to the camera (triangles, squares, circles, etc.)")
        print("Press 'q' to quit")
        
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
        print("🎯 Game Summary:")
        if self.detected_shapes:
            unique_shapes = set(self.detected_shapes)
            print(f"You showed {len(unique_shapes)} different shapes: {', '.join(unique_shapes)}")
        else:
            print("No shapes were detected. Try again!")
        
        print("Releasing resources and closing windows...")
        self.cap.release()
        cv2.destroyAllWindows()


def main():
    app = ShapeDetectorApp(camera_index=0)
    app.run()


if __name__ == '__main__':
    main()

