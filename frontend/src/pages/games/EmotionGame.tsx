import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmotionGame: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const emotions = ['😊 Happy', '😢 Sad', '😮 Surprised', '😠 Angry', '😐 Neutral', '😨 Fear'];

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

      const response = await fetch("http://127.0.0.1:5003/start-emotion", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to start emotion detection.");
      }

      setIsRunning(true);
      setTimeLeft(120);
      console.log(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting emotion detection");
      setIsRunning(false);
    }
  };

  const stopGame = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5003/stop-emotion", {
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
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-pink-50 to-yellow-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">😊 Emotion Detection Game</h1>
          <p className="text-gray-600 text-lg">Practice recognizing and expressing different emotions with AI!</p>
        </div>

        {showInstructions && (
          <div className="bg-gradient-to-r from-pink-100 to-yellow-100 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-pink-800">🎯 How to Play:</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Look at your camera and make different facial expressions</li>
              <li>• Try to express emotions like happy, sad, surprised, angry</li>
              <li>• The AI will detect and display your emotions in real-time</li>
              <li>• Practice expressing emotions clearly and naturally</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-600"><strong>Age Range:</strong> 5–15 years</p>
              <p className="text-sm text-gray-600"><strong>Duration:</strong> 2 minutes</p>
              <p className="text-sm text-gray-600"><strong>Benefits:</strong> Emotional recognition & expression</p>
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
              {isRunning ? "🎭 Detecting Emotions..." : "🎭 Ready to Start"}
            </div>
            <div className="text-lg font-mono">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">🎭 Emotions to Try:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {emotions.map((emotion, index) => (
              <div 
                key={index}
                className="text-center p-4 bg-gradient-to-br from-pink-50 to-yellow-50 rounded-lg border-2 border-pink-200"
              >
                <div className="text-2xl mb-2">{emotion.split(' ')[0]}</div>
                <p className="text-sm font-medium text-gray-700">{emotion.split(' ')[1]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startGame}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-pink-600 to-yellow-600 text-white rounded-lg hover:from-pink-700 hover:to-yellow-700 transition-all shadow-lg"
            >
              ▶ Start Emotion Detection
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              ⏸ Stop Detection
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
            <div className="inline-block bg-pink-100 text-pink-800 px-4 py-2 rounded-full mb-4">
              🎮 Game is running... Express emotions to your camera!
            </div>
            <p className="text-sm text-gray-600">
              Look for the camera window. Try making different facial expressions!
            </p>
          </div>
        )}

        {!isRunning && timeLeft === 0 && (
          <div className="text-center bg-gradient-to-r from-pink-100 to-yellow-100 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-pink-800 mb-2">🎉 Great Job!</h3>
            <p className="text-lg">You practiced expressing emotions! This helps with emotional awareness and communication.</p>
          </div>
        )}

        <div className="mt-8 bg-pink-50 rounded-lg p-4">
          <h4 className="font-semibold text-pink-800 mb-2">💡 Tips for Better Detection:</h4>
          <ul className="text-pink-700 text-sm space-y-1">
            <li>• Make sure your face is well-lit and clearly visible</li>
            <li>• Exaggerate your expressions to help the AI recognize them</li>
            <li>• Try holding each expression for a few seconds</li>
            <li>• Practice in front of a mirror first if needed</li>
            <li>• Press 'q' in the camera window to close it manually</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmotionGame;
