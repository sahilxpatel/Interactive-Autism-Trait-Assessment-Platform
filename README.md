# Interactive Autism Trait Assessment Platform

This platform is a web-based tool designed to provide a preliminary assessment of autism spectrum traits through a series of interactive games and a questionnaire. It is intended for informational and educational purposes and is **not a diagnostic tool**.

---

## 📜 Features

- **Interactive Games**: Engaging activities designed to assess different cognitive and behavioral traits.
  - **Emotion Recognition Game**: A game to test the user's ability to recognize emotional expressions.
  - **Shape Recognition Game**: A game that uses hand gestures to test coordination and shape recognition skills.
  - **Color Detection Game**: A real-time color identification game.
- **Autism Trait Questionnaire**: A 20-question test to evaluate a range of social, communicative, and behavioral traits associated with the autism spectrum.
- **Scoring and Analysis**: Provides a score and interpretation of results from the questionnaire to give users an indication of their traits.
- **User Authentication**: Secure user registration and login functionality using Firebase Authentication.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase
- **Animation**: Framer Motion

### Backend
- **Framework**: Flask
- **Language**: Python
- **Computer Vision**: OpenCV

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm (for the frontend)
- Python 3 and pip (for the backend)
- A webcam for the interactive games

---

### Installation & Setup

#### 🔧 Backend

1. Clone the repository:

```bash
git clone https://github.com/sahilxpatel/interactive-autism-trait-assessment-platform.git
cd interactive-autism-trait-assessment-platform/backend
```

2. Create and activate a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

The dependencies include:
- `flask`
- `opencv-python`
- `numpy`

4. Run the Flask server:

```bash
flask run --port 5003
```

The backend will be running at: [http://127.0.0.1:5003](http://127.0.0.1:5003)

---

#### 💻 Frontend

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install npm packages:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be running at: [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use)

---

## 📁 Project Structure

```
.
├── backend
│   ├── app.py              # Flask server setup and routes
│   ├── face
│   │   ├── color_identifier.py
│   │   ├── emotion_game.py
│   │   └── shape.py
│   └── requirements.txt    # Python dependencies
└── frontend
    ├── public/             # Static assets (images)
    ├── src/
    │   ├── components/     # Reusable React components
    │   ├── data/           # Questionnaire data
    │   ├── pages/          # Page components for each route
    │   ├── utils/          # Utility functions
    │   ├── App.tsx         # Main application component with routing
    │   └── main.tsx        # Entry point of the React application
    ├── package.json        # Frontend dependencies and scripts
    └── vite.config.ts      # Vite configuration
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please:
- Fork the repo
- Create a feature branch
- Commit your changes
- Open a pull request

### Example:

```bash
git checkout -b feature/AmazingFeature
git commit -m 'Add some AmazingFeature'
git push origin feature/AmazingFeature
```

Then, open a Pull Request 🚀

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📞 Contact

**Sahil Patel** - [@sahilxpatel](https://github.com/sahilxpatel)  
**Project Link**: [https://github.com/sahilxpatel/interactive-autism-trait-assessment-platform](https://github.com/sahilxpatel/interactive-autism-trait-assessment-platform)
