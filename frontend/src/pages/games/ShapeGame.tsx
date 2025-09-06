import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function ShapeGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showInstructions, setShowInstructions] = useState(true);

  const shapes = [
    { name: 'Circle', emoji: '⭕', description: 'Round objects like plates, coins' },
    { name: 'Square', emoji: '⬜', description: 'Four equal sides like books, boxes' },
    { name: 'Triangle', emoji: '🔺', description: 'Three-sided shapes like road signs' },
    { name: 'Rectangle', emoji: '⬛', description: 'Four sides, opposite sides equal' },
    { name: 'Pentagon', emoji: '⬠', description: 'Five-sided shapes' },
    { name: 'Hexagon', emoji: '⬡', description: 'Six-sided shapes like honeycomb' }
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
      setIsRunning(true);

      const response = await fetch("http://127.0.0.1:5003/start-shape", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start the shape game.");
      }

      setTimeLeft(120);
      console.log(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting game");
      setIsRunning(false);
    }
  };

  const stopGame = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5003/stop-shape", {
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
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔷 Shape Recognition Game</h1>
          <p className="text-gray-600 text-lg">Show different shaped objects to the camera and watch them get detected!</p>
        </div>

        {showInstructions && (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-green-800">🎯 How to Play:</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Find objects around you with different shapes</li>
              <li>• Hold them up to the camera one at a time</li>
              <li>• The AI will detect and identify the shapes for you</li>
              <li>• Try to find as many different shapes as possible!</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-600"><strong>Age Range:</strong> 4–12 years</p>
              <p className="text-sm text-gray-600"><strong>Duration:</strong> 2 minutes</p>
              <p className="text-sm text-gray-600"><strong>Skills:</strong> Shape recognition, spatial awareness</p>
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
              {isRunning ? "🔍 Detecting Shapes..." : "🔷 Ready to Start"}
            </div>
            <div className="text-lg font-mono">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">🎯 Shapes to Find:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shapes.map((shape, index) => (
              <div 
                key={index}
                className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200"
              >
                <div className="text-3xl mb-2">{shape.emoji}</div>
                <h4 className="font-semibold text-gray-800">{shape.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{shape.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startGame}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
            >
              ▶ Start Shape Detection
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
            onClick={() => navigate("/")}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            🏠 Home
          </button>
        </div>

        {isRunning && (
          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              🎮 Game is running... Show shapes to your camera!
            </div>
            <p className="text-sm text-gray-600">
              Look for the camera window. Hold up objects with different shapes!
            </p>
          </div>
        )}

        {!isRunning && timeLeft === 0 && (
          <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Excellent Work!</h3>
            <p className="text-lg">You practiced shape recognition! This helps develop spatial awareness and geometry skills.</p>
          </div>
        )}

        <div className="mt-8 bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">💡 Shape Hunting Tips:</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Look around your room for objects with clear shapes</li>
            <li>• Try books (rectangles), plates (circles), triangular rulers</li>
            <li>• Hold objects flat and centered in front of the camera</li>
            <li>• Make sure the object edges are clearly visible</li>
            <li>• Press 'q' in the camera window to close it manually</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
