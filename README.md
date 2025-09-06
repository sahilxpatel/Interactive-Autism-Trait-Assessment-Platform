# 🧩 ASD Assessment Platform - Computer Vision Based Evaluation System

## 🎯 Project Overview
An innovative **Autism Spectrum Disorder (ASD) assessment platform** that leverages **computer vision** and **machine learning** to evaluate cognitive and behavioral patterns through interactive games. Built with a modern **Flask microservices backend** and **React frontend**, this platform provides objective, standardized assessment tools for healthcare professionals and researchers.

### 🏆 Key Features
- **Real-time Computer Vision Processing** using OpenCV, MediaPipe, and TensorFlow
- **Microservices Architecture** with isolated game processes
- **Smart Dependency Management** with automatic fallbacks
- **Privacy-First Design** - all processing happens locally
- **Cross-Platform Compatibility** (Windows/Mac/Linux)
- **Clinical-Grade Reliability** with comprehensive error handling

## 🛠️ Technology Stack

### Backend (Python/Flask)
- **Flask REST API** with CORS support
- **Computer Vision**: OpenCV, MediaPipe, TensorFlow, FER
- **Process Management**: Subprocess orchestration with health monitoring
- **Smart Dependencies**: Automatic installation and fallback mechanisms

### Frontend (React/TypeScript)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Modern UI Components** with responsive design
- **Real-time API Integration** with Flask backend

### Machine Learning Libraries
- **OpenCV 4.8+**: Core computer vision processing
- **MediaPipe**: Advanced hand/face landmark detection
- **TensorFlow**: Deep learning for emotion recognition
- **FER (Facial Emotion Recognition)**: Specialized emotion detection
- **NumPy**: Numerical computations and array processing

## 🚀 Installation & Setup

### System Requirements
- **Python 3.7+** (Recommended: Python 3.9-3.11)
- **Node.js 16+** and npm/yarn
- **Webcam/Camera** access
- **4GB+ RAM** for ML model processing
- **Windows 10+/macOS 10.14+/Ubuntu 18.04+**

### Quick Setup Guide

#### 1. Clone Repository
```bash
git clone <repository-url>
cd ASD-master
```

#### 2. Backend Setup
```bash
cd backend

# Install core dependencies
pip install flask flask-cors opencv-python numpy

# Start Flask server (auto-installs game-specific dependencies)
python app.py
```
**Backend runs at:** `http://127.0.0.1:5003`

#### 3. Frontend Setup
```bash
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```
**Frontend runs at:** `http://localhost:5173`

#### 4. Verify Installation
```bash
cd backend
python test_backend.py
```

## 🎮 Assessment Games & Clinical Applications

### 1. **Emotion Detection Game** 😊
**Clinical Purpose:** Evaluate emotional recognition and facial expression processing
- **Technology:** FER + TensorFlow for real-time emotion analysis
- **Detects:** Happy, sad, angry, surprised, neutral, disgust, fear
- **Metrics:** Response time, emotion variety, recognition accuracy
- **Target Age:** 5-15 years
- **Assessment Value:** Emotional intelligence, social cognition

### 2. **Gesture Recognition Game** 👋
**Clinical Purpose:** Assess motor coordination and non-verbal communication
- **Technology:** MediaPipe hand landmarks + contour analysis fallback
- **Detects:** Fist, pointing, peace sign, open hand, custom gestures
- **Metrics:** Gesture accuracy, motor consistency, coordination patterns
- **Target Age:** 6-16 years
- **Assessment Value:** Fine motor skills, gestural communication

### 3. **Color Recognition Game** 🎨
**Clinical Purpose:** Evaluate visual processing and categorization abilities
- **Technology:** HSV color space analysis with region-based detection
- **Detects:** Red, green, blue, yellow, purple, orange
- **Metrics:** Color identification speed, consistency, attention span
- **Target Age:** 4-12 years
- **Assessment Value:** Visual perception, categorical thinking

### 4. **Shape Detection Game** 🔷
**Clinical Purpose:** Test spatial awareness and geometric recognition
- **Technology:** Contour analysis with geometric property calculation
- **Detects:** Circle, square, triangle, rectangle, pentagon
- **Metrics:** Shape recognition accuracy, spatial processing speed
- **Target Age:** 4-12 years
- **Assessment Value:** Spatial intelligence, pattern recognition

## 🏗️ System Architecture

### Microservices Design
```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 5173)               │
├─────────────────────────────────────────────────────────────┤
│                    Flask API Gateway (Port 5003)            │
├─────────────────────────────────────────────────────────────┤
│  Process Manager  │  Dependency Manager  │  Health Monitor  │
├─────────────────────────────────────────────────────────────┤
│                    Game Subprocess Layer                    │
│    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│    │ Emotion     │    │ Gesture     │    │ Color/Shape │    │
│    │ Detection   │    │ Recognition │    │ Recognition │    │
│    └─────────────┘    └─────────────┘    └─────────────┘    │
├─────────────────────────────────────────────────────────────┤
│         Computer Vision Layer (OpenCV/MediaPipe/TF)         │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Benefits
- **Process Isolation:** Game crashes don't affect main server
- **Resource Management:** Efficient camera and memory handling
- **Scalability:** Multiple concurrent assessment sessions
- **Reliability:** Health monitoring with automatic recovery
- **Security:** Sandboxed game execution for clinical environments

## 🔧 Advanced Configuration

### Camera Optimization
```python
# Windows DirectShow backend for better camera performance
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_FPS, 30)
```

### Performance Tuning
- **Frame Processing:** Optimized to process every 3rd frame (10fps effective)
- **Memory Management:** Detection history limited to prevent memory leaks
- **Dependency Loading:** Smart caching of ML models
- **Resource Pooling:** Shared camera access across games

### Clinical Environment Setup
- **HIPAA Compliance:** Local processing only, no data persistence
- **Network Isolation:** Disable external network calls
- **Logging Configuration:** Detailed logs for clinical documentation
- **Error Recovery:** Automatic fallbacks for hardware issues

## 🛡️ Security & Privacy

### Healthcare-Grade Privacy
- ✅ **Local Processing Only** - No cloud dependencies
- ✅ **Zero Data Persistence** - Images/videos never saved
- ✅ **Memory-Only Processing** - Real-time analysis only
- ✅ **Automatic Cleanup** - No data remnants after sessions
- ✅ **Process Isolation** - Prevents data leakage between sessions

### Clinical Compliance
- **HIPAA Ready:** Designed for healthcare environments
- **Audit Logging:** Comprehensive session tracking
- **Access Control:** Process-level security boundaries
- **Data Minimization:** Only processes necessary visual data

## 🔬 Clinical Assessment Metrics

### Quantitative Measurements
- **Response Time Analysis:** Reaction speed to visual stimuli
- **Accuracy Scoring:** Correctness of interactions
- **Consistency Metrics:** Variability in performance
- **Attention Duration:** Sustained engagement periods
- **Pattern Recognition:** Ability to follow game instructions

### Behavioral Insights
- **Social Interaction Patterns:** Gesture and emotion recognition
- **Sensory Processing:** Color and shape discrimination
- **Motor Coordination:** Hand movement precision
- **Cognitive Flexibility:** Adaptation to different game contexts

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### Camera Problems
```bash
# Check camera availability
python -c "import cv2; print(cv2.VideoCapture(0).isOpened())"

# Windows: Ensure no other apps using camera
# Solution: Close Skype, Teams, OBS, etc.
```

#### Dependency Issues
```bash
# Reset environment
pip uninstall opencv-python opencv-contrib-python
pip install opencv-python==4.8.1.78

# For M1 Mac issues
conda install tensorflow-macos tensorflow-metal
```

#### Performance Issues
- **Low FPS:** Reduce camera resolution in game settings
- **High CPU:** Enable frame skipping in advanced config
- **Memory Usage:** Restart backend server periodically

#### Backend Connection
```bash
# Test backend health
curl http://127.0.0.1:5003/health

# Check process status
curl http://127.0.0.1:5003/health | jq '.running_processes'
```

## 📊 Development & Testing

### Backend Testing
```bash
cd backend
python test_backend.py  # Comprehensive system test
python -m pytest tests/ # Unit tests (if available)
```

### Frontend Testing
```bash
cd frontend
npm test           # Run test suite
npm run build      # Production build test
npm run preview    # Preview production build
```

### Performance Benchmarking
```bash
# Camera latency test
python backend/benchmark_camera.py

# ML model inference speed
python backend/benchmark_models.py
```

## 📁 Detailed Project Structure

```
ASD-master/
├── backend/                    # Flask backend server
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── test_backend.py        # System integration tests
│   ├── face/                  # Computer vision game modules
│   │   ├── emotion_game.py           # Emotion detection with FER
│   │   ├── gesture_recognition.py    # MediaPipe hand tracking
│   │   ├── gesture_recognition_fallback.py  # Contour-based fallback
│   │   ├── color_identifier.py       # HSV color detection
│   │   └── shape.py                  # Geometric shape analysis
│   ├── logs/                  # Application logs
│   └── utils/                 # Helper utilities
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   │   └── games/         # Individual game components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Frontend utilities
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   ├── package.json           # Node.js dependencies
│   └── vite.config.ts         # Vite build configuration
├── docs/                      # Documentation
├── tests/                     # Test suites
└── README.md                  # This file
```

## 🎓 Research & Clinical Applications

### Academic Use Cases
- **Autism Research:** Objective behavioral measurement
- **Developmental Psychology:** Cognitive milestone tracking
- **Computer Science:** CV/ML algorithm validation
- **Human-Computer Interaction:** Accessibility research

### Clinical Integration
- **Assessment Workflows:** Standardized evaluation protocols
- **Progress Monitoring:** Longitudinal tracking capabilities
- **Therapy Planning:** Data-driven intervention strategies
- **Outcome Measurement:** Quantitative progress metrics

## 🤝 Contributing & Development

### Development Setup
```bash
# Development mode with hot reload
cd backend && python app.py --debug
cd frontend && npm run dev

# Code formatting
pip install black isort
black backend/ && isort backend/

cd frontend && npm run lint && npm run format
```

### Extension Points
- **New Games:** Add modules to `backend/face/`
- **ML Models:** Integrate custom TensorFlow/PyTorch models
- **UI Components:** Extend React component library
- **Assessment Metrics:** Add custom evaluation algorithms

## 📞 Support & Documentation

### Getting Help
1. **Check this README** for setup and troubleshooting
2. **Run diagnostic tests** with `test_backend.py`
3. **Verify system requirements** and dependencies
4. **Check logs** in `backend/logs/` for detailed errors

### Production Deployment
- **Server Requirements:** 4GB+ RAM, Python 3.9+, camera access
- **Network Configuration:** Internal network only for privacy
- **Monitoring:** Health endpoint for system status
- **Backup Strategy:** Configuration and custom model backups

## ⚖️ Ethical Considerations & Disclaimer

### Important Notes
- **Educational Tool:** Designed for research and educational purposes
- **Clinical Supervision:** Requires qualified healthcare professional oversight
- **Not Diagnostic:** Cannot replace professional clinical assessment
- **Data Privacy:** Ensure compliance with local healthcare regulations

### Ethical AI Principles
- **Transparency:** Open-source algorithms and clear methodology
- **Fairness:** Tested across diverse populations
- **Privacy:** Local processing with no data collection
- **Accountability:** Clear limitations and appropriate use guidelines

---

## 🏆 Project Highlights

**This project demonstrates:**
- **Full-Stack Development:** React frontend + Flask backend
- **Computer Vision Engineering:** Real-time CV pipeline optimization
- **Machine Learning Integration:** Multiple ML frameworks coordination
- **System Architecture:** Microservices with process management
- **Healthcare Technology:** Privacy-compliant clinical software
- **Performance Engineering:** Real-time processing optimization

**Perfect for showcasing:**
- Modern web development practices
- Computer vision and ML expertise
- System design and architecture skills
- Healthcare technology understanding
- Production-ready software engineering

---

**🎉 Ready to revolutionize ASD assessment through technology!**

*For clinical use, please ensure compliance with local healthcare regulations and supervision by qualified professionals.*
