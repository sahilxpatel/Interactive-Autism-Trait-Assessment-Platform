import cv2
import dlib
import numpy as np

# Pre-trained face detector + landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

class FaceShapeApp:
    ...
    def _process_frame(self, frame: np.ndarray) -> np.ndarray:
        """
        Detects face shape using dlib landmarks and annotates the frame.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        for face in faces:
            landmarks = predictor(gray, face)
            points = np.array([[landmarks.part(n).x, landmarks.part(n).y] for n in range(68)])

            # Example metrics:
            jaw_width = np.linalg.norm(points[0] - points[16])   # left jaw to right jaw
            cheek_width = np.linalg.norm(points[3] - points[13]) # cheekbone width
            face_length = np.linalg.norm(points[8] - points[27]) # chin to nose bridge

            # --- Basic classification logic ---
            if abs(jaw_width - cheek_width) < 20:
                shape = "Square"
            elif face_length > jaw_width:
                shape = "Oval"
            else:
                shape = "Round"

            # Draw landmarks
            for (x, y) in points:
                cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

            # Label the face shape
            cv2.putText(
                frame,
                f"Face Shape: {shape}",
                (face.left(), face.top() - 10),
                FONT,
                0.7,
                (0, 255, 255),
                2
            )

        if not faces:
            cv2.putText(frame, "No face detected", (50, 50), FONT, 0.8, (0, 0, 255), 2)

        return frame

