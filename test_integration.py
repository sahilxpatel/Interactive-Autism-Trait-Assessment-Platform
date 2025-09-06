#!/usr/bin/env python3
"""
ASD Assessment Platform - Integration Test Script
This script tests the complete integration between frontend and backend
"""

import requests
import time
import sys
import os
import subprocess
import threading

def test_backend_connection():
    """Test if backend is running and responsive"""
    print("🔍 Testing backend connection...")
    try:
        response = requests.get("http://localhost:5003/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is running!")
            print(f"   Status: {data.get('status')}")
            print(f"   Running processes: {data.get('running_processes')}")
            return True
        else:
            print(f"❌ Backend responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running or not accessible")
        return False

def test_color_game_api():
    """Test color game API endpoints"""
    print("\n🎨 Testing Color Game API...")
    
    # Test start endpoint
    try:
        response = requests.post("http://localhost:5003/start-color")
        if response.status_code == 200:
            data = response.json()
            print("✅ Color game started successfully!")
            print(f"   Message: {data.get('message')}")
            print(f"   Process ID: {data.get('process_id')}")
            
            # Wait a moment for the process to start
            time.sleep(3)
            
            # Test stop endpoint
            response = requests.post("http://localhost:5003/stop-color")
            if response.status_code == 200:
                data = response.json()
                print("✅ Color game stopped successfully!")
                print(f"   Message: {data.get('message')}")
                return True
            else:
                print(f"❌ Failed to stop color game: {response.status_code}")
                return False
        else:
            print(f"❌ Failed to start color game: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing color game API: {e}")
        return False

def test_frontend_connection():
    """Test if frontend is accessible"""
    print("\n🌐 Testing frontend connection...")
    try:
        response = requests.get("http://localhost:5173")
        if response.status_code == 200:
            print("✅ Frontend is accessible!")
            return True
        else:
            print(f"❌ Frontend responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running or not accessible")
        print("   Make sure to run: npm run dev in the frontend directory")
        return False

def test_camera_access():
    """Test if camera is accessible"""
    print("\n📷 Testing camera access...")
    try:
        import cv2
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            print("✅ Camera is accessible!")
            cap.release()
            return True
        else:
            print("❌ Camera is not accessible")
            return False
    except ImportError:
        print("❌ OpenCV not installed")
        return False
    except Exception as e:
        print(f"❌ Error accessing camera: {e}")
        return False

def test_all_game_scripts():
    """Test all game scripts can be executed"""
    print("\n🎮 Testing all game scripts...")
    
    script_dir = "backend/face"
    scripts = [
        "color_identifier.py",
        "emotion_game.py", 
        "gesture_recognition.py",
        "shape.py"
    ]
    
    all_passed = True
    
    for script in scripts:
        script_path = os.path.join(script_dir, script)
        if os.path.exists(script_path):
            print(f"   ✅ {script} exists")
        else:
            print(f"   ❌ {script} not found")
            all_passed = False
    
    return all_passed

def main():
    """Run all integration tests"""
    print("🚀 ASD Assessment Platform - Integration Test")
    print("=" * 50)
    
    tests = [
        ("Backend Connection", test_backend_connection),
        ("Camera Access", test_camera_access),
        ("Game Scripts", test_all_game_scripts),
        ("Color Game API", test_color_game_api),
        ("Frontend Connection", test_frontend_connection),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        print("-" * 30)
        if test_func():
            passed += 1
        time.sleep(1)  # Small delay between tests
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The platform is ready to use!")
        print("\n📝 Instructions:")
        print("1. Make sure both servers are running:")
        print("   - Backend: python backend/app.py")
        print("   - Frontend: npm run dev (in frontend directory)")
        print("2. Open http://localhost:5173 in your browser")
        print("3. Click on any game to start playing!")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        
    return passed == total

if __name__ == "__main__":
    main()
