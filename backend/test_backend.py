import cv2
import sys

def test_camera():
    """Test if camera is accessible"""
    print("Testing camera access...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Camera not accessible")
        return False
    
    print("✅ Camera is accessible")
    
    # Test capturing a frame
    ret, frame = cap.read()
    if ret:
        print("✅ Camera can capture frames")
        print(f"Frame shape: {frame.shape}")
    else:
        print("❌ Camera cannot capture frames")
        cap.release()
        return False
    
    cap.release()
    return True

def test_basic_detection():
    """Test basic color detection without camera"""
    print("Testing color detection logic...")
    import numpy as np
    
    # Create a simple red image
    test_frame = np.zeros((100, 100, 3), dtype=np.uint8)
    test_frame[:, :] = [0, 0, 255]  # Red in BGR
    
    # Convert to HSV
    hsv = cv2.cvtColor(test_frame, cv2.COLOR_BGR2HSV)
    
    # Test red detection
    red_lower = np.array([0, 120, 70])
    red_upper = np.array([10, 255, 255])
    mask = cv2.inRange(hsv, red_lower, red_upper)
    
    if cv2.countNonZero(mask) > 5000:
        print("✅ Color detection logic works")
        return True
    else:
        print("❌ Color detection logic failed")
        return False

if __name__ == "__main__":
    print("🧪 Testing ASD Backend Components")
    print("=" * 40)
    
    # Test camera
    camera_ok = test_camera()
    
    # Test detection logic
    detection_ok = test_basic_detection()
    
    print("\n" + "=" * 40)
    print("🧪 Test Results:")
    print(f"Camera: {'✅ PASS' if camera_ok else '❌ FAIL'}")
    print(f"Detection: {'✅ PASS' if detection_ok else '❌ FAIL'}")
    
    if camera_ok and detection_ok:
        print("\n🎉 All tests passed! Backend should work correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the issues above.")
    
    print("\nPress Enter to exit...")
    input()
