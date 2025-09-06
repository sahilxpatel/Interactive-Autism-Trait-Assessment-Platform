import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ColorGame: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

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
      
      const response = await fetch("http://127.0.0.1:5003/start-color", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to start color detection.");
      }

      setIsRunning(true);
      setTimeLeft(120);

      // Show helpful message to user
      setError("🎥 Camera window should now be open! If you don't see it, check your taskbar or allow camera permissions. The game runs in a separate window.");

      console.log(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting color detection. Make sure the backend server is running.");
      setIsRunning(false);
    }
  };

  const stopGame = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5003/stop-color", {
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
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎨 Color Detection Game</h1>
          <p className="text-gray-600 text-lg">Show different colored objects to the camera and watch them get detected!</p>
        </div>

        {showInstructions && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-purple-800">🎯 How to Play:</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Hold up colorful objects in front of your camera</li>
              <li>• Try to show as many different colors as possible</li>
              <li>• The game will recognize and announce colors in real-time</li>
              <li>• You have 2 minutes to explore different colors!</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-600"><strong>Age Range:</strong> 4–12 years</p>
              <p className="text-sm text-gray-600"><strong>Duration:</strong> 2 minutes</p>
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
              {isRunning ? "Game Active" : "Game Stopped"}
            </div>
            <div className="text-lg font-mono">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startGame}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              ▶ Start Game
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              ⏸ Stop Game
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
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full">
              🎮 Game is running... Show colors to your camera!
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Look for the camera window that opened. Point colored objects at it!
            </p>
          </div>
        )}

        {!isRunning && timeLeft === 0 && (
          <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Game Complete!</h3>
            <p className="text-lg">Great job exploring colors! Check the camera window to see what was detected.</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Tips:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Try different colored toys, clothes, or books</li>
            <li>• Move objects closer or farther from the camera</li>
            <li>• Look for the camera window that opens separately</li>
            <li>• Press 'q' in the camera window to close it manually</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorGame;
