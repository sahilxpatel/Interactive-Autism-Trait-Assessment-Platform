import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GestureGame: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const gestures = [
    { name: 'Thumbs Up', emoji: '👍', description: 'Show approval or success' },
    { name: 'Peace Sign', emoji: '✌️', description: 'Two fingers in V shape' },
    { name: 'Pointing', emoji: '👉', description: 'Point with index finger' },
    { name: 'Open Hand', emoji: '🖐️', description: 'All five fingers open' },
    { name: 'Fist', emoji: '✊', description: 'Closed hand' },
    { name: 'OK Sign', emoji: '👌', description: 'Thumb and index finger circle' }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            stopGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startGame = async () => {
    try {
      setError(null);
      setShowInstructions(false);
      
      const response = await fetch("http://127.0.0.1:5003/start-gesture", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to start gesture recognition.");
      }

      setIsRunning(true);
      setTimeLeft(120);

      console.log(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting gesture recognition");
      setIsRunning(false);
    }
  };

  const stopGame = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5003/stop-gesture", {
        method: "POST",
      });

      const data = await response.json();
      setIsRunning(false);
      
      console.log(data.message);
    } catch (err) {
      console.error("Error stopping game:", err);
    }
  };

  const resetGame = () => {
    setTimeLeft(120);
    setIsRunning(false);
    setError(null);
    setShowInstructions(true);
  };

  useEffect(() => {
    if (location.state?.autoStart) {
      startGame();
    }
  }, [location.state]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">👋 Gesture Recognition Game</h1>
          <p className="text-gray-600 text-lg">Show different hand gestures to the camera and watch them get recognized!</p>
        </div>

        {showInstructions && (
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-orange-800">🎯 How to Play:</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Make different hand gestures in front of your camera</li>
              <li>• Try the gestures shown below</li>
              <li>• The AI will detect and identify your gestures</li>
              <li>• Practice clear and deliberate hand movements</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-600"><strong>Age Range:</strong> 6–16 years</p>
              <p className="text-sm text-gray-600"><strong>Duration:</strong> 2 minutes</p>
              <p className="text-sm text-gray-600"><strong>Skills:</strong> Hand coordination, gesture communication</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              {isRunning ? "👋 Recognizing Gestures..." : "👋 Ready to Start"}
            </div>
            <div className="text-lg font-mono">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">🎯 Gestures to Try:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gestures.map((gesture, index) => (
              <div 
                key={index}
                className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-200"
              >
                <div className="text-3xl mb-2">{gesture.emoji}</div>
                <h4 className="font-semibold text-gray-800">{gesture.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{gesture.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startGame}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg"
            >
              ▶ Start Gesture Recognition
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              ⏸ Stop Recognition
            </button>
          )}

          {!isRunning && timeLeft < 120 && (
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              Reset Game
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            🏠 Home
          </button>
        </div>

        {isRunning && (
          <div className="text-center">
            <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-4">
              🎮 Game is running... Show gestures to your camera!
            </div>
            <p className="text-sm text-gray-600">
              Look for the camera window. Make clear hand gestures!
            </p>
          </div>
        )}

        {!isRunning && timeLeft === 0 && (
          <div className="text-center bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-orange-800 mb-2">🎉 Fantastic!</h3>
            <p className="text-lg">You practiced gesture recognition! This helps with non-verbal communication skills.</p>
          </div>
        )}

        <div className="mt-8 bg-orange-50 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-2">💡 Gesture Tips:</h4>
          <ul className="text-orange-700 text-sm space-y-1">
            <li>• Make sure your hand is clearly visible to the camera</li>
            <li>• Hold gestures steady for a few seconds</li>
            <li>• Use good lighting for better recognition</li>
            <li>• Keep your hand within the camera frame</li>
            <li>• Press 'q' in the camera window to close it manually</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GestureGame;
